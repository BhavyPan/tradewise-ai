import { LineChart, Line, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";

const watch = [
  { sym: "AAPL", name: "Apple Inc.", price: 189.42, change: 1.24, up: true },
  { sym: "TSLA", name: "Tesla Motors", price: 242.18, change: -2.15, up: false },
  { sym: "NVDA", name: "Nvidia Corp", price: 875.32, change: 4.82, up: true },
  { sym: "MSFT", name: "Microsoft", price: 421.65, change: 0.78, up: true },
  { sym: "AMZN", name: "Amazon", price: 178.55, change: -0.42, up: false },
];

const spark = (up: boolean) =>
  Array.from({ length: 12 }, (_, i) => ({ v: 50 + (up ? i * 2 : -i * 1.5) + Math.random() * 8 }));

export const Watchlist = () => (
  <div className="rounded-3xl bg-card border border-border shadow-sm overflow-hidden">
    <div className="p-5 border-b border-border flex items-center justify-between">
      <div>
        <h3 className="font-bold text-base">Watchlist</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Live tracked stocks</p>
      </div>
      <button className="text-xs font-semibold text-primary hover:underline">View all</button>
    </div>

    <div className="divide-y divide-border">
      {watch.map((s) => (
        <div key={s.sym} className="flex items-center gap-3 p-4 hover:bg-secondary/40 transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-xs font-bold">
            {s.sym.slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{s.sym}</p>
            <p className="text-xs text-muted-foreground truncate">{s.name}</p>
          </div>
          <div className="w-16 h-9 hidden sm:block">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spark(s.up)}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={s.up ? "hsl(var(--success))" : "hsl(var(--danger))"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold font-mono">${s.price.toFixed(2)}</p>
            <p className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${s.up ? "text-success" : "text-danger"}`}>
              {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {s.up ? "+" : ""}{s.change}%
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
