import { TrendingUp, TrendingDown, Wallet, PieChart } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

const chartData = Array.from({ length: 24 }, (_, i) => ({
  v: 100000 + Math.sin(i / 2) * 4000 + i * 800 + Math.random() * 1500,
}));

const stats = [
  { label: "Today's P/L", value: "+$1,284.50", change: "+1.04%", up: true, icon: TrendingUp },
  { label: "Total Invested", value: "$98,420", change: "12 holdings", up: true, icon: Wallet },
  { label: "Allocation", value: "78%", change: "Equity heavy", up: false, icon: PieChart },
];

export const PortfolioOverview = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
    <div className="lg:col-span-2 rounded-3xl bg-gradient-hero p-6 md:p-8 text-primary-foreground shadow-float relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
      <div className="relative">
        <p className="text-xs font-medium uppercase tracking-widest opacity-70">Total Portfolio Value</p>
        <div className="flex items-end gap-3 mt-2">
          <h1 className="text-4xl md:text-5xl font-bold font-mono">$124,892.40</h1>
          <span className="flex items-center gap-1 bg-success/20 text-success-foreground border border-success/40 rounded-full px-2.5 py-1 text-xs font-semibold mb-2">
            <TrendingUp className="w-3 h-3" /> +18.4% YTD
          </span>
        </div>
        <p className="text-sm opacity-70 mt-1">+$26,472.40 all-time gain</p>

        <div className="h-24 mt-6 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary-glow))" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(var(--primary-glow))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                labelStyle={{ display: "none" }}
                formatter={(v: number) => [`$${v.toFixed(0)}`, "Value"]}
              />
              <Area type="monotone" dataKey="v" stroke="hsl(var(--primary-glow))" strokeWidth={2.5} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl bg-card border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <s.icon className="w-4 h-4 text-foreground" />
            </div>
            <span className={`text-xs font-semibold ${s.up ? "text-success" : "text-muted-foreground"}`}>
              {s.change}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
          <p className="text-xl font-bold font-mono mt-1">{s.value}</p>
        </div>
      ))}
    </div>
  </div>
);
