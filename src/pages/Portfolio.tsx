import { Sidebar } from "@/components/trademind/Sidebar";
import { TopBar } from "@/components/trademind/TopBar";
import { TrendingDown, TrendingUp, Sparkles } from "lucide-react";

const holdings = [
  { sym: "AAPL", name: "Apple Inc.", qty: 50, entry: 165.20, price: 189.42, insight: "Strong fundamentals, hold long-term." },
  { sym: "NVDA", name: "Nvidia Corp", qty: 12, entry: 612.50, price: 875.32, insight: "AI tailwind continues — consider trimming partial profit." },
  { sym: "TSLA", name: "Tesla Motors", qty: 25, entry: 268.10, price: 242.18, insight: "Bearish momentum — review stop-loss." },
  { sym: "MSFT", name: "Microsoft", qty: 30, entry: 380.00, price: 421.65, insight: "Healthy uptrend, no action needed." },
  { sym: "AMZN", name: "Amazon", qty: 40, entry: 142.80, price: 178.55, insight: "Above 200-day MA, stable hold." },
];

const Portfolio = () => (
  <div className="min-h-screen flex bg-background">
    <Sidebar />
    <main className="flex-1 p-5 md:p-8 max-w-[1400px] mx-auto w-full">
      <TopBar title="Your Portfolio" subtitle="Holdings, performance, and AI insights per stock." />

      <div className="rounded-3xl bg-card border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-4 font-semibold">Stock</th>
                <th className="text-right p-4 font-semibold">Qty</th>
                <th className="text-right p-4 font-semibold">Entry</th>
                <th className="text-right p-4 font-semibold">Current</th>
                <th className="text-right p-4 font-semibold">P/L</th>
                <th className="text-left p-4 font-semibold hidden md:table-cell">AI Insight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {holdings.map((h) => {
                const pl = ((h.price - h.entry) / h.entry) * 100;
                const up = pl >= 0;
                return (
                  <tr key={h.sym} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                          {h.sym.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold">{h.sym}</p>
                          <p className="text-xs text-muted-foreground">{h.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono">{h.qty}</td>
                    <td className="p-4 text-right font-mono text-muted-foreground">${h.entry.toFixed(2)}</td>
                    <td className="p-4 text-right font-mono font-semibold">${h.price.toFixed(2)}</td>
                    <td className={`p-4 text-right font-bold font-mono ${up ? "text-success" : "text-danger"}`}>
                      <span className="inline-flex items-center gap-1">
                        {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {up ? "+" : ""}{pl.toFixed(2)}%
                      </span>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground hidden md:table-cell max-w-xs">
                      <span className="inline-flex items-start gap-1.5">
                        <Sparkles className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                        {h.insight}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
);

export default Portfolio;
