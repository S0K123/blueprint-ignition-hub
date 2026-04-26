import { Link } from "@tanstack/react-router";
import { Sparkles, History } from "lucide-react";

export function Nav() {
  const linkCls = "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md";
  return (
    <header className="sticky top-0 z-50 glass border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">ProtoPapers</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/" className={linkCls} activeOptions={{ exact: true }} activeProps={{ className: "text-foreground bg-secondary" }}>Home</Link>
          <Link to="/mission" className={linkCls} activeProps={{ className: "text-foreground bg-secondary" }}>Mission Control</Link>
          <Link to="/results" className={linkCls} activeProps={{ className: "text-foreground bg-secondary" }}>Results</Link>
          <Link to="/history" className={linkCls} activeProps={{ className: "text-foreground bg-secondary" }}>History</Link>
        </nav>
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-emerald animate-pulse-soft" />
          8 agents online
        </div>
      </div>
    </header>
  );
}
