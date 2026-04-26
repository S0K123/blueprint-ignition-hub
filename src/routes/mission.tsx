import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { AgentGraph, agents } from "@/components/AgentGraph";
import { ArrowRight, Brain, CheckCircle2, Loader2, FileText, Timer, Zap } from "lucide-react";
import { getSelectedPaper } from "@/lib/paper-context";
import { generateTopicBundle } from "@/lib/protopapers-engine";
import { setCurrentRun } from "@/lib/run-context";
import { getResearchState } from "@/lib/research-context";

export const Route = createFileRoute("/mission")({
  component: Mission,
});

function Mission() {
  const paper = getSelectedPaper();
  const research = getResearchState();
  const bundle = generateTopicBundle(paper, research.extraction);
  const thoughts = agents.map((agent, index) => ({
    agent: agent.label,
    text: bundle.thoughtStream[index] ?? `${agent.label}: Processing ${paper.title}...`,
  }));
  const [step, setStep] = useState(-1); // index of current agent
  const [log, setLog] = useState<{ agent: string; text: string; t: number }[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    setCurrentRun({ paper, bundle });
    let i = 0;
    const tick = setInterval(() => {
      if (i < thoughts.length) {
        setStep(i);
        setLog((l) => [{ ...thoughts[i], t: Date.now() }, ...l]);
        i++;
      } else {
        clearInterval(tick);
      }
    }, 1500);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (step >= thoughts.length - 1) return;
    const t = setInterval(() => {
      setElapsed((e) => e + 0.1);
      setTokens((tk) => tk + Math.floor(Math.random() * 40) + 20);
    }, 100);
    return () => clearInterval(t);
  }, [step]);

  const progress = step < 0 ? 0 : Math.round(((step + 1) / thoughts.length) * 100);
  const done = progress === 100;
  const completed = Array.from({ length: Math.max(0, step) }, (_, i) => i);

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Paper context header */}
        <div className="glass rounded-2xl p-5 mb-6 flex items-center gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-xl bg-gradient-hero/20 ring-1 ring-primary/40 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Now prototyping</div>
            <div className="font-semibold truncate">
              {paper.title}
              {paper.authors ? ` · ${paper.authors}` : ""}
              {paper.year ? ` · ${paper.year}` : ""}
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Stat icon={Timer} label="Elapsed" value={`${elapsed.toFixed(1)}s`} />
            <Stat icon={Zap} label="Tokens" value={tokens.toLocaleString()} />
            <span className="px-2 py-1 rounded-md border border-border text-muted-foreground">
              {research.mode === "research_parse" ? "Research Parse Mode" : "Quick Demo Mode"}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald animate-pulse-soft" /> Mission Control
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Eight agents, <span className="text-gradient">one blueprint</span>
            </h1>
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

        {/* Progress */}
        <div className="glass rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium flex items-center gap-2">
              {done ? <CheckCircle2 className="w-4 h-4 text-emerald" /> : <Loader2 className="w-4 h-4 animate-spin text-primary" />}
              {done ? "Build complete" : step >= 0 ? `${agents[step].label} working…` : "Initializing…"}
            </span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-hero transition-all duration-700 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: graph + agent status */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 lg:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Agent Network</h2>
                <span className="text-xs text-muted-foreground">{agents.length} agents · live</span>
              </div>
              <AgentGraph active={step >= 0 ? step : undefined} completed={completed} />
            </div>

            <div className="glass rounded-2xl p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Agent Roster</div>
              <div className="grid grid-cols-2 gap-2">
                {agents.map((a, i) => {
                  const status = i < step ? "done" : i === step ? "running" : "queued";
                  return (
                    <div
                      key={a.id}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs border transition-colors ${
                        status === "running" ? "border-primary/50 bg-primary/5"
                        : status === "done" ? "border-emerald/30 bg-emerald/5"
                        : "border-border bg-card/30 text-muted-foreground"
                      }`}
                    >
                      <span className="font-medium">{a.label}</span>
                      <span className={`text-[10px] uppercase tracking-wider ${
                        status === "running" ? "text-primary"
                        : status === "done" ? "text-emerald"
                        : "text-muted-foreground"
                      }`}>
                        {status === "running" && "● running"}
                        {status === "done" && "✓ done"}
                        {status === "queued" && "queued"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: thought log */}
          <div className="glass rounded-2xl p-6 lg:p-8 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" /> Agent Thoughts
              </h2>
              <span className="text-xs text-muted-foreground">{log.length} events</span>
            </div>
            <div className="flex-1 space-y-3 max-h-[640px] overflow-y-auto pr-2">
              {log.length === 0 && (
                <div className="text-sm text-muted-foreground animate-pulse-soft">Awaiting first agent thought…</div>
              )}
              {log.map((l, i) => {
                const isLatest = i === 0 && !done;
                return (
                  <div
                    key={l.t + i}
                    className={`rounded-xl border p-4 animate-slide-up transition-colors ${
                      isLatest ? "border-primary/50 bg-primary/5 shadow-glow" : "border-border/60 bg-card/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                        {isLatest && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />}
                        {l.agent}
                      </span>
                      <span className="text-[10px] text-muted-foreground">just now</span>
                    </div>
                    <div className="text-sm leading-relaxed">{l.text}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-primary" />
      <div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none">{label}</div>
        <div className="font-semibold font-mono">{value}</div>
      </div>
    </div>
  );
}
