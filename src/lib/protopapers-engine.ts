import type { SelectedPaper } from "@/lib/paper-context";
import type { ResearchExtraction } from "@/lib/research-types";

export type Mode = "Beginner" | "Builder" | "Hackathon";

export type BlueprintStep = {
  step: number;
  action: string;
  purpose: string;
  tools_needed: string[];
  expected_result: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;
  common_mistake: string;
};

export type DisplayStep = {
  action: string;
  purpose: string;
  tools: string[];
  expected: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;
  mistake: string;
};

export type TopicBundle = {
  modeSteps: Record<Mode, DisplayStep[]>;
  mermaidChart: string;
  techStack: Array<{ layer: string; items: string[] }>;
  codeScaffold: string;
  codeFiles: Record<string, string>;
  thoughtStream: string[];
  confidence: number;
  runId: string;
};

type TopicProfile = {
  key: "transformer" | "diffusion" | "rag" | "alignment" | "general";
  modelCore: string;
  infraCore: string;
  dataCore: string;
  frontendCore: string;
  architecture: string;
  codeScaffold: string;
  codeFiles: Record<string, string>;
};

const topicProfiles: TopicProfile[] = [
  {
    key: "rag",
    modelCore: "Embedding + LLM generation",
    infraCore: "FastAPI + async queue",
    dataCore: "Postgres + pgvector",
    frontendCore: "Next.js + streaming UI",
    architecture: `graph TD
  U[User Query] --> API[FastAPI Gateway]
  API --> RET[Retriever]
  RET --> VDB[(Vector Store)]
  API --> LLM[Generator Model]
  RET --> LLM
  LLM --> OUT[Answer + Sources]
  OUT --> U`,
    codeScaffold: `protopaper-rag/
├── src/
│   ├── serving/api.py
│   ├── retrieval/embed.py
│   ├── retrieval/store_pgvector.py
│   └── orchestration/pipeline.py
└── web/app/page.tsx`,
    codeFiles: {
      "src/serving/api.py": `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="ProtoPapers RAG API")

class AskRequest(BaseModel):
    question: str

@app.post("/ask")
async def ask(req: AskRequest):
    return {"answer": "Mock grounded answer", "sources": ["paper_chunk_01"]}`,
      "src/retrieval/store_pgvector.py": `async def search_similar(query: str, k: int = 5):
    # Demo stub for hackathon MVP
    return [{"id": "chunk-1", "text": "retrieved context"}]`,
    },
  },
  {
    key: "diffusion",
    modelCore: "Latent diffusion inference",
    infraCore: "FastAPI + GPU worker",
    dataCore: "Object storage + metadata DB",
    frontendCore: "React gallery + prompt form",
    architecture: `graph TD
  U[Prompt + Settings] --> API[Inference API]
  API --> QUEUE[Job Queue]
  QUEUE --> GPU[Diffusion Worker]
  GPU --> STORE[(Image Store)]
  STORE --> UI[Gallery UI]
  UI --> U`,
    codeScaffold: `protopaper-diffusion/
├── src/serving/api.py
├── src/inference/diffuse.py
├── src/workers/queue_worker.py
└── web/components/ImageGrid.tsx`,
    codeFiles: {
      "src/inference/diffuse.py": `def generate_image(prompt: str, steps: int = 30):
    # Demo placeholder
    return {"image_url": "/mock/generated.png", "seed": 42}`,
      "src/serving/api.py": `from fastapi import FastAPI

app = FastAPI(title="ProtoPapers Diffusion API")

@app.post("/generate")
async def generate(payload: dict):
    return {"status": "queued", "job_id": "job_001"}`,
    },
  },
  {
    key: "transformer",
    modelCore: "Transformer encoder/decoder",
    infraCore: "FastAPI + batching",
    dataCore: "Postgres + Redis cache",
    frontendCore: "Dashboard with inference tester",
    architecture: `graph TD
  U[Input Text] --> API[FastAPI]
  API --> BATCH[Batch Aggregator]
  BATCH --> MODEL[Transformer Model]
  MODEL --> CACHE[(Redis Cache)]
  MODEL --> RESP[Response]
  RESP --> U`,
    codeScaffold: `protopaper-transformer/
├── src/model/attention.py
├── src/serving/api.py
├── src/serving/batcher.py
└── infra/docker/Dockerfile`,
    codeFiles: {
      "src/model/attention.py": `import torch

def scaled_dot_product_attention(q, k, v):
    scores = (q @ k.transpose(-2, -1)) / (q.size(-1) ** 0.5)
    weights = scores.softmax(dim=-1)
    return weights @ v`,
      "src/serving/api.py": `from fastapi import FastAPI

app = FastAPI(title="ProtoPapers Transformer API")

@app.post("/infer")
async def infer(payload: dict):
    return {"logits_shape": [1, 128, 50257]}`,
    },
  },
  {
    key: "alignment",
    modelCore: "Policy + safety evaluator",
    infraCore: "Moderation gateway",
    dataCore: "Policy traces store",
    frontendCore: "Policy audit dashboard",
    architecture: `graph TD
  U[User Prompt] --> GW[Policy Gateway]
  GW --> POL[Policy Model]
  POL --> SAFE[Safety Critic]
  SAFE --> OUT[Constrained Response]
  SAFE --> LOG[(Policy Trace Store)]
  OUT --> U`,
    codeScaffold: `protopaper-alignment/
├── src/policy/evaluator.py
├── src/serving/gateway.py
├── src/serving/safety.py
└── web/components/PolicyPanel.tsx`,
    codeFiles: {
      "src/serving/gateway.py": `def enforce_policy(prompt: str):
    # MVP rule-based guardrail
    blocked = ["self-harm", "malware"]
    return any(b in prompt.lower() for b in blocked)`,
      "src/serving/safety.py": `def score_safety(response: str) -> float:
    # Demo heuristic
    return 0.91`,
    },
  },
];

