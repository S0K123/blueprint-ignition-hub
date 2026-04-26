import type { ResearchExtraction } from "@/lib/research-types";

export function ExtractionPreview({ extraction }: { extraction: ResearchExtraction }) {
  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Research Extraction Preview</h3>
        <span className="text-xs px-2.5 py-1 rounded-md bg-emerald/15 text-emerald border border-emerald/30 font-semibold">
          {extraction.confidence}% parsed
        </span>
      </div>
      <div className="grid md:grid-cols-2 gap-3 text-sm">
        <PreviewField label="Problem statement" value={extraction.problem_statement} />
        <PreviewField label="Research goal" value={extraction.research_goal} />
        <PreviewField label="Methodology" value={extraction.methodology} />
        <PreviewField label="Implementation signals" value={extraction.implementation_signals.join(" | ")} />
      </div>
      <div className="grid md:grid-cols-3 gap-3 text-xs text-muted-foreground">
        <TagField label="Models" values={extraction.models_used} />
        <TagField label="Datasets" values={extraction.datasets} />
        <TagField label="Metrics" values={extraction.evaluation_metrics} />
      </div>
    </div>
  );
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background/40 border border-border/60 p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      <div>{value}</div>
    </div>
  );
}

function TagField({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="rounded-xl bg-background/40 border border-border/60 p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((value) => (
          <span key={value} className="px-2 py-0.5 rounded-md bg-secondary border border-border">
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}
