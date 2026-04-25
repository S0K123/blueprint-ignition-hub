import { CheckCircle2, FlaskConical } from "lucide-react";

const items = [
  { label: "Paper parsing", real: true },
  { label: "Agent orchestration", real: true },
  { label: "Blueprint generation", real: false },
  { label: "Live progress logs", real: false },
  { label: "Code scaffolding", real: true },
  { label: "Confidence scoring", real: false },
];

export function RealVsSimulated() {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
        <FlaskConical className="w-3.5 h-3.5" /> Transparency · Real vs Simulated
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((it) => (
          <span
            key={it.label}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              it.real
                ? "bg-emerald/10 text-emerald border-emerald/30"
                : "bg-amber/10 text-amber border-amber/30"
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            {it.label} · {it.real ? "Real" : "Simulated"}
          </span>
        ))}
      </div>
    </div>
  );
}
