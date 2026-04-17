import { Activity } from "lucide-react";

const indicators = [
  { label: "RSI", value: 58, status: "Neutral", color: "warning" },
  { label: "MA (50)", value: 72, status: "Bullish", color: "success" },
  { label: "MACD", value: 64, status: "Bullish", color: "success" },
];

export const MarketSentiment = () => (
  <div className="rounded-3xl bg-card border border-border p-5 shadow-sm">
    <div className="flex items-center justify-between mb-5">
      <div>
        <h3 className="font-bold text-base">Market Pulse</h3>
        <p className="text-xs text-muted-foreground mt-0.5">S&amp;P 500 indicators</p>
      </div>
      <div className="flex items-center gap-1.5 bg-success/10 text-success border border-success/30 rounded-full px-2.5 py-1 text-xs font-bold">
        <Activity className="w-3 h-3" /> Bullish
      </div>
    </div>

    <div className="space-y-4">
      {indicators.map((i) => (
        <div key={i.label}>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-semibold">{i.label}</span>
            <span className={`font-bold text-${i.color}`}>{i.status}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-${i.color}`}
              style={{ width: `${i.value}%`, background: `hsl(var(--${i.color}))` }}
            />
          </div>
        </div>
      ))}
    </div>

    <div className="mt-5 pt-5 border-t border-border">
      <p className="text-xs text-muted-foreground leading-relaxed">
        ⚠️ This is not financial advice. Markets involve risk — always do your own research.
      </p>
    </div>
  </div>
);
