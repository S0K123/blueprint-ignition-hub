import { useState } from "react";
import { FileText, UploadCloud } from "lucide-react";
import { parsePdfFile } from "@/lib/pdf-parser";
import { extractResearchSignals } from "@/lib/research-extractor";
import { setResearchExtraction } from "@/lib/research-context";
import { setSelectedPaper } from "@/lib/paper-context";
import type { ResearchExtraction } from "@/lib/research-types";
import { ExtractionPreview } from "@/components/ExtractionPreview";

type Props = {
  onParsed: (extraction: ResearchExtraction, fileName: string) => void;
  onRunMission: () => void;
};

export function ResearchParsePanel({ onParsed, onRunMission }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "parsing" | "done" | "failed">("idle");
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState<ResearchExtraction | null>(null);

  const runParse = async () => {
    if (!file) return;
    setStatus("parsing");
    setError("");
    try {
      const parsedPdf = await parsePdfFile(file);
      const extraction = extractResearchSignals(parsedPdf.text);
      setParsed(extraction);
      setResearchExtraction(extraction, file.name, parsedPdf.pageCount);
      setSelectedPaper({
        title: extraction.sections.title || file.name.replace(/\.pdf$/i, ""),
        authors: "Parsed from uploaded PDF",
        tag: "Research Parse",
      });
      onParsed(extraction, file.name);
      setStatus("done");
    } catch (e) {
      setResearchExtraction(null, file.name);
      setStatus("failed");
      setError((e as Error).message || "Unable to parse PDF; you can still use Quick Demo Mode.");
    }
  };

  return (
    <div className="glass rounded-2xl p-5 mt-4 space-y-4 text-left">
      <div className="flex items-center gap-2">
        <UploadCloud className="w-4 h-4 text-primary" />
        <h3 className="font-semibold">Upload Research Paper PDF</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Parse title, abstract, methodology, experiments, and conclusions to enrich blueprint generation.
      </p>
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <label className="inline-flex items-center gap-2 text-sm border border-border rounded-xl px-3 py-2 bg-background/40 cursor-pointer hover:border-primary/40">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span>{file ? file.name : "Choose PDF file"}</span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <button
          type="button"
          onClick={runParse}
          disabled={!file || status === "parsing"}
          className="inline-flex items-center justify-center gap-2 bg-gradient-hero text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-glow disabled:opacity-50"
        >
          {status === "parsing" ? "Parsing..." : "Parse & Extract"}
        </button>
      </div>
      {status === "failed" && <div className="text-sm text-amber">{error}</div>}
      {parsed && (
        <button
          type="button"
          onClick={onRunMission}
          className="inline-flex items-center justify-center gap-2 border border-primary/40 text-primary font-semibold text-sm px-4 py-2 rounded-xl hover:bg-primary/10 transition-colors"
        >
          Run with parsed extraction
        </button>
      )}
      {parsed && <ExtractionPreview extraction={parsed} />}
    </div>
  );
}
