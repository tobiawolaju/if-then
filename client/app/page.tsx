"use client";

import ViewPager from "@/components/ViewPager";
import TradingJournal from "@/components/TradingJournal";
import PortfolioAnalysisLyrics from "@/components/PortfolioAnalysisLyrics";
import BottomFABBar from "@/components/BottomFABBar";
import ExecutionModal from "@/components/ExecutionModal";
import AIInsightModal from "@/components/AIInsightModal";
import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <main className="relative min-h-screen pb-24 scroll-smooth">
      {/* Top Header: Login */}
      <div className="fixed top-6 right-6 z-[60]">
        <LoginButton />
      </div>

      {/* Fold 1: Chart ViewPager */}
      <ViewPager />

      {/* Fold 2: Trading Journal */}
      <TradingJournal />

      {/* Fold 3: Portfolio Analysis */}
      <PortfolioAnalysisLyrics />

      {/* Fixed Bottom FAB Bar */}
      <BottomFABBar />

      {/* Execution Modal */}
      <ExecutionModal />

      {/* AI Insight Modal */}
      <AIInsightModal />
    </main>
  );
}
