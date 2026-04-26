export type ResearchMode = "quick_demo" | "research_parse";

export type ExtractedSections = {
  title?: string;
  abstract?: string;
  introduction?: string;
  relatedWork?: string;
  methodology?: string;
  experiments?: string;
  results?: string;
  conclusion?: string;
};

export type ResearchExtraction = {
  problem_statement: string;
  research_goal: string;
  methodology: string;
  workflow_pipeline: string[];
  models_used: string[];
  datasets: string[];
  evaluation_metrics: string[];
  limitations: string[];
  implementation_signals: string[];
  sections: ExtractedSections;
  confidence: number;
};
