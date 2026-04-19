import { Sidebar } from "@/components/trademind/Sidebar";
import { TopBar } from "@/components/trademind/TopBar";
import { Bell } from "lucide-react";

const Alerts = () => (
  <div className="min-h-screen flex bg-background">
    <Sidebar />
    <main className="flex-1 p-5 md:p-8 max-w-[1400px] mx-auto w-full">
      <TopBar title="Alerts" subtitle="Price alerts will show up here." />
      <div className="rounded-3xl bg-card border border-border p-10 text-center">
        <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-bold text-lg">No alerts</h3>
        <p className="text-sm text-muted-foreground mt-1">You haven't set any price alerts yet.</p>
      </div>
    </main>
  </div>
);

export default Alerts;
