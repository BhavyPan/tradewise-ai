import { Search, Moon, Sun, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Props = { title?: string; subtitle?: string };

export const TopBar = ({ title = "TradeMind AI", subtitle = "Search any real-world stock for live prices." }: Props) => {
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      toast.success(`Searching for "${query.toUpperCase()}"...`);
      setQuery("");
    }
  };

  return (
    <header className="flex items-center justify-between gap-4 mb-8 flex-wrap">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2">
        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 bg-card border border-border rounded-xl px-3.5 py-2 w-64 shadow-sm focus-within:ring-2 focus-within:ring-primary/40">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stocks..."
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
          />
        </form>
        <button
          aria-label="Toggle theme"
          onClick={() => setDark(!dark)}
          className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button
          aria-label="Alerts"
          onClick={() => navigate("/alerts")}
          className="relative w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger" />
        </button>
        <button
          onClick={() => navigate("/settings")}
          className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center text-sm font-bold text-accent-foreground hover:opacity-90 transition-opacity"
        >
          A
        </button>
      </div>
    </header>
  );
};
