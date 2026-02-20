"use client";

import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { useDeriverseStore, type TabType } from "@/lib/store";
import { useState } from "react";
import { LightweightChart } from "./LightweightChart";
import { useMarketData } from "../hooks/useMarketData";
import { Timeframe } from "../services/candleAggregator";
import { Search, ChevronDown, Clock } from "lucide-react";

const tabs: TabType[] = ["Futures", "Perps", "Options"];

const tabIcons: Record<TabType, React.ReactNode> = {
    Futures: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
            <polyline points="16 7 22 7 22 13"></polyline>
        </svg>
    ),
    Perps: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z"></path>
        </svg>
    ),
    Options: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
        </svg>
    ),
};

const timeframes: Timeframe[] = ['1m', '5m', '15m', '1h'];

export default function ViewPager() {
    const { activeTab, setActiveTab } = useDeriverseStore();
    const [direction, setDirection] = useState(0);
    const [timeframe, setTimeframe] = useState<Timeframe>('1m');

    const { candles, loading, currentPrice, setOnCandleUpdate } = useMarketData(activeTab, timeframe);

    const currentIndex = tabs.indexOf(activeTab);

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 50;
        if (info.offset.x < -threshold && currentIndex < tabs.length - 1) {
            setDirection(1);
            setActiveTab(tabs[currentIndex + 1]);
        } else if (info.offset.x > threshold && currentIndex > 0) {
            setDirection(-1);
            setActiveTab(tabs[currentIndex - 1]);
        }
    };

    const variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -300 : 300,
            opacity: 0,
        }),
    };

    return (
        <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Token Selector Header */}
            <div className="absolute top-6 left-6 z-[60] flex items-center gap-3">
                <button className="flex items-center gap-2 glass px-4 py-2 rounded-full hover:bg-white/10 transition-colors group shadow-lg">
                    <Search size={16} className="text-muted group-hover:text-neon transition-colors" />
                    <span className="font-bold text-white tracking-wide text-sm">SOL/USDC</span>
                    <ChevronDown size={16} className="text-muted group-hover:text-white transition-colors" />
                </button>

                {/* Timeframe Selector */}
                <div className="flex bg-abyss-light/50 glass rounded-full p-1 gap-1">
                    {timeframes.map(tf => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${timeframe === tf
                                    ? 'bg-neon text-white shadow-lg shadow-neon/20'
                                    : 'text-muted hover:text-white'
                                }`}
                        >
                            {tf.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>



            {/* Chart area */}
            <div className="relative w-full h-full z-10">
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={activeTab}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.1}
                        onDragEnd={handleDragEnd}
                        className="absolute inset-0 flex flex-col items-center justify-center glass cursor-grab active:cursor-grabbing"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{tabIcons[activeTab]}</span>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                                {activeTab}
                            </h2>
                        </div>

                        <p className="text-muted text-sm mt-2 tracking-wide flex items-center gap-2">
                            <Clock size={12} /> TradingView Terminal · {activeTab.toUpperCase()} · {timeframe}
                        </p>

                        {/* Professional Chart */}
                        <div className="w-full px-4 md:px-8 h-48 md:h-64 mb-6 mt-6 relative z-0">
                            {loading ? (
                                <div className="w-full h-full flex items-center justify-center bg-abyss-light/20 rounded-xl border border-white/5 animate-pulse">
                                    <div className="text-neon/40 text-xs font-bold tracking-widest uppercase">Initializing Stream...</div>
                                </div>
                            ) : (
                                <LightweightChart
                                    data={candles}
                                    onTick={setOnCandleUpdate}
                                />
                            )}
                        </div>

                        {/* Price mock */}
                        <div className="flex items-baseline gap-2 mt-4 glass px-4 py-2 rounded-xl">
                            <span className="text-xl font-mono font-bold text-white">
                                ${currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '---'}
                            </span>
                            <span className="text-xs text-buy font-medium">+2.34%</span>
                        </div>

                        {/* Swipe hint */}
                        <p className="text-muted/40 text-[10px] mt-6 tracking-widest uppercase">
                            ← Swipe to navigate →
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
