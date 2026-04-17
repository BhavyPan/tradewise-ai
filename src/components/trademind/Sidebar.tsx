import { LayoutDashboard, Briefcase, LineChart, Bell, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Briefcase, label: "Portfolio" },
  { icon: LineChart, label: "Market" },
  { icon: Bell, label: "Alerts", badge: 3 },
  { icon: Settings, label: "Settings" },
];

export const Sidebar = () => (
  <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-border bg-card/50 p-5">
    <div className="flex items-center gap-2.5 mb-10">
      <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
        <Sparkles className="w-5 h-5 text-primary-foreground" />
      </div>
      <div>
        <h1 className="font-bold text-lg leading-none">TradeMind</h1>
        <p className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase mt-0.5">AI Assistant</p>
      </div>
    </div>

    <nav className="flex flex-col gap-1 flex-1">
      {items.map((it) => (
        <button
          key={it.label}
          className={cn(
            "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
            it.active
              ? "bg-gradient-primary text-primary-foreground shadow-elegant"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <it.icon className="w-[18px] h-[18px]" />
          <span className="flex-1 text-left">{it.label}</span>
          {it.badge && (
            <span className="text-[10px] font-bold bg-danger text-danger-foreground rounded-full px-1.5 py-0.5">
              {it.badge}
            </span>
          )}
        </button>
      ))}
    </nav>

    <div className="rounded-2xl p-4 bg-gradient-hero text-primary-foreground">
      <p className="text-xs font-semibold opacity-80 mb-1">Pro Insights</p>
      <p className="text-sm font-semibold leading-snug mb-3">Unlock advanced AI signals & alerts</p>
      <button className="text-xs font-bold bg-primary-foreground text-foreground rounded-lg px-3 py-1.5 w-full">
        Upgrade
      </button>
    </div>
  </aside>
);
