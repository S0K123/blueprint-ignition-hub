import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import { ArrowRight, FileText, Sparkles, GitBranch, BookOpen, AlertTriangle, Network } from "lucide-react";
import { setSelectedPaper } from "@/lib/paper-context";
import { setResearchExtraction, setResearchMode } from "@/lib/research-context";
import type { ResearchMode, ResearchExtraction } from "@/lib/research-types";
import { ResearchParsePanel } from "@/components/ResearchParsePanel";

export const Route = createFileRoute("/")({
  component: Landing,
});

const demoPapers = [
  {
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    year: 2017,
    tag: "Transformers",
    color: "from-cyan/20 to-violet/20",
  },
  {
    title: "Denoising Diffusion Probabilistic Models",
    authors: "Ho et al.",
    year: 2020,
    tag: "Diffusion",
    color: "from-violet/20 to-pink/20",
  },
  {
    title: "Retrieval-Augmented Generation for NLP",
    authors: "Lewis et al.",
    year: 2020,
    tag: "RAG",
    color: "from-pink/20 to-amber/20",
  },
  {
    title: "Constitutional AI: Harmlessness from AI Feedback",
    authors: "Bai et al.",
    year: 2022,
    tag: "Alignment",
    color: "from-emerald/20 to-cyan/20",
  },
];

const features = [
  { icon: Network, label: "Live Agent Graph", desc: "Watch 8 agents reason in real time" },
  { icon: GitBranch, label: "3 Blueprint Versions", desc: "Beginner · Builder · Hackathon" },
  { icon: BookOpen, label: "Plain-English Steps", desc: "Tools, time, and expected output" },
  { icon: AlertTriangle, label: "Common Mistakes Flagged", desc: "Avoid the gotchas before you ship" },
];

