import { useEffect, useState } from "react";

const agents = [
  { id: "parser", label: "Parser", color: "var(--cyan)" },
  { id: "synth", label: "Synthesizer", color: "var(--violet)" },
  { id: "arch", label: "Architect", color: "var(--pink)" },
  { id: "stack", label: "Stack Picker", color: "var(--emerald)" },
  { id: "code", label: "Coder", color: "var(--amber)" },
  { id: "qa", label: "QA Critic", color: "var(--cyan)" },
  { id: "doc", label: "Doc Writer", color: "var(--violet)" },
  { id: "score", label: "Confidence", color: "var(--emerald)" },
];

// Position 8 nodes around a circle
const positions = agents.map((_, i) => {
  const angle = (i / agents.length) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + Math.cos(angle) * 36, y: 50 + Math.sin(angle) * 36 };
});

const edges: [number, number][] = [
  [0, 1], [1, 2], [1, 3], [2, 4], [3, 4], [4, 5], [5, 6], [5, 7], [6, 7], [0, 7], [2, 5], [3, 6],
];

export function AgentGraph({ active: controlled, completed = [] }: { active?: number; completed?: number[] } = {}) {
  const [internal, setInternal] = useState(0);
  useEffect(() => {
    if (controlled !== undefined) return;
    const t = setInterval(() => setInternal((a) => (a + 1) % agents.length), 1200);
    return () => clearInterval(t);
  }, [controlled]);
  const active = controlled !== undefined ? controlled : internal;
  return (
    <div className="relative w-full aspect-square max-w-[560px] mx-auto">
      {/* Glow center */}
      <div className="absolute inset-1/4 rounded-full bg-gradient-hero opacity-20 blur-3xl animate-pulse-soft" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="edgeGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.18 200)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="oklch(0.7 0.22 290)" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {edges.map(([a, b], i) => {
          const p1 = positions[a], p2 = positions[b];
          const isActive = a === active || b === active;
          return (
            <line
              key={i}
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={isActive ? "url(#edgeGrad)" : "oklch(0.4 0.03 270)"}
              strokeWidth={isActive ? 0.5 : 0.2}
              strokeDasharray={isActive ? "1.5 1" : "none"}
              className={isActive ? "animate-dash" : ""}
              style={{ transition: "all 0.3s" }}
            />
          );
        })}
      </svg>
      {agents.map((a, i) => {
        const p = positions[i];
        const isActive = i === active;
        return (
          <div
            key={a.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <div
              className={`relative rounded-2xl border backdrop-blur-md px-3 py-2 text-xs font-semibold transition-all duration-500 ${
                isActive
                  ? "bg-card border-primary/60 scale-110 shadow-glow"
                  : "bg-card/60 border-border text-muted-foreground"
              }`}
            >
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span
                  className={`w-2 h-2 rounded-full ${isActive ? "animate-pulse-soft" : ""}`}
                  style={{ background: a.color }}
                />
                {a.label}
              </div>
            </div>
          </div>
        );
      })}
      {/* Center label */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Orchestrator</div>
        <div className="text-2xl font-bold text-gradient">ProtoPapers</div>
      </div>
    </div>
  );
}

export { agents };
