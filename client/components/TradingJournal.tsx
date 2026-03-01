"use client";

import { motion } from "framer-motion";
import { useDeriverseStore } from "@/lib/store";
import { journalEntries } from "@/lib/mockData";

import { AreaChart, Area, ResponsiveContainer } from "recharts";

const ITEMS_PER_PAGE = 4;

const TradeSnapshot = ({ pnl }: { pnl: number }) => {
    // Generate simple mock data based on PnL sign
    // PnL > 0: Trend upwards
    // PnL < 0: Trend downwards
    const data = [
        { v: 40 + Math.random() * 10 },
        { v: 45 + Math.random() * 10 },
        { v: 42 + Math.random() * 10 },
        { v: 50 + Math.random() * 10 },
        { v: pnl >= 0 ? 70 + Math.random() * 20 : 20 + Math.random() * 10 },
    ];

    const chartColor = pnl >= 0 ? "#a855f7" : "rgba(255, 255, 255, 0.4)";

    return (
        <div className="w-16 h-10 overflow-hidden rounded-md bg-abyss-light/30 border border-white/5">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`grad-${pnl}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="v"
                        stroke={chartColor}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill={`url(#grad-${pnl})`}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default function TradingJournal() {
    const { journalPage, nextPage, prevPage, setAiInsightOpen } = useDeriverseStore();

    const totalPages = Math.ceil(journalEntries.length / ITEMS_PER_PAGE);
    const start = journalPage * ITEMS_PER_PAGE;
    const pageEntries = journalEntries.slice(start, start + ITEMS_PER_PAGE);

    return (
        <section className="min-h-screen px-4 py-20 md:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-1 h-8 rounded-full bg-neon" />
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Trading Journal
                    </h2>
                    <span className="text-muted text-sm">
                        {journalEntries.length} trades
                    </span>
                    <button
                        onClick={() => setAiInsightOpen(true)}
                        className="ml-auto p-2 rounded-full bg-neon/10 text-neon border border-neon/20 hover:bg-neon hover:text-white transition-all shadow-lg shadow-neon/10 flex items-center justify-center"
                        title="AI Insight"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                        >
                            <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" />
                        </svg>
                    </button>
                </div>
                <p className="text-muted/60 text-xs md:text-sm mb-8 leading-relaxed max-w-2xl">
                    In your last 30 days, you traded 87 times. 62% were long. Your best day was Tuesday.
                    70% of your losses happened after midnight. Your revenge trades cost you $2,829.
                </p>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pageEntries.map((entry, i) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            className="rounded-xl p-5 neon-border card-hover"
                            style={{ background: "#16161a" }}
                        >
                            {/* Top row */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2.5">
                                    <TradeSnapshot pnl={entry.pnl} />
                                    <div>
                                        <p className="font-semibold text-sm tracking-wide">
                                            {entry.pair}
                                        </p>
                                        <p className="text-muted text-[11px]">{entry.date}</p>
                                    </div>
                                </div>
                                <span
                                    className={`font-mono font-bold text-lg ${entry.pnl >= 0 ? "text-buy" : "text-sell"
                                        }`}
                                >
                                    {entry.pnl >= 0 ? "+" : ""}
                                    ${Math.abs(entry.pnl).toFixed(2)}
                                </span>
                            </div>

                            {/* Notes */}
                            <p className="text-muted text-xs leading-relaxed line-clamp-2 mb-3">
                                {entry.notes}
                            </p>

                            {/* Tags */}
                            <div className="flex gap-1.5 flex-wrap">
                                {entry.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide bg-neon/10 text-neon"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                        onClick={prevPage}
                        disabled={journalPage === 0}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-surface/50 text-muted hover:text-white hover:bg-surface transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        ← Prev
                    </button>

                    <div className="flex gap-1.5">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all ${i === journalPage
                                    ? "bg-neon w-6"
                                    : "bg-surface hover:bg-muted"
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextPage}
                        disabled={journalPage >= totalPages - 1}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-surface/50 text-muted hover:text-white hover:bg-surface transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Next →
                    </button>
                </div>
            </div>
        </section>
    );
}
