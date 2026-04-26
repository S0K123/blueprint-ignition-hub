import type { ExtractedSections, ResearchExtraction } from "@/lib/research-types";

const HEADER_PATTERNS: Array<{ key: keyof ExtractedSections; pattern: RegExp }> = [
  { key: "abstract", pattern: /^\s*(abstract)\s*$/im },
  { key: "introduction", pattern: /^\s*((\d+\.?\s*)?introduction)\s*$/im },
  { key: "relatedWork", pattern: /^\s*((\d+\.?\s*)?(related work|background))\s*$/im },
  { key: "methodology", pattern: /^\s*((\d+\.?\s*)?(method|methodology|approach|proposed method))\s*$/im },
  { key: "experiments", pattern: /^\s*((\d+\.?\s*)?(experiments?|experimental setup))\s*$/im },
  { key: "results", pattern: /^\s*((\d+\.?\s*)?(results?|evaluation))\s*$/im },
  { key: "conclusion", pattern: /^\s*((\d+\.?\s*)?(conclusion|conclusions|discussion))\s*$/im },
];

function clip(text: string | undefined, limit = 420): string {
  if (!text) return "";
  return text.length <= limit ? text : `${text.slice(0, limit).trim()}...`;
}

function firstMatch(text: string, patterns: RegExp[]): string[] {
  const out = new Set<string>();
  for (const pattern of patterns) {
    const matches = text.match(pattern) ?? [];
    for (const m of matches) {
      const clean = m.trim();
      if (clean) out.add(clean);
    }
  }
  return Array.from(out).slice(0, 6);
}

function splitByHeaders(text: string): ExtractedSections {
  const lines = text.split("\n").map((l) => l.trim());
  const idx: Array<{ key: keyof ExtractedSections; line: number }> = [];

  lines.forEach((line, i) => {
    HEADER_PATTERNS.forEach(({ key, pattern }) => {
      if (pattern.test(line)) idx.push({ key, line: i });
    });
  });

  const sections: ExtractedSections = {};
  for (let i = 0; i < idx.length; i++) {
    const start = idx[i].line + 1;
    const end = i + 1 < idx.length ? idx[i + 1].line : Math.min(lines.length, start + 140);
    sections[idx[i].key] = lines.slice(start, end).join(" ").replace(/\s+/g, " ").trim();
  }
  return sections;
}

function inferTitle(text: string): string | undefined {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 20);
  return lines.find((line) => line.length > 20 && line.length < 180 && !line.toLowerCase().includes("arxiv"));
}

export function extractResearchSignals(rawText: string): ResearchExtraction {
  const text = rawText.replace(/\r/g, "\n");
  const sections = splitByHeaders(text);
  const title = inferTitle(text);
  if (!sections.title && title) sections.title = title;

  const sourceForSignals = [
    sections.abstract,
    sections.introduction,
    sections.methodology,
    sections.experiments,
    sections.results,
    sections.conclusion,
  ]
    .filter(Boolean)
    .join(" ");

  const models = firstMatch(sourceForSignals, [
    /\b(transformer|bert|gpt|lstm|cnn|diffusion|vae|gan|xgboost|random forest)\b/gi,
  ]);
  const datasets = firstMatch(sourceForSignals, [
    /\b(cifar-10|imagenet|mnist|coco|wikitext|squad|glue|mmlu|librispeech|custom dataset)\b/gi,
  ]);
  const metrics = firstMatch(sourceForSignals, [
    /\b(accuracy|f1|bleu|rouge|precision|recall|auc|rmse|mae|perplexity)\b/gi,
  ]);
  const limitations = firstMatch(sourceForSignals, [
    /\b(limit(ed|ation|ations)?|future work|challenge(s)?|weakness(es)?|trade-?off(s)?)\b/gi,
  ]);

  const workflow = [
    "Parse paper sections and extract implementation clues",
    "Map methodology to practical components and service boundaries",
    "Translate experiments/results into build priorities",
    "Generate blueprint variants and architecture recommendations",
  ];

  const implementationSignals = [
    models.length ? `Models referenced: ${models.join(", ")}` : "Model family inferred from methodology",
    datasets.length ? `Datasets referenced: ${datasets.join(", ")}` : "No clear dataset names found",
    metrics.length ? `Evaluation metrics: ${metrics.join(", ")}` : "No explicit evaluation metrics detected",
  ];

  const availableSections = Object.values(sections).filter(Boolean).length;
  const confidence = Math.min(96, 55 + availableSections * 5 + (models.length > 0 ? 8 : 0));

  return {
    problem_statement: clip(sections.introduction || sections.abstract || "Problem statement could not be confidently extracted."),
    research_goal: clip(sections.abstract || sections.introduction || "Research goal not explicitly detected; inferred from paper topic."),
    methodology: clip(sections.methodology || sections.experiments || "Methodology section missing; using topic-level fallback."),
    workflow_pipeline: workflow,
    models_used: models.length ? models : ["Not explicitly identified"],
    datasets: datasets.length ? datasets : ["Not explicitly identified"],
    evaluation_metrics: metrics.length ? metrics : ["Not explicitly identified"],
    limitations: limitations.length ? limitations : ["Limitations not clearly stated in parsed sections"],
    implementation_signals: implementationSignals,
    sections,
    confidence,
  };
}
