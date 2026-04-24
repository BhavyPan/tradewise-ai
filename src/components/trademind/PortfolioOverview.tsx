import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { fetchTicker, TickerData } from "@/lib/stockApi";
import { cn } from "@/lib/utils";

const PORTFOLIO_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN"];
const INDEX_SYMBOLS = ["SPY", "QQQ", "DIA"];

export const PortfolioOverview = () => {
  const [tickers, setTickers] = useState<TickerData[]>([]);
  const [indices, setIndices] = useState<TickerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [tickerResults, indexResults] = await Promise.all([
        Promise.all(PORTFOLIO_SYMBOLS.map(fetchTicker)),
        Promise.all(INDEX_SYMBOLS.map(fetchTicker)),
      ]);

      if (cancelled) return;
      setTickers(tickerResults.filter(Boolean) as TickerData[]);
      setIndices(indexResults.filter(Boolean) as TickerData[]);
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const totalValue = tickers.reduce((sum, t) => sum + t.price * 10, 0);
  const totalCost = tickers.reduce((sum, t) => sum + t.previousClose * 10, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPct = totalCost ? (totalGain / totalCost) * 100 : 0;

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2 rounded-3xl bg-gradient-hero p-6 md:p-8 flex items-center justify-center min-h-[200px] glass">
          <Loader2 className="w-6 h-6 animate-spin text-primary opacity-50" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl glass p-5 animate-pulse">
              <div className="h-4 w-20 bg-secondary rounded mb-3" />
              <div className="h-6 w-28 bg-secondary rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6 relative z-10">
      {/* Portfolio hero */}
      <div className="lg:col-span-2 rounded-3xl bg-gradient-hero p-6 md:p-8 text-primary-foreground shadow-float relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-widest opacity-60 font-mono">Total Portfolio Value</p>
          <div className="flex items-end gap-3 mt-2 flex-wrap">
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-primary text-glow">{formatCurrency(totalValue)}</h1>
            <span className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold mb-2 border",
              totalGain >= 0
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-danger/20 text-danger border-danger/30"
            )}>
              {totalGain >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {totalGain >= 0 ? "+" : ""}{totalGainPct.toFixed(2)}%
            </span>
          </div>
          <p className={cn("text-sm opacity-70 mt-1", totalGain < 0 && "opacity-90")}>
            {totalGain >= 0 ? "+" : ""}{formatCurrency(totalGain)} all-time gain
          </p>

          {/* Live indices row */}
          {indices.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-5">
              {indices.map((idx) => (
                <div key={idx.symbol} className="glass rounded-xl px-3 py-2 border border-primary/20">
                  <p className="text-[10px] font-semibold uppercase tracking-wider opacity-60 font-mono">{idx.symbol}</p>
                  <p className="text-sm font-bold font-mono text-foreground">{formatCurrency(idx.price)}</p>
                  <p className={cn("text-[10px] font-semibold", idx.changePercent >= 0 ? "text-primary" : "text-danger")}>
                    {idx.changePercent >= 0 ? "+" : ""}{idx.changePercent.toFixed(2)}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
        <div className="rounded-2xl glass p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-medium">Today's P/L</p>
          <p className={cn("text-xl font-bold font-mono mt-1", tickers[0]?.changePercent! >= 0 ? "text-primary" : "text-danger")}>
            {tickers[0]?.changePercent! >= 0 ? "+" : ""}{formatCurrency(tickers.reduce((s, t) => s + t.change * 10, 0))}
          </p>
        </div>

        <div className="rounded-2xl glass p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center shadow-neon-purple">
              <TrendingDown className="w-4 h-4 text-accent-foreground" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-medium">Holdings</p>
          <p className="text-xl font-bold font-mono mt-1 text-foreground">{PORTFOLIO_SYMBOLS.length} stocks</p>
        </div>

        <div className="rounded-2xl glass p-5 shadow-sm">
          <p className="text-xs text-muted-foreground font-medium mb-1">Top Performer</p>
          {tickers.length > 0 && (() => {
            const top = [...tickers].sort((a, b) => b.changePercent - a.changePercent)[0];
            return (
              <>
                <p className="text-xl font-bold font-mono text-foreground">{top.symbol}</p>
                <p className="text-xs text-primary font-semibold">+{top.changePercent.toFixed(2)}%</p>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