function profileForPaper(paper: SelectedPaper): TopicProfile {
  const text = `${paper.title} ${paper.tag ?? ""}`.toLowerCase();
  if (text.includes("rag") || text.includes("retrieval")) return topicProfiles.find((p) => p.key === "rag")!;
  if (text.includes("diffusion")) return topicProfiles.find((p) => p.key === "diffusion")!;
  if (text.includes("attention") || text.includes("transformer")) return topicProfiles.find((p) => p.key === "transformer")!;
  if (text.includes("constitutional") || text.includes("alignment") || text.includes("safety")) {
    return topicProfiles.find((p) => p.key === "alignment")!;
  }
  return {
    key: "general",
    modelCore: "Task-specific model service",
    infraCore: "FastAPI orchestration API",
    dataCore: "Relational store + cache",
    frontendCore: "React dashboard",
    architecture: `graph TD
  U[User Input] --> API[Orchestration API]
  API --> AG[Agent Pipeline]
  AG --> DATA[(Project Data Store)]
  AG --> OUT[Blueprint Output]
  OUT --> U`,
    codeScaffold: `protopaper-mvp/
├── src/serving/api.py
├── src/orchestration/agents.py
├── src/blueprint/generator.py
└── web/app/page.tsx`,
    codeFiles: {
      "src/orchestration/agents.py": `def run_agents(paper_title: str):
    return {"status": "complete", "paper": paper_title}`,
      "src/serving/api.py": `from fastapi import FastAPI

app = FastAPI(title="ProtoPapers MVP API")

@app.post("/generate")
async def generate(payload: dict):
    return {"status": "ok", "blueprint_id": "bp_demo_001"}`,
    },
  };
}

function toDisplayStep(step: BlueprintStep): DisplayStep {
  return {
    action: step.action,
    purpose: step.purpose,
    tools: step.tools_needed,
    expected: step.expected_result,
    difficulty: step.difficulty,
    time: step.time,
    mistake: step.common_mistake,
  };
}

