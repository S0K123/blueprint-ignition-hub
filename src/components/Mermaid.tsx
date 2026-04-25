import { useEffect, useRef, useState } from "react";

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          background: "#1a1b26",
          primaryColor: "#1f2335",
          primaryTextColor: "#c0caf5",
          primaryBorderColor: "#7aa2f7",
          lineColor: "#7aa2f7",
          tertiaryColor: "#24283b",
        },
        fontFamily: "inherit",
      });
      try {
        const { svg } = await mermaid.render("m" + Math.random().toString(36).slice(2), chart);
        if (!cancelled) setSvg(svg);
      } catch (e) {
        if (!cancelled) setSvg(`<pre>${(e as Error).message}</pre>`);
      }
    })();
    return () => { cancelled = true; };
  }, [chart]);

  return <div ref={ref} className="mermaid-container w-full overflow-auto" dangerouslySetInnerHTML={{ __html: svg }} />;
}
