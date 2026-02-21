"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDeriverseStore, type TabType } from "@/lib/store";
import { useState } from "react";
import { LightweightChart } from "./LightweightChart";
import { useMarketData } from "../hooks/useMarketData";
import { Timeframe } from "../services/candleAggregator";
import { Search, ChevronDown, Clock, MousePointer2, Slash, Minus, Ruler, Magnet, Trash2, LayoutGrid } from "lucide-react";

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
    const currentIndex = tabs.indexOf(activeTab);
    const [prevIndex, setPrevIndex] = useState(currentIndex);
    const [direction, setDirection] = useState(0);
    const [timeframe, setTimeframe] = useState<Timeframe>('1m');
    const [activeTool, setActiveTool] = useState<string>("cursor");

    // Update direction when tab changes
    if (currentIndex !== prevIndex) {
        setDirection(currentIndex > prevIndex ? 1 : -1);
        setPrevIndex(currentIndex);
    }

    const { candles, loading, currentPrice, setOnCandleUpdate } = useMarketData(activeTab, timeframe);


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
        <section className="h-[70vh] w-screen flex flex-col relative overflow-hidden bg-abyss">
            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Header Controls - Centered */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[60] flex items-center justify-center">
                {/* Timeframe Selector */}
                <div className="flex bg-abyss-light/40 glass rounded-full p-1 gap-1 shadow-2xl">
                    {timeframes.map(tf => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-5 py-2 rounded-full text-[12px] font-black tracking-tighter transition-all ${timeframe === tf
                                ? 'bg-neon text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                                : 'text-muted hover:text-white'
                                }`}
                        >
                            {tf.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Immersive Chart Area */}
            <div className="flex-1 w-full h-full relative z-10">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={activeTab}
                        custom={direction}
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        className="absolute inset-0 w-full h-full"
                    >
                        {loading ? (
                            <div className="w-full h-full flex items-center justify-center bg-abyss">
                                <div className="text-neon/30 text-xs font-black tracking-[0.3em] uppercase animate-pulse">
                                    Synchronizing Nodes...
                                </div>
                            </div>
                        ) : (
                            <LightweightChart
                                data={candles}
                                onTick={setOnCandleUpdate}
                                activeTool={activeTool}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Left Sidebar - Quant Tools */}
                <div
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-[70] flex flex-col gap-2 p-1.5 bg-abyss-light/60 glass-heavy rounded-2xl shadow-2xl border border-white/5 touch-none"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <ToolButton
                        icon={<MousePointer2 size={18} />}
                        active={activeTool === "cursor"}
                        onClick={() => setActiveTool("cursor")}
                    />
                    <div className="w-full h-px bg-white/5 my-1" />
                    <ToolButton
                        icon={<Slash size={18} />}
                        active={activeTool === "trend"}
                        onClick={() => setActiveTool("trend")}
                    />
                    <ToolButton
                        icon={<Minus size={18} />}
                        active={activeTool === "level"}
                        onClick={() => setActiveTool("level")}
                    />
                    <ToolButton
                        icon={<LayoutGrid size={18} />}
                        active={activeTool === "grid"}
                        onClick={() => setActiveTool("grid")}
                    />
                    <ToolButton
                        icon={<Ruler size={18} />}
                        active={activeTool === "measure"}
                        onClick={() => setActiveTool("measure")}
                    />
                    <div className="w-full h-px bg-white/5 my-1" />
                    <ToolButton
                        icon={<Magnet size={18} />}
                        active={activeTool === "magnet"}
                        onClick={() => setActiveTool("magnet")}
                    />
                    <ToolButton
                        icon={<Trash2 size={18} />}
                        className="text-sell/60 hover:text-sell"
                        onClick={() => { }}
                    />
                </div>
            </div>
        </section>
    );
}

function ToolButton({ icon, active, onClick, className = "" }: { icon: React.ReactNode; active?: boolean; onClick: () => void; className?: string }) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className={`
            w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200
            ${active
                    ? 'bg-neon text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'text-muted hover:bg-white/5 hover:text-white'}
            ${className}
        `}>
            {icon}
        </button>
    );
}