function baseSteps(profile: TopicProfile): Record<Mode, BlueprintStep[]> {
  return {
    Beginner: [
      {
        step: 1,
        action: `Define one clear user outcome for ${profile.key.toUpperCase()} demo`,
        purpose: "Keeps scope tight and demo-ready in one pass.",
        tools_needed: ["Notion", "Google Docs"],
        expected_result: "One-sentence MVP promise and success criteria.",
        difficulty: "Easy",
        time: "20 min",
        common_mistake: "Trying to support too many user types at once.",
      },
      {
        step: 2,
        action: "Set up a minimal project skeleton",
        purpose: "Lets you demo flow even before full logic is added.",
        tools_needed: ["Vite", "React", "TypeScript"],
        expected_result: "Working app with landing, mission, and results screens.",
        difficulty: "Easy",
        time: "30 min",
        common_mistake: "Styling before wiring navigation and state.",
      },
      {
        step: 3,
        action: "Add paper input and selection flow",
        purpose: "Connects user intent to downstream generation.",
        tools_needed: ["React state", "TanStack Router"],
        expected_result: "Selected paper context appears across screens.",
        difficulty: "Easy",
        time: "25 min",
        common_mistake: "Keeping paper title hardcoded on mission/results pages.",
      },
      {
        step: 4,
        action: `Generate topic outputs for ${profile.modelCore}`,
        purpose: "Creates believable, paper-specific demo output.",
        tools_needed: ["Mock generator", "TS utility functions"],
        expected_result: "Blueprint, architecture, stack, scaffold vary by topic.",
        difficulty: "Medium",
        time: "45 min",
        common_mistake: "Only changing titles while leaving all content identical.",
      },
      {
        step: 5,
        action: "Export blueprint as markdown artifact",
        purpose: "Gives judges a tangible output they can take away.",
        tools_needed: ["Clipboard API", "Blob download"],
        expected_result: "One-click markdown export of selected mode.",
        difficulty: "Easy",
        time: "20 min",
        common_mistake: "Exporting without paper and mode metadata.",
      },
    ],
    Builder: [
      {
        step: 1,
        action: "Create structured blueprint JSON schema and mapper",
        purpose: "Prevents inconsistent output formats across tabs.",
        tools_needed: ["TypeScript types", "Mapper helpers"],
        expected_result: "Single generator output consumed by mission and results.",
        difficulty: "Medium",
        time: "45 min",
        common_mistake: "Duplicating schema logic in each route.",
      },
      {
        step: 2,
        action: `Implement topic profile resolver (${profile.key})`,
        purpose: "Routes papers to relevant architecture and stack templates.",
        tools_needed: ["Keyword matching", "Profile map"],
        expected_result: "Paper title/tag maps to a topic profile deterministically.",
        difficulty: "Easy",
        time: "30 min",
        common_mistake: "Overfitting to only one paper title.",
      },
      {
        step: 3,
        action: `Generate architecture from ${profile.infraCore} profile`,
        purpose: "Makes architecture tab clearly topic-aware.",
        tools_needed: ["Mermaid", "Template literals"],
        expected_result: "Valid Mermaid chart changes with topic.",
        difficulty: "Medium",
        time: "35 min",
        common_mistake: "Invalid Mermaid syntax that fails at render time.",
      },
      {
        step: 4,
        action: `Generate stack recommendations around ${profile.dataCore}`,
        purpose: "Provides practical implementation choices to judges.",
        tools_needed: ["Static heuristics", "Layered stack model"],
        expected_result: "Layer-by-layer stack cards with topic relevance.",
        difficulty: "Medium",
        time: "35 min",
        common_mistake: "Same generic stack for all papers.",
      },
      {
        step: 5,
        action: "Simulate orchestration statuses and thought stream",
        purpose: "Creates multi-agent wow factor without backend complexity.",
        tools_needed: ["setInterval", "Agent timeline"],
        expected_result: "Queued -> running -> done transitions with progress.",
        difficulty: "Medium",
        time: "40 min",
        common_mistake: "Progress jumps that do not match state transitions.",
      },
      {
        step: 6,
        action: "Persist generated run context for results screen",
        purpose: "Ensures results reflect the latest mission run.",
        tools_needed: ["In-memory store module"],
        expected_result: "Results tabs display mission-generated data.",
        difficulty: "Easy",
        time: "20 min",
        common_mistake: "Regenerating different content between screens.",
      },
    ],
    Hackathon: [
      {
        step: 1,
        action: "Ship one polished golden path for judges",
        purpose: "Demo reliability beats feature breadth in hackathons.",
        tools_needed: ["Known demo papers", "Stable UI states"],
        expected_result: "A deterministic run every time on stage.",
        difficulty: "Easy",
        time: "30 min",
        common_mistake: "Adding risky features right before submission.",
      },
      {
        step: 2,
        action: "Use simulated intelligence where not demo-critical",
        purpose: "Saves build time while preserving perceived sophistication.",
        tools_needed: ["Mock thought stream", "Estimated confidence"],
        expected_result: "Believable agent behavior with transparent labels.",
        difficulty: "Easy",
        time: "20 min",
        common_mistake: "Pretending simulations are real and confusing judges.",
      },
      {
        step: 3,
        action: "Generate topic-specific scaffold and architecture snippets",
        purpose: "Shows product depth beyond static UI.",
        tools_needed: ["Template profiles", "Code previews"],
        expected_result: "Visible change in tabs when switching paper topics.",
        difficulty: "Medium",
        time: "35 min",
        common_mistake: "Only changing headings while code stays identical.",
      },
      {
        step: 4,
        action: "Prepare markdown export and backup demo script",
        purpose: "Ensures smooth judging even if live run hiccups.",
        tools_needed: ["Export button", "Prepared talking points"],
        expected_result: "Judge-ready artifact and 90-second narration flow.",
        difficulty: "Easy",
        time: "25 min",
        common_mistake: "No fallback if network or rendering fails live.",
      },
    ],
  };
}

