import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { AgentGraph, agents } from "@/components/AgentGraph";
import { ArrowRight, Brain, CheckCircle2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/mission")({
  component: Mission,
});

const thoughts = [
  { agent: "Parser", text: "Extracted abstract, 12 sections, 47 references. Detected core concept: scaled dot-product attention." },
  { agent: "Synthesizer", text: "Distilled 3 implementable primitives: token embeddings, multi-head attention, position encoding." },
  { agent: "Architect", text: "Proposed system: encoder-decoder w/ residual streams. Drafting service boundaries…" },
  { agent: "Stack Picker", text: "Recommending PyTorch + HuggingFace + FastAPI. Inference layer: vLLM. Storage: Postgres + pgvector." },
  { agent: "Coder", text: "Scaffolding repo: src/model, src/training, src/serving. 14 files queued for generation." },
  { agent: "QA Critic", text: "Flagged: O(n²) attention will OOM on >2k tokens. Suggesting FlashAttention-2 fallback." },
  { agent: "Doc Writer", text: "Composing beginner walkthrough — 9 steps, ~3h to first inference." },
  { agent: "Confidence", text: "Cross-checking blueprint coherence… score: 0.87. Flagging 2 medium-risk steps." },
];

function Mission() {
  const [log, setLog] = useState<{ agent: string; text: string; t: number }[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < thoughts.length) {
        setLog((l) => [{ ...thoughts[i], t: Date.now() }, ...l]);
        setProgress(Math.round(((i + 1) / thoughts.length) * 100));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const done = progress === 100;

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald animate-pulse-soft" /> Mission Control
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Prototyping <span className="text-gradient">"Attention Is All You Need"</span>
            </h1>
            <p className="text-muted-foreground mt-2">Eight agents are collaborating in real time.</p>
          </div>
          {done && (
            <Link
              to="/results"
              className="inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground font-semibold px-5 py-3 rounded-xl shadow-glow hover:opacity-90 animate-fade-in"
            >
              View Results <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Progress bar */}
        <div className="glass rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium flex items-center gap-2">
              {done ? <CheckCircle2 className="w-4 h-4 text-emerald" /> : <Loader2 className="w-4 h-4 animate-spin text-primary" />}
              {done ? "Build complete" : "Agents running…"}
            </span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-hero transition-all duration-700 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: agent graph */}
          <div className="glass rounded-2xl p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Agent Network</h2>
              <span className="text-xs text-muted-foreground">{agents.length} agents · live</span>
            </div>
            <AgentGraph />
          </div>

          {/* Right: log */}
          <div className="glass rounded-2xl p-6 lg:p-8 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" /> Agent Thoughts
              </h2>
              <span className="text-xs text-muted-foreground">{log.length} events</span>
            </div>
            <div className="flex-1 space-y-3 max-h-[560px] overflow-y-auto pr-2">
              {log.length === 0 && (
                <div className="text-sm text-muted-foreground animate-pulse-soft">Awaiting first agent thought…</div>
              )}
              {log.map((l, i) => (
                <div
                  key={l.t + i}
                  className="rounded-xl border border-border/60 bg-card/40 p-4 animate-slide-up"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-primary">{l.agent}</span>
                    <span className="text-[10px] text-muted-foreground">just now</span>
                  </div>
                  <div className="text-sm leading-relaxed">{l.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
