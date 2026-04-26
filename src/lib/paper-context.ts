export type SelectedPaper = {
  title: string;
  authors?: string;
  year?: number;
  tag?: string;
};

const defaultPaper: SelectedPaper = {
  title: "Attention Is All You Need",
  authors: "Vaswani et al.",
  year: 2017,
  tag: "Transformers",
};

let currentPaper: SelectedPaper = defaultPaper;

export function setSelectedPaper(paper: SelectedPaper) {
  currentPaper = {
    ...paper,
    title: paper.title.trim() || defaultPaper.title,
  };
}

export function getSelectedPaper(): SelectedPaper {
  return currentPaper;
}
