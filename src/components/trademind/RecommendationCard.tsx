import { TrendingUp, TrendingDown, Pause, Sparkles, Clock, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type Recommendation = {
  symbol: string;
  name: string;
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  hold: string;
  risk: "Low" | "Medium" | "High";
  reason: string;
  price: string;
};

const actionStyle = {
  BUY: { bg: "bg-success/10 text-success border-success/30", icon: TrendingUp, gradient: "bg-gradient-primary" },
  SELL: { bg: "bg-danger/10 text-danger border-danger/30", icon: TrendingDown, gradient: "bg-gradient-accent" },
  HOLD: { bg: "bg-warning/10 text-warning border-warning/30", icon: Pause, gradient: "bg-gradient-accent" },
};

const riskStyle = {
  Low: "text-success",
  Medium: "text-warning",
  High: "text-danger",
};

export const RecommendationCard = ({ rec }: { rec: Recommendation }) => {
  const style = actionStyle[rec.action];
  const Icon = style.icon;

  const handleAction = () => {
    toast.success(`${rec.action} signal saved for ${rec.symbol}`, {
      description: "Reminder added to your alerts.",
    });
  };

  return (
    <div className="group rounded-2xl bg-gradient-card border border-border p-5 shadow-sm hover:shadow-float hover:-translate-y-0.5 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center font-bold text-primary-foreground", style.gradient)}>
            {rec.symbol.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight">{rec.symbol}</h3>
            <p className="text-xs text-muted-foreground">{rec.name}</p>
          </div>
        </div>
        <div className={cn("flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border", style.bg)}>
          <Icon className="w-3 h-3" />
          {rec.action}
        </div>
      </div>

      <div className="flex items-baseline justify-between mb-4">
        <span className="text-xl font-bold font-mono">{rec.price}</span>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">AI Confidence</p>
          <p className="text-sm font-bold text-primary">{rec.confidence}%</p>
        </div>
      </div>

      <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-4">
        <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${rec.confidence}%` }} />
      </div>

      <div className="flex items-center gap-3 text-xs mb-3">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" /> {rec.hold}
        </span>
        <span className={cn("flex items-center gap-1 font-semibold", riskStyle[rec.risk])}>
          <ShieldAlert className="w-3 h-3" /> {rec.risk} risk
        </span>
      </div>

      <div className="flex gap-2 items-start text-xs text-muted-foreground bg-secondary/50 rounded-xl p-3 leading-relaxed mb-3">
        <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
        <p>{rec.reason}</p>
      </div>

      <button
        onClick={handleAction}
        className={cn("w-full text-xs font-bold rounded-xl py-2.5 text-primary-foreground hover:opacity-90 transition-opacity", style.gradient)}
      >
        Save {rec.action} signal
      </button>
    </div>
  );
};