function thoughtStreamFor(profile: TopicProfile, paper: SelectedPaper, extraction?: ResearchExtraction | null): string[] {
  return [
    `Parser: Ingested "${paper.title}" and extracted topic cues for ${profile.key}.`,
    extraction
      ? `Parser: Research Parse Mode enabled with ${extraction.confidence}% extraction confidence.`
      : "Parser: Quick Demo Mode enabled (title/topic flow).",
    `Synthesizer: Distilled implementation primitives around ${profile.modelCore}.`,
    `Architect: Drafted service graph emphasizing ${profile.infraCore}.`,
    `Stack Picker: Recommended ${profile.dataCore} and ${profile.frontendCore} for fast delivery.`,
    "Coder: Prepared scaffold preview and starter file tree for hackathon implementation.",
    "QA Critic: Flagged one risk per mode and added mitigation tips.",
    "Doc Writer: Converted steps to plain-English playbooks for all personas.",
    "Confidence: Estimated execution confidence from coherence and scope fit.",
  ];
}

export function generateTopicBundle(paper: SelectedPaper, extraction?: ResearchExtraction | null): TopicBundle {
  const profile = profileForPaper(paper);
  const steps = baseSteps(profile);
  const confidenceBoost = extraction ? Math.min(7, Math.floor(extraction.confidence / 15)) : 0;
  const confidence = Math.min(97, (profile.key === "general" ? 81 : 87) + confidenceBoost);
  const runId = `#${Math.floor(1000 + Math.random() * 8000)}`;
  const extractionSignals = extraction
    ? [
        `Research goal: ${extraction.research_goal}`,
        `Methodology: ${extraction.methodology}`,
        `Signals: ${extraction.implementation_signals.join("; ")}`,
      ]
    : [];
  return {
    modeSteps: {
      Beginner: steps.Beginner.map(toDisplayStep),
      Builder: steps.Builder.map(toDisplayStep),
      Hackathon: steps.Hackathon.map(toDisplayStep),
    },
    mermaidChart: profile.architecture,
    techStack: [
      {
        layer: "Model",
        items: [
          profile.modelCore,
          ...(extraction?.models_used?.[0] && extraction.models_used[0] !== "Not explicitly identified"
            ? [`Paper signal: ${extraction.models_used.join(", ")}`]
            : []),
          "Evaluation harness",
          "Inference adapter",
        ],
      },
      { layer: "Serving", items: [profile.infraCore, "Streaming responses", "Retry middleware"] },
      {
        layer: "Data",
        items: [
          profile.dataCore,
          ...(extraction?.datasets?.[0] && extraction.datasets[0] !== "Not explicitly identified"
            ? [`Paper datasets: ${extraction.datasets.join(", ")}`]
            : []),
          "Caching policy",
          "Trace metadata",
        ],
      },
      { layer: "Frontend", items: [profile.frontendCore, "Result tabs", "Markdown export"] },
      { layer: "Infra", items: ["Vercel/Netlify", "Container runtime", "Feature flags"] },
      { layer: "Observability", items: ["Structured logs", "Run IDs", "Confidence snapshots"] },
    ],
    codeScaffold: profile.codeScaffold,
    codeFiles: profile.codeFiles,
    thoughtStream: [...thoughtStreamFor(profile, paper, extraction), ...extractionSignals],
    confidence,
    runId,
  };
}
