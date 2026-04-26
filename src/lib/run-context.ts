import type { SelectedPaper } from "@/lib/paper-context";
import type { TopicBundle } from "@/lib/protopapers-engine";

export type CurrentRun = {
  paper: SelectedPaper;
  bundle: TopicBundle;
};

let currentRun: CurrentRun | null = null;

export function setCurrentRun(run: CurrentRun) {
  currentRun = run;
}

export function getCurrentRun(): CurrentRun | null {
  return currentRun;
}
