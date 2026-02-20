"use client";

import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { useDeriverseStore, type TabType } from "@/lib/store";
import { useState } from "react";

const tabs: TabType[] = ["Futures", "Perps", "Options"];

const tabIcons: Record<TabType, string> = {
    Futures: "📈",
    Perps: "♾️",
    Options: "🎯",
};

const chartLines = [
    [20, 45, 35, 55, 48, 62, 58, 72, 65, 80, 75, 90, 85, 78, 88],
    [50, 42, 55, 38, 45, 32, 48, 35, 52, 40, 58, 45, 62, 50, 55],
    [30, 35, 28, 42, 38, 50, 45, 55, 60, 52, 65, 58, 70, 62, 68],
];

function MockChart({ tabIndex }: { tabIndex: number }) {
    const data = chartLines[tabIndex];
    const width = 300;
    const height = 120;
    const stepX = width / (data.length - 1);

    const pathD = data
        .map((y, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${height - y}`)
        .join(" ");

    const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-32 md:h-48 mt-6 opacity-60"
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id={`grad-${tabIndex}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaD} fill={`url(#grad-${tabIndex})`} />
            <path d={pathD} fill="none" stroke="#a855f7" strokeWidth="2" />
        </svg>
    );
}

export default function ViewPager() {
    const { activeTab, setActiveTab } = useDeriverseStore();
    const [direction, setDirection] = useState(0);

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

                        <p className="text-muted text-sm mt-2 tracking-wide">
                            TradingView Chart · {activeTab.toUpperCase()}
                        </p>

                        {/* Mock chart SVG */}
                        <div className="w-full px-8">
                            <MockChart tabIndex={currentIndex} />
                        </div>

                        {/* Price mock */}
                        <div className="flex items-baseline gap-2 mt-4">
                            <span className="text-xl font-mono font-bold text-white">
                                $145.20
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
