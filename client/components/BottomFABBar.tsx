"use client";

import { motion } from "framer-motion";
import { useDeriverseStore, type TabType } from "@/lib/store";
import { vwapData } from "@/lib/mockData";

const tabs: { key: TabType; icon: string }[] = [
    { key: "Futures", icon: "📈" },
    { key: "Perps", icon: "♾️" },
    { key: "Options", icon: "🎯" },
];

export default function BottomFABBar() {
    const { activeTab, setActiveTab, openExecutionModal, isPortfolioActive } = useDeriverseStore();

    if (isPortfolioActive) return null;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.5 }}
            className="fixed bottom-[25px] left-0 right-0 z-50 px-4"
        >
            <div className="w-full max-w-[90%] md:max-w-[320px] mx-auto bg-abyss rounded-full px-3 py-2 flex items-center justify-between gap-2 shadow-2xl shadow-black/50">
                {/* Left: Icon Toggle */}
                <div className="flex bg-abyss-light rounded-full p-0.5 gap-0.5">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className="relative w-9 h-9 flex items-center justify-center rounded-full text-base transition-all duration-300"
                        >
                            {activeTab === tab.key && (
                                <motion.div
                                    layoutId="fab-tab-indicator"
                                    className="absolute inset-0 rounded-full bg-white"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span
                                className={`relative z-10 transition-all duration-300 ${activeTab === tab.key
                                    ? "grayscale invert"
                                    : "grayscale brightness-[10] opacity-70"
                                    }`}
                            >
                                {tab.icon}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Right: Buy / Sell Buttons */}
                <div className="flex gap-2">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.03 }}
                        className="px-5 py-2 rounded-full font-bold text-xs tracking-wide bg-neon hover:bg-neon-dim text-white transition-colors shadow-lg shadow-neon/20"
                    >
                        SELL
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.03 }}
                        onClick={openExecutionModal}
                        className="px-5 py-2 rounded-full font-bold text-xs tracking-wide bg-neon hover:bg-neon-dim text-white transition-colors shadow-lg shadow-neon/20 flex flex-col items-center min-w-[80px]"
                    >
                        <span className="text-xs font-bold">BUY</span>
                        <span className="text-[9px] font-mono opacity-80 -mt-0.5">
                            {vwapData.price}
                        </span>
                        <div className="w-full h-0.5 rounded-full bg-white/20 mt-0.5 overflow-hidden">
                            <motion.div
                                className="h-full rounded-full bg-white/70"
                                initial={{ width: 0 }}
                                animate={{ width: `${vwapData.dispersion * 100}%` }}
                                transition={{ duration: 1, delay: 1 }}
                            />
                        </div>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
