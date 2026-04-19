import { Sidebar } from "@/components/trademind/Sidebar";
import { TopBar } from "@/components/trademind/TopBar";
import { Briefcase } from "lucide-react";

const Portfolio = () => (
  <div className="min-h-screen flex bg-background">
    <Sidebar />
    <main className="flex-1 p-5 md:p-8 max-w-[1400px] mx-auto w-full">
      <TopBar title="Your Portfolio" subtitle="Holdings will appear here once connected." />
      <div className="rounded-3xl bg-card border border-border p-10 text-center">
        <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-bold text-lg">No holdings yet</h3>
        <p className="text-sm text-muted-foreground mt-1">Search a stock from the dashboard to track real-time prices.</p>
      </div>
    </main>
  </div>
);

export default Portfolio;