function Landing() {
  const [custom, setCustom] = useState("");
  const [mode, setMode] = useState<ResearchMode>("quick_demo");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const navigate = useNavigate();

  const launchWithCustomPaper = () => {
    const title = custom.trim();
    if (!title) return;
    setResearchMode("quick_demo");
    
    // Create a mock extraction for custom papers so they save to history
    const mockExtraction: ResearchExtraction = {
      problem_statement: `Implement a solution for ${title}`,
      research_goal: `Build a working prototype based on the ${title} concept`,
      methodology: `Follow best practices for implementing ${title}`,
      workflow_pipeline: [
        "Research the concept and requirements",
        "Design the architecture",
        "Implement core functionality",
        "Test and validate the solution"
      ],
      models_used: ["Custom implementation"],
      datasets: ["Domain-specific datasets"],
      evaluation_metrics: ["Performance", "Accuracy", "Usability"],
      limitations: ["Custom implementation constraints"],
      implementation_signals: [`Focus on ${title} implementation`, "Follow user requirements"],
      sections: {
        title: title,
        abstract: `Custom implementation based on ${title} concept`,
        introduction: `This is a custom implementation for the ${title} concept provided by the user.`,
        methodology: `Implementation follows best practices for ${title}.`,
        experiments: `Custom experimental setup for ${title} validation.`,
        results: `Results should demonstrate the effectiveness of the ${title} implementation.`,
        conclusion: `Successfully implemented ${title} concept.`
      },
      confidence: 85
    };
    
    setResearchExtraction(mockExtraction, `custom-${title.toLowerCase().replace(/\s+/g, '-')}.pdf`, 1);
    setSelectedPaper({
      title,
      authors: "Custom input",
      tag: "Custom",
    });
    navigate({ to: "/mission" });
  };

  const launchWithDemoPaper = (paper: (typeof demoPapers)[number]) => {
    setResearchMode("quick_demo");
    
    // Create a mock extraction for demo papers so they save to history
    const mockExtraction: ResearchExtraction = {
      problem_statement: `Implement the ${paper.title} architecture and methodology`,
      research_goal: `Recreate the key contributions from ${paper.authors} (${paper.year})`,
      methodology: `Follow the ${paper.tag} approach outlined in the original paper`,
      workflow_pipeline: [
        "Study the original paper architecture",
        "Implement core components",
        "Set up training/inference pipeline",
        "Validate with benchmark datasets"
      ],
      models_used: [paper.tag],
      datasets: ["Standard benchmarks for " + paper.tag],
      evaluation_metrics: ["Accuracy", "Performance", "Reproducibility"],
      limitations: ["Computational requirements", "Data dependencies"],
      implementation_signals: [`Focus on ${paper.tag} implementation`, `Follow ${paper.authors} methodology`],
      sections: {
        title: paper.title,
        abstract: `Demo implementation of ${paper.title} by ${paper.authors}`,
        introduction: `This is a demo implementation based on the groundbreaking ${paper.title} paper.`,
        methodology: `Implementation follows the ${paper.tag} methodology described in the original research.`,
        experiments: `Standard experimental setup for ${paper.tag} evaluation.`,
        results: `Results should match the performance reported in the original paper.`,
        conclusion: `Successfully implemented ${paper.title} architecture.`
      },
      confidence: 95
    };
    
    setResearchExtraction(mockExtraction, `demo-${paper.title.toLowerCase().replace(/\s+/g, '-')}.pdf`, 1);
    setSelectedPaper({
      title: paper.title,
      authors: paper.authors,
      year: paper.year,
      tag: paper.tag,
    });
  };

  const setModeAndResetIfNeeded = (nextMode: ResearchMode) => {
    setMode(nextMode);
    setResearchMode(nextMode);
    if (nextMode === "quick_demo") {
      setResearchExtraction(null);
      setUploadedFileName("");
    }
  };

  const onParsed = (_extraction: ResearchExtraction, fileName: string) => {
    setUploadedFileName(fileName);
  };

  const launchFromParsedResearch = () => {
    setResearchMode("research_parse");
    navigate({ to: "/mission" });
  };

  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Multi-agent prototyping engine
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] animate-slide-up">
          Research Papers
          <br />
          <span className="text-gradient">→ Buildable Products</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
          Drop a paper. Eight specialized agents collaborate to design the architecture,
          pick the stack, and write a step-by-step build blueprint — in under 60 seconds.
        </p>

        {/* Custom paper input */}
        <div className="mt-10 max-w-2xl mx-auto">
          <div className="glass rounded-2xl p-1.5 inline-flex gap-1 mb-3">
            <button
              type="button"
              onClick={() => setModeAndResetIfNeeded("quick_demo")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                mode === "quick_demo"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Quick Demo Mode
            </button>
            <button
              type="button"
              onClick={() => setModeAndResetIfNeeded("research_parse")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                mode === "research_parse"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Research Parse Mode
            </button>
          </div>
          <div className="glass rounded-2xl p-2 flex items-center gap-2 shadow-card focus-within:shadow-glow transition-shadow">
            <FileText className="w-5 h-5 text-muted-foreground ml-3" />
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Paste a paper title or arXiv ID…"
              className="flex-1 bg-transparent outline-none text-sm py-3 placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={launchWithCustomPaper}
              disabled={!custom.trim()}
              className="inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-glow"
            >
              Prototype it <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Or pick a demo paper below — no input needed
          </div>
          {mode === "research_parse" && (
            <div className="text-left">
              <ResearchParsePanel onParsed={onParsed} onRunMission={launchFromParsedResearch} />
              {uploadedFileName && (
                <div className="mt-2 text-xs text-emerald">
                  Parsed file ready: {uploadedFileName}. Continue with "Prototype it" or demo cards.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Metrics strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {[
            { v: "60s", l: "Paper → Blueprint" },
            { v: "8", l: "Specialized agents" },
            { v: "3", l: "Blueprint modes" },
            { v: "87%", l: "Avg. confidence" },
          ].map((m) => (
            <div key={m.l} className="glass rounded-xl p-4">
              <div className="text-2xl font-bold text-gradient">{m.v}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{m.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo paper cards */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Demo papers</h2>
          <span className="text-sm text-muted-foreground">Click any card to launch agents</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {demoPapers.map((p, i) => (
            <Link
              to="/mission"
              key={p.title}
              onClick={() => launchWithDemoPaper(p)}
              className="group relative overflow-hidden glass rounded-2xl p-5 text-left hover:-translate-y-1 transition-all duration-300 hover:shadow-glow-violet animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-primary">{p.tag}</span>
                  <span className="text-xs text-muted-foreground">{p.year}</span>
                </div>
                <h3 className="font-semibold leading-snug min-h-[3rem]">{p.title}</h3>
                <div className="mt-4 text-xs text-muted-foreground">{p.authors}</div>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Run agents <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature strip */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={f.label}
              className="glass rounded-2xl p-6 hover:border-primary/40 transition-colors animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-hero/20 flex items-center justify-center mb-4 ring-1 ring-primary/30">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="font-semibold">{f.label}</div>
              <div className="text-sm text-muted-foreground mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-border/40 text-xs text-muted-foreground flex justify-between">
        <span>© ProtoPapers · Hackathon MVP</span>
        <span>Built with multi-agent orchestration</span>
      </footer>
    </div>
  );
}
