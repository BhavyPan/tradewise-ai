import { useState } from "react";
import { Sidebar } from "@/components/trademind/Sidebar";
import { TopBar } from "@/components/trademind/TopBar";
import { Bell, AlertTriangle, TrendingUp, TrendingDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Alert = {
  id: number;
  type: "buy" | "sell" | "risk" | "price";
  title: string;
  desc: string;
  time: string;
};

const initial: Alert[] = [
  { id: 1, type: "buy", title: "BUY signal: RELIANCE", desc: "RSI oversold + bullish trend forming.", time: "2m ago" },
  { id: 2, type: "price", title: "NVDA jumped 4.8%", desc: "Sudden spike after earnings beat.", time: "12m ago" },
  { id: 3, type: "sell", title: "SELL signal: TSLA", desc: "Bearish MACD crossover detected.", time: "1h ago" },
  { id: 4, type: "risk", title: "Portfolio risk elevated", desc: "Tech concentration above 60%.", time: "3h ago" },
];

const typeStyle = {
  buy: { bg: "bg-success/10 text-success border-success/30", Icon: TrendingUp },
  sell: { bg: "bg-danger/10 text-danger border-danger/30", Icon: TrendingDown },
  price: { bg: "bg-accent/10 text-accent border-accent/30", Icon: Bell },
  risk: { bg: "bg-warning/10 text-warning border-warning/30", Icon: AlertTriangle },
};

const Alerts = () => {
  const [alerts, setAlerts] = useState(initial);

  const dismiss = (id: number) => setAlerts((a) => a.filter((x) => x.id !== id));

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 p-5 md:p-8 max-w-[1400px] mx-auto w-full">
        <TopBar title="Alerts" subtitle="Buy/sell signals, price moves, and risk warnings." />

        <div className="space-y-3">
          {alerts.length === 0 && (
            <div className="rounded-3xl bg-card border border-border p-12 text-center">
              <Check className="w-10 h-10 mx-auto text-success mb-3" />
              <p className="font-semibold">All caught up!</p>
              <p className="text-sm text-muted-foreground mt-1">No active alerts right now.</p>
            </div>
          )}

          {alerts.map((a) => {
            const s = typeStyle[a.type];
            return (
              <div key={a.id} className="rounded-2xl bg-card border border-border p-5 shadow-sm flex items-start gap-4">
                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center border", s.bg)}>
                  <s.Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{a.desc}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">{a.time}</p>
                </div>
                <button
                  onClick={() => dismiss(a.id)}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
                >
                  Dismiss
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Alerts;
