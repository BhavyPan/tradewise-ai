import { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { fetchTicker, TickerData } from "@/lib/stockApi";

const WATCHLIST_SYMBOLS = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN"];
const INTERVAL = 30_000;

const spark = (up: boolean) =>
  Array.from({ length: 12 }, (_, i) => ({ v: 50 + (up ? i * 2 : -i * 1.5) }));

export const Watchlist = () => {
  const navigate = useNavigate();
  const [tickers, setTickers] = useState<TickerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const results = await Promise.all(WATCHLIST_SYMBOLS.map(fetchTicker));
      if (cancelled) return;
      setTickers(results.filter(Boolean) as TickerData[]);
      setLoading(false);
    }

    load();
    const id = setInterval(load, INTERVAL);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl glass overflow-hidden relative z-10">
        <div className="p-5 border-b border-border/40 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-foreground">Watchlist</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Live tracked stocks</p>
          </div>
        </div>
        <div className="divide-y divide-border/40">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 rounded-xl bg-secondary/50 animate-pulse" />
              <div className="flex-1 space-y-1">
                <div className="h-3 w-12 bg-secondary/50 rounded animate-pulse" />
                <div className="h-2 w-20 bg-secondary/50 rounded animate-pulse" />
              </div>
              <div className="w-16 h-9 bg-secondary/50 rounded animate-pulse" />
              <div className="w-16 space-y-1">
                <div className="h-3 w-14 bg-secondary/50 rounded ml-auto animate-pulse" />
                <div className="h-2 w-10 bg-secondary/50 rounded ml-auto animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl glass overflow-hidden relative z-10">
      <div className="p-5 border-b border-border/40 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground">Watchlist</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Live tracked stocks</p>
        </div>
        <button onClick={() => navigate("/market")} className="text-xs font-semibold text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="divide-y divide-border/40">
        {tickers.map((s) => {
          const up = s.changePercent >= 0;
          return (
            <button
              key={s.symbol}
              onClick={() => toast(`${s.symbol} · $${s.price.toFixed(2)}`, { description: s.name })}
              className="w-full flex items-center gap-3 p-4 hover:bg-secondary/30 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-glow">
                {s.symbol.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{s.symbol}</p>
                <p className="text-xs text-muted-foreground truncate">{s.name}</p>
              </div>
              <div className="w-16 h-9 hidden sm:block">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spark(up)}>
                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke={up ? "hsl(156 100% 50%)" : "hsl(0 85% 60%)"}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold font-mono text-foreground">${s.price.toFixed(2)}</p>
                <p className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${up ? "text-primary" : "text-danger"}`}>
                  {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {up ? "+" : ""}{s.changePercent.toFixed(2)}%
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
