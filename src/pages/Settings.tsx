import { useState } from "react";
import { Sidebar } from "@/components/trademind/Sidebar";
import { TopBar } from "@/components/trademind/TopBar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!on)}
    className={cn("w-11 h-6 rounded-full p-0.5 transition-colors", on ? "bg-primary" : "bg-secondary")}
  >
    <div className={cn("w-5 h-5 bg-card rounded-full shadow transition-transform", on ? "translate-x-5" : "translate-x-0")} />
  </button>
);

const Settings = () => {
  const [notif, setNotif] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [auto, setAuto] = useState(false);
  const [risk, setRisk] = useState("medium");

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 p-5 md:p-8 max-w-[1000px] mx-auto w-full">
        <TopBar title="Settings" subtitle="Customize your AI assistant." />

        <div className="space-y-5">
          <section className="rounded-3xl bg-card border border-border p-6 shadow-sm">
            <h3 className="font-bold mb-4">Notifications</h3>
            <div className="space-y-4">
              {[
                { label: "Buy/sell signals", desc: "Get notified about new AI recommendations.", v: notif, set: setNotif },
                { label: "Risk alerts", desc: "Warnings when portfolio risk increases.", v: riskAlerts, set: setRiskAlerts },
                { label: "Auto-refresh signals", desc: "Refresh AI insights every 5 minutes.", v: auto, set: setAuto },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">{row.label}</p>
                    <p className="text-xs text-muted-foreground">{row.desc}</p>
                  </div>
                  <Toggle on={row.v} onChange={row.set} />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-card border border-border p-6 shadow-sm">
            <h3 className="font-bold mb-1">Risk tolerance</h3>
            <p className="text-xs text-muted-foreground mb-4">Tune how aggressive the AI suggestions should be.</p>
            <div className="grid grid-cols-3 gap-2">
              {["low", "medium", "high"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRisk(r)}
                  className={cn(
                    "py-3 rounded-xl text-sm font-semibold capitalize border transition-all",
                    risk === r
                      ? "bg-gradient-primary text-primary-foreground border-transparent shadow-elegant"
                      : "bg-secondary/50 border-border hover:bg-secondary"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </section>

          <button
            onClick={() => toast.success("Preferences saved")}
            className="w-full bg-gradient-primary text-primary-foreground font-bold py-3.5 rounded-2xl shadow-elegant hover:shadow-glow transition-shadow"
          >
            Save preferences
          </button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
