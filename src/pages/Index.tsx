import { useState } from "react";
import { Sidebar } from "@/components/trademind/Sidebar";
import { TopBar } from "@/components/trademind/TopBar";
import { PortfolioOverview } from "@/components/trademind/PortfolioOverview";
import { RecommendationCard, Recommendation } from "@/components/trademind/RecommendationCard";
import { Watchlist } from "@/components/trademind/Watchlist";
import { MarketSentiment } from "@/components/trademind/MarketSentiment";
import { Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const baseRecs: Recommendation[] = [
  {
    symbol: "RELIANCE", name: "Reliance Industries", action: "BUY", confidence: 84,
    hold: "3–5 days", risk: "Medium", price: "$28.42",
    reason: "RSI indicates oversold conditions and a strong upward trend is forming on the 4h chart.",
  },
  {
    symbol: "TSLA", name: "Tesla Motors", action: "SELL", confidence: 71,
    hold: "Exit now", risk: "High", price: "$242.18",
    reason: "Bearish MACD crossover with weakening volume — likely short-term pullback ahead.",
  },
  {
    symbol: "MSFT", name: "Microsoft", action: "HOLD", confidence: 62,
    hold: "1–2 weeks", risk: "Low", price: "$421.65",
    reason: "Consolidating above 50-day MA. Wait for breakout confirmation before adding more.",
  },
];

const Index = () => {
  const [recs, setRecs] = useState(baseRecs);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRecs(baseRecs.map((r) => ({ ...r, confidence: Math.min(99, Math.max(50, r.confidence + Math.round((Math.random() - 0.5) * 12))) })));
      setRefreshing(false);
      toast.success("AI signals refreshed");
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />

      <main className="flex-1 p-5 md:p-8 max-w-[1400px] mx-auto w-full">
        <TopBar />
        <PortfolioOverview />

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">AI Recommendations</h2>
                <p className="text-xs text-muted-foreground">Updated 2 minutes ago</p>
              </div>
            </div>
            <button
              onClick={refresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh signals"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {recs.map((r) => (
              <RecommendationCard key={r.symbol} rec={r} />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          <div className="lg:col-span-2">
            <Watchlist />
          </div>
          <MarketSentiment />
        </section>

        <footer className="text-center text-xs text-muted-foreground py-6">
          TradeMind AI · Smart suggestions, never auto-trades · Past performance ≠ future results.
        </footer>
      </main>
    </div>
  );
};

export default Index;
