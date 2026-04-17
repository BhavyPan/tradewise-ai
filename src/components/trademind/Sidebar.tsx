import { LayoutDashboard, Briefcase, LineChart, Bell, Settings, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Briefcase, label: "Portfolio", to: "/portfolio" },
  { icon: LineChart, label: "Market", to: "/market" },
  { icon: Bell, label: "Alerts", to: "/alerts", badge: 3 },
  { icon: Settings, label: "Settings", to: "/settings" },
];

export const Sidebar = () => (
  <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-border bg-card/50 p-5">
    <NavLink to="/" className="flex items-center gap-2.5 mb-10">
      <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
        <Sparkles className="w-5 h-5 text-primary-foreground" />
      </div>
      <div>
        <h1 className="font-bold text-lg leading-none">TradeMind</h1>
        <p className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase mt-0.5">AI Assistant</p>
      </div>
    </NavLink>

    <nav className="flex flex-col gap-1 flex-1">
      {items.map((it) => (
        <NavLink
          key={it.label}
          to={it.to}
          end={it.to === "/"}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
              isActive
                ? "bg-gradient-primary text-primary-foreground shadow-elegant"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )
          }
        >
          <it.icon className="w-[18px] h-[18px]" />
          <span className="flex-1 text-left">{it.label}</span>
          {it.badge && (
            <span className="text-[10px] font-bold bg-danger text-danger-foreground rounded-full px-1.5 py-0.5">
              {it.badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>

    <div className="rounded-2xl p-4 bg-gradient-hero text-primary-foreground">
      <p className="text-xs font-semibold opacity-80 mb-1">Pro Insights</p>
      <p className="text-sm font-semibold leading-snug mb-3">Unlock advanced AI signals & alerts</p>
      <button
        onClick={() => window.alert("Pro plan coming soon! 🚀")}
        className="text-xs font-bold bg-primary-foreground text-foreground rounded-lg px-3 py-1.5 w-full hover:opacity-90 transition-opacity"
      >
        Upgrade
      </button>
    </div>
  </aside>
);
