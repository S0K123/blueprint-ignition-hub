import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Mermaid } from "@/components/Mermaid";
import { RealVsSimulated } from "@/components/RealVsSimulated";
import {
  AlertTriangle, CheckCircle2, Clock, Wrench, Target, Sparkles, Code2, Network, Layers, Gauge, FileCode,
} from "lucide-react";

export const Route = createFileRoute("/results")({
  component: Results,
});

type Mode = "Beginner" | "Builder" | "Hackathon";

const modes: Mode[] = ["Beginner", "Builder", "Hackathon"];

const blueprintsByMode: Record<Mode, Array<{
  action: string; purpose: string; tools: string[]; expected: string; difficulty: "Easy" | "Medium" | "Hard"; time: string; mistake: string;
}>> = {
  Beginner: [
    { action: "Set up a Python virtual environment", purpose: "Isolate dependencies and avoid version conflicts.", tools: ["python 3.11", "venv"], expected: "Activated venv with pip ready.", difficulty: "Easy", time: "5 min", mistake: "Installing globally — breaks other projects." },
    { action: "Install PyTorch and HuggingFace Transformers", purpose: "Core libraries for the attention model.", tools: ["torch", "transformers"], expected: "Successful import in REPL.", difficulty: "Easy", time: "10 min", mistake: "Mismatching CUDA version with torch build." },
    { action: "Run a pretrained model end-to-end", purpose: "Verify your environment before building.", tools: ["AutoModel", "AutoTokenizer"], expected: "Model emits logits for an input string.", difficulty: "Easy", time: "10 min", mistake: "Forgetting model.eval() — gives noisy outputs." },
    { action: "Implement scaled dot-product attention", purpose: "Understand the paper's core primitive.", tools: ["torch.nn", "einsum"], expected: "Function returns attention-weighted values.", difficulty: "Medium", time: "45 min", mistake: "Skipping the √d_k scale — softmax saturates." },
  ],
  Builder: [
    { action: "Scaffold a FastAPI inference service", purpose: "Production-ready surface for your model.", tools: ["FastAPI", "uvicorn", "pydantic"], expected: "POST /infer returns JSON predictions.", difficulty: "Medium", time: "30 min", mistake: "Loading the model per-request instead of once." },
    { action: "Add request batching with a queue", purpose: "Boost throughput on GPU.", tools: ["asyncio", "torch.cuda"], expected: "p95 latency drops by 3x at concurrency 16.", difficulty: "Medium", time: "1 hr", mistake: "Unbounded queue → OOM under load." },
    { action: "Wire pgvector for retrieval", purpose: "Power RAG-style augmentation.", tools: ["postgres", "pgvector", "sqlalchemy"], expected: "Cosine search returns top-k in <50ms.", difficulty: "Medium", time: "1 hr", mistake: "Forgetting an HNSW index on the embedding column." },
    { action: "Add OpenTelemetry tracing", purpose: "See where time is spent across agents.", tools: ["otel-sdk", "Tempo"], expected: "Spans visible per request in trace UI.", difficulty: "Hard", time: "1.5 hr", mistake: "Sampling too aggressively — losing the slow tail." },
  ],
  Hackathon: [
    { action: "Spin a Modal endpoint with the model", purpose: "Skip infra — get a public URL fast.", tools: ["Modal", "stub.function"], expected: "Public HTTPS URL serving inference.", difficulty: "Easy", time: "15 min", mistake: "Not pinning the GPU type — cold starts vary wildly." },
    { action: "Stand up a Next.js demo with Vercel", purpose: "Pretty UI for the judges.", tools: ["Next.js", "shadcn/ui", "Vercel"], expected: "Live demo at <project>.vercel.app.", difficulty: "Easy", time: "20 min", mistake: "Hardcoding API keys client-side." },
    { action: "Add a streaming response", purpose: "Looks magical on stage.", tools: ["SSE", "ReadableStream"], expected: "Tokens appear progressively in UI.", difficulty: "Medium", time: "30 min", mistake: "Buffering at the proxy layer kills streaming." },
    { action: "Record a 90-second screen capture", purpose: "Backup for live demo failure.", tools: ["Loom", "QuickTime"], expected: "Polished mp4 ready to play.", difficulty: "Easy", time: "15 min", mistake: "Filming in 1080p but presenting at 4K — pixelated." },
  ],
};

const techStack = [
  { layer: "Model", items: ["PyTorch 2.4", "Transformers 4.45", "FlashAttention-2"] },
  { layer: "Serving", items: ["FastAPI", "vLLM", "Uvicorn"] },
  { layer: "Data", items: ["Postgres 16", "pgvector", "Redis"] },
  { layer: "Frontend", items: ["Next.js 15", "TanStack Query", "shadcn/ui"] },
  { layer: "Infra", items: ["Modal", "Vercel", "Cloudflare R2"] },
  { layer: "Observability", items: ["OpenTelemetry", "Grafana", "Sentry"] },
];

