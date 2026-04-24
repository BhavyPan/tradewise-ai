import { LayoutDashboard, Briefcase, LineChart, Bell, Settings, Sparkles, MessageSquare } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Briefcase, label: "Portfolio", to: "/portfolio" },
  { icon: LineChart, label: "Market", to: "/market" },
  { icon: MessageSquare, label: "Chat", to: "/chat" },
  { icon: Bell, label: "Alerts", to: "/alerts" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

export const Sidebar = () => (
  <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r glass py-5 px-4">
    <NavLink to="/" className="flex items-center gap-2.5 mb-10">
      <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
        <Sparkles className="w-5 h-5 text-primary-foreground" />
      </div>
      <div>
        <h1 className="font-syncopate font-bold text-base leading-none text-primary tracking-wider">TradeMind</h1>
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
              "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all glass-hover",
              isActive
                ? "bg-gradient-primary text-primary-foreground shadow-neon-green"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            )
          }
        >
          <it.icon className="w-[18px] h-[18px]" />
          <span className="flex-1 text-left">{it.label}</span>
        </NavLink>
      ))}
    </nav>

    <div className="rounded-2xl p-4 glass border border-primary/20">
      <p className="text-xs font-semibold text-primary opacity-80 mb-1">Pro Insights</p>
      <p className="text-sm font-semibold leading-snug mb-3 text-foreground">Unlock advanced AI signals & alerts</p>
      <button
        onClick={() => window.alert("Pro plan coming soon! 🚀")}
        className="text-xs font-bold bg-gradient-primary text-primary-foreground rounded-lg px-3 py-1.5 w-full hover:opacity-90 transition-opacity shadow-glow"
      >
        Upgrade
      </button>
    </div>
  </aside>
);
