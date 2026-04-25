import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import { ArrowRight, FileText, Sparkles, GitBranch, BookOpen, AlertTriangle, Network } from "lucide-react";

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
          <div className="glass rounded-2xl p-2 flex items-center gap-2 shadow-card focus-within:shadow-glow transition-shadow">
            <FileText className="w-5 h-5 text-muted-foreground ml-3" />
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Paste a paper title or arXiv ID…"
              className="flex-1 bg-transparent outline-none text-sm py-3 placeholder:text-muted-foreground"
            />
            <Link
              to="/mission"
              className="inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-glow"
            >
              Prototype it <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Or pick a demo paper below — no input needed
          </div>
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
