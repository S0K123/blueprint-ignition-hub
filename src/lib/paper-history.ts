import type { ResearchExtraction } from "@/lib/research-types";

export type PaperHistoryItem = {
  id: string;
  fileName: string;
  title: string;
  timestamp: number;
  extraction: ResearchExtraction;
  pageCount: number;
};

class PaperHistoryManager {
  private storageKey = 'protopapers-history';
  private history: PaperHistoryItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = sessionStorage.getItem(this.storageKey);
      if (stored) {
        this.history = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load paper history from session storage:', error);
      this.history = [];
    }
  }

  private saveToStorage() {
    try {
      sessionStorage.setItem(this.storageKey, JSON.stringify(this.history));
    } catch (error) {
      console.warn('Failed to save paper history to session storage:', error);
    }
  }

  addPaper(fileName: string, extraction: ResearchExtraction, pageCount: number) {
    const historyItem: PaperHistoryItem = {
      id: Date.now().toString(),
      fileName,
      title: extraction.sections.title || fileName.replace(/\.pdf$/i, ''),
      timestamp: Date.now(),
      extraction,
      pageCount
    };

    // Add to beginning of history (most recent first)
    this.history.unshift(historyItem);
    
    // Keep only last 10 papers
    if (this.history.length > 10) {
      this.history = this.history.slice(0, 10);
    }

    this.saveToStorage();
    return historyItem;
  }

  getHistory(): PaperHistoryItem[] {
    return this.history;
  }

  removePaper(id: string) {
    this.history = this.history.filter(item => item.id !== id);
    this.saveToStorage();
  }

  clearHistory() {
    this.history = [];
    this.saveToStorage();
  }

  getPaper(id: string): PaperHistoryItem | undefined {
    return this.history.find(item => item.id === id);
  }
}

// Export singleton instance
export const paperHistory = new PaperHistoryManager();