const codeScaffold = `protopaper-mvp/
├── README.md
├── pyproject.toml
├── src/
│   ├── model/
│   │   ├── attention.py        # scaled dot-product + multi-head
│   │   ├── encoder.py
│   │   └── decoder.py
│   ├── serving/
│   │   ├── api.py              # FastAPI app
│   │   ├── batcher.py          # async micro-batching
│   │   └── schemas.py
│   ├── retrieval/
│   │   ├── embed.py
│   │   └── store_pgvector.py
│   └── training/
│       └── train.py
├── web/                        # Next.js demo
│   ├── app/page.tsx
│   └── components/Stream.tsx
└── infra/
    ├── modal_app.py
    └── docker/Dockerfile`;

const mermaidChart = `graph TD
  U[User Request] --> GW[API Gateway / FastAPI]
  GW --> BATCH[Async Batcher]
  BATCH --> MODEL[Transformer Model]
  MODEL --> CACHE[(Redis KV Cache)]
  GW --> RAG[Retrieval Service]
  RAG --> PG[(Postgres + pgvector)]
  MODEL --> STREAM[SSE Streamer]
  STREAM --> U
  GW --> OBS[OTel Collector]
  OBS --> GRAF[Grafana Dashboards]`;

const tabs = [
  { id: "blueprint", label: "Blueprint", icon: Layers },
  { id: "architecture", label: "Architecture", icon: Network },
  { id: "stack", label: "Tech Stack", icon: Wrench },
  { id: "code", label: "Code Scaffold", icon: FileCode },
  { id: "confidence", label: "Confidence", icon: Gauge },
] as const;

type TabId = (typeof tabs)[number]["id"];

function Results() {
  const [tab, setTab] = useState<TabId>("blueprint");
  const [mode, setMode] = useState<Mode>("Builder");

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Results · Run #4471
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Blueprint for <span className="text-gradient">"Attention Is All You Need"</span>
          </h1>
        </div>

        <div className="mb-6">
          <RealVsSimulated />
        </div>

        {/* Tabs */}
        <div className="glass rounded-2xl p-1.5 inline-flex gap-1 mb-6 flex-wrap">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-hero text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === "blueprint" && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs text-muted-foreground mr-2">Mode:</span>
              {modes.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    mode === m
                      ? "bg-primary text-primary-foreground border-primary shadow-glow"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {blueprintsByMode[mode].map((s, i) => (
                <div
                  key={i}
                  className="glass rounded-2xl p-6 hover:border-primary/40 transition-colors animate-slide-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-hero/20 ring-1 ring-primary/40 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <h3 className="font-semibold text-lg">{s.action}</h3>
                        <div className="flex items-center gap-2 text-xs">
                          <DiffBadge d={s.difficulty} />
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" /> {s.time}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                        <Field icon={Target} label="Purpose" value={s.purpose} />
                        <Field icon={CheckCircle2} label="Expected result" value={s.expected} />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted-foreground mr-1">Tools:</span>
                        {s.tools.map((t) => (
                          <span key={t} className="text-xs px-2 py-1 rounded-md bg-secondary border border-border font-mono">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex items-start gap-2 rounded-xl p-3 bg-amber/10 border border-amber/30">
                        <AlertTriangle className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <span className="font-semibold text-amber">Common mistake: </span>
                          <span>{s.mistake}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "architecture" && (
          <div className="glass rounded-2xl p-6 animate-fade-in">
            <h2 className="font-semibold mb-4">System Architecture</h2>
            <div className="rounded-xl bg-background/60 p-4 overflow-auto">
              <Mermaid chart={mermaidChart} />
            </div>
          </div>
        )}

        {tab === "stack" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {techStack.map((s, i) => (
              <div
                key={s.layer}
                className="glass rounded-2xl p-6 animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="text-xs uppercase tracking-widest text-primary mb-3">{s.layer}</div>
                <ul className="space-y-2">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-hero" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {tab === "code" && (
          <div className="glass rounded-2xl p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" /> Generated Repo Structure
              </h2>
              <span className="text-xs text-muted-foreground">14 files · ~620 LOC</span>
            </div>
            <pre className="text-xs md:text-sm font-mono bg-background/70 border border-border rounded-xl p-5 overflow-auto leading-relaxed text-muted-foreground">
{codeScaffold}
            </pre>
          </div>
        )}

        {tab === "confidence" && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass rounded-2xl p-8 text-center">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Overall Confidence</div>
              <div className="text-7xl font-bold text-gradient">87%</div>
              <div className="text-sm text-muted-foreground mt-2">High — blueprint cross-validated by 3 critic agents.</div>
              <div className="mt-6 max-w-md mx-auto h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-gradient-hero rounded-full" style={{ width: "87%" }} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Architecture coherence", v: 94, color: "emerald" },
                { label: "Stack feasibility", v: 89, color: "cyan" },
                { label: "Step completeness", v: 78, color: "amber" },
              ].map((m) => (
                <div key={m.label} className="glass rounded-2xl p-5">
                  <div className="text-xs text-muted-foreground">{m.label}</div>
                  <div className="text-3xl font-bold mt-1">{m.v}%</div>
                  <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-hero rounded-full" style={{ width: `${m.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DiffBadge({ d }: { d: "Easy" | "Medium" | "Hard" }) {
  const map = {
    Easy: "bg-emerald/15 text-emerald border-emerald/30",
    Medium: "bg-amber/15 text-amber border-amber/30",
    Hard: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return <span className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${map[d]}`}>{d}</span>;
}

function Field({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background/40 border border-border/60 p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <div>{value}</div>
    </div>
  );
}
