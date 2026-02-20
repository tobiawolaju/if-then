"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { useDeriverseStore } from "@/lib/store";
import { portfolioStats } from "@/lib/mockData";

const lyrics = [
    { title: "Portfolio Analysis", subtitle: "" },
    { title: "Win Rate", subtitle: `${portfolioStats.winRate}%`, detail: "Above average" },
    { title: "Total Fees Paid", subtitle: `$${portfolioStats.totalFeesPaid.toLocaleString()}`, detail: "Protocol fees + Gas" },
    { title: "Max Drawdown", subtitle: `-${portfolioStats.drawdown}%`, detail: "Peak to trough" },
    { title: "Your trade data is public on Solana, but your notes are stored locally and only visible to you.", subtitle: "", isDisclaimer: true },
];

export default function PortfolioAnalysisLyrics() {
    const { setIsPortfolioActive, isPortfolioActive } = useDeriverseStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Enter/Exit detection
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            // If the section is prominently on screen, mark as active
            if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                if (!isPortfolioActive) setIsPortfolioActive(true);
            } else {
                if (isPortfolioActive) setIsPortfolioActive(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isPortfolioActive, setIsPortfolioActive]);

    // Handle body background to prevent black overscroll
    useEffect(() => {
        if (isPortfolioActive) {
            document.body.style.backgroundColor = "#a855f7"; // Neon purple
        } else {
            document.body.style.backgroundColor = ""; // Reset to CSS default
        }
        return () => {
            document.body.style.backgroundColor = "";
        };
    }, [isPortfolioActive]);

    return (
        <section ref={containerRef} className="relative min-h-[300vh] bg-neon snap-start">
            {/* Full screen static container */}
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-6 text-center">

                {/* Close Button */}
                <button
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setIsPortfolioActive(false);
                    }}
                    className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white z-50 backdrop-blur-md"
                >
                    <span className="text-2xl">✕</span>
                </button>

                {/* Lyrics Scroller */}
                <div className="relative w-full max-w-2xl h-full flex flex-col items-center justify-center">
                    {lyrics.map((line, i) => (
                        <LyricLine
                            key={i}
                            index={i}
                            total={lyrics.length}
                            scrollYProgress={scrollYProgress}
                            content={line}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function LyricLine({ index, total, scrollYProgress, content }: {
    index: number;
    total: number;
    scrollYProgress: any;
    content: typeof lyrics[0] & { detail?: string; isDisclaimer?: boolean }
}) {
    const start = index / total;
    const end = (index + 1) / total;

    const opacity = useTransform(scrollYProgress, [start, (start + end) / 2, end], [0, 1, 0]);
    const scale = useTransform(scrollYProgress, [start, (start + end) / 2, end], [0.8, 1, 0.8]);
    const y = useTransform(scrollYProgress, [start, (start + end) / 2, end], [50, 0, -50]);

    return (
        <motion.div
            style={{ opacity, scale, y }}
            className={`absolute flex flex-col items-center justify-center transition-colors ${content.isDisclaimer ? "max-w-xs" : ""}`}
        >
            <h2 className={`${content.isDisclaimer ? "text-sm text-white/60 leading-relaxed" : "text-3xl md:text-5xl font-bold text-white mb-2"}`}>
                {content.title}
            </h2>
            {content.subtitle && (
                <p className="text-5xl md:text-7xl font-black text-white/90 font-mono tracking-tighter">
                    {content.subtitle}
                </p>
            )}
            {content.detail && (
                <p className="text-lg md:text-xl text-white/40 mt-4 font-medium uppercase tracking-widest">
                    {content.detail}
                </p>
            )}
        </motion.div>
    );
}
