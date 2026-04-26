import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { PaperHistory } from "@/components/PaperHistory";
import { History } from "lucide-react";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-secondary/20">
      <Nav />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center shadow-glow">
              <History className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Paper History</h1>
              <p className="text-muted-foreground">
                View and reload previously parsed research papers
              </p>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground bg-secondary/50 rounded-lg p-4 border border-border/50">
            <strong>Note:</strong> Paper history is stored in your browser session and will be cleared when you refresh the page or close the browser.
          </div>
        </div>

        <PaperHistory />
      </main>
    </div>
  );
}
