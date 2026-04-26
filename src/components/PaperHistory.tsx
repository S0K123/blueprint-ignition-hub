import { useState, useEffect } from "react";
import { paperHistory, type PaperHistoryItem } from "@/lib/paper-history";
import { FileText, Clock, Trash2, Eye, X } from "lucide-react";
import { ExtractionPreview } from "@/components/ExtractionPreview";
import { toast } from "sonner";
import { setResearchExtraction } from "@/lib/research-context";
import { setSelectedPaper } from "@/lib/paper-context";

export function PaperHistory() {
  const [selectedItem, setSelectedItem] = useState<PaperHistoryItem | null>(null);
  const [history, setHistory] = useState<PaperHistoryItem[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Update history when component mounts or when forceUpdate changes
  useEffect(() => {
    setHistory(paperHistory.getHistory());
  }, [forceUpdate]);

  const handleLoadPaper = (item: PaperHistoryItem) => {
    console.log('Loading paper:', item.title);
    try {
      setResearchExtraction(item.extraction, item.fileName, item.pageCount);
      setSelectedPaper({
        title: item.title,
        authors: "From history",
        tag: "Research Parse",
      });
      toast.success(`Loaded "${item.title}" from history`);
    } catch (error) {
      console.error('Error loading paper:', error);
      toast.error('Failed to load paper');
    }
  };

  const handleRemovePaper = (id: string) => {
    console.log('Removing paper with id:', id);
    try {
      const item = history.find(h => h.id === id);
      paperHistory.removePaper(id);
      setForceUpdate(prev => prev + 1); // Force re-render
      toast.success(`Removed "${item?.title}" from history`);
    } catch (error) {
      console.error('Error removing paper:', error);
      toast.error('Failed to remove paper');
    }
  };

  const handleClearHistory = () => {
    paperHistory.clearHistory();
    setForceUpdate(prev => prev + 1); // Force re-render
    toast.success("History cleared");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (history.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Paper History</h3>
        <p className="text-muted-foreground mb-4">
          Upload and parse research papers to see them here. History is cleared when you refresh the page.
        </p>
        <button
          onClick={() => {
            // Create a test extraction
            const testExtraction = {
              problem_statement: "Test problem statement",
              research_goal: "Test research goal",
              methodology: "Test methodology",
              workflow_pipeline: ["Step 1", "Step 2"],
              models_used: ["Test Model"],
              datasets: ["Test Dataset"],
              evaluation_metrics: ["Test Metric"],
              limitations: ["Test limitation"],
              implementation_signals: ["Test signal"],
              sections: {
                title: "Test Paper",
                abstract: "Test abstract content",
                introduction: "Test introduction content",
                methodology: "Test methodology content",
                experiments: "Test experiments content",
                results: "Test results content",
                conclusion: "Test conclusion content"
              },
              confidence: 85
            };
            
            paperHistory.addPaper("test-paper.pdf", testExtraction, 5);
            toast.success("Test paper added to history");
            window.location.reload(); // Refresh to show the test paper
          }}
          className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
        >
          Add Test Paper
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Paper History</h3>
        <button
          onClick={handleClearHistory}
          className="text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="glass rounded-xl p-4 hover:border-primary/40 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <h4 className="font-medium truncate">{item.title}</h4>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(item.timestamp)}
                  </div>
                  <div>{item.pageCount} pages</div>
                  <div className="truncate max-w-[200px]">{item.fileName}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLoadPaper(item)}
                    className="inline-flex items-center gap-1 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
                  >
                    <Eye className="w-3 h-3" />
                    Load
                  </button>
                  
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="inline-flex items-center gap-1 text-xs border border-border px-3 py-1.5 rounded-md hover:bg-secondary transition-colors"
                  >
                    View Details
                  </button>
                  
                  <button
                    onClick={() => handleRemovePaper(item.id)}
                    className="inline-flex items-center gap-1 text-xs text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedItem.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {selectedItem.fileName} • {selectedItem.pageCount} pages • {formatDate(selectedItem.timestamp)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <ExtractionPreview extraction={selectedItem.extraction} />
            </div>
            
            <div className="p-6 border-t border-border">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleLoadPaper(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Load This Paper
                </button>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
