import type { ResearchExtraction, ResearchMode } from "@/lib/research-types";
import { paperHistory } from "@/lib/paper-history";

type ResearchState = {
  mode: ResearchMode;
  extraction: ResearchExtraction | null;
  sourceFileName?: string;
};

let researchState: ResearchState = {
  mode: "quick_demo",
  extraction: null,
};

export function setResearchMode(mode: ResearchMode) {
  researchState = { ...researchState, mode };
}

export function setResearchExtraction(extraction: ResearchExtraction | null, sourceFileName?: string, pageCount?: number) {
  researchState = { ...researchState, extraction, sourceFileName };
  
  // Only save to history if we have a valid extraction and filename
  // Don't save when extraction is null (error cases, mode switches, etc.)
  if (extraction && sourceFileName) {
    paperHistory.addPaper(sourceFileName, extraction, pageCount || 0);
  }
}

export function getResearchState(): ResearchState {
  return researchState;
}
