import { Search, Moon, Sun, Bell } from "lucide-react";
import { useEffect, useState } from "react";

export const TopBar = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="flex items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Good morning, Alex 👋</h2>
        <p className="text-sm text-muted-foreground mt-1">Here's what your AI assistant found today.</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 bg-card border border-border rounded-xl px-3.5 py-2 w-64 shadow-sm">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search stocks..."
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
          />
        </div>
        <button
          onClick={() => setDark(!dark)}
          className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className="relative w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center text-sm font-bold text-accent-foreground">
          A
        </div>
      </div>
    </header>
  );
};
