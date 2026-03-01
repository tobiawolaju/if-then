"use client";

import dynamic from "next/dynamic";
import ViewPager from "@/components/ViewPager";
import TradingJournal from "@/components/TradingJournal";
import PortfolioAnalysisLyrics from "@/components/PortfolioAnalysisLyrics";

import BottomFABBar from "@/components/BottomFABBar";
import ExecutionModal from "@/components/ExecutionModal";
import AIInsightModal from "@/components/AIInsightModal";
import SplashScreen from "@/components/SplashScreen";

export default function Home() {
  return (
    <main className="relative min-h-screen pb-24 scroll-smooth">
      <SplashScreen />
      {/* Fold 1: Chart ViewPager */}
      <ViewPager />

      {/* Fold 2: Trading Journal */}
      <TradingJournal />

      {/* Fold 3: Portfolio Analysis (Storytelling) */}
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
