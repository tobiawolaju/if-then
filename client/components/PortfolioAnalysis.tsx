"use client";

import { motion } from "framer-motion";
import { portfolioStats } from "@/lib/mockData";

function CircularProgress({ value, size = 100 }: { value: number; size?: number }) {
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#27272a"
                strokeWidth={strokeWidth}
                fill="none"
            />
            <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#a855f7"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
            />
        </svg>
    );
}

function BarIndicator({ value, max = 100, color }: { value: number; max?: number; color: string }) {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div className="w-full h-2 rounded-full bg-surface/80 overflow-hidden mt-3">
            <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            />
        </div>
    );
}

export default function PortfolioAnalysis() {
    return (
        <section className="min-h-screen px-4 py-20 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-8 rounded-full bg-neon" />
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Portfolio Analysis
                    </h2>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Win Rate */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="rounded-2xl p-6 neon-border card-hover flex flex-col items-center"
                        style={{ background: "#16161a" }}
                    >
                        <p className="text-muted text-xs tracking-widest uppercase mb-4 font-medium">
                            Win Rate
                        </p>
                        <div className="relative">
                            <CircularProgress value={portfolioStats.winRate} size={120} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.span
                                    className="text-2xl font-bold font-mono"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    {portfolioStats.winRate}%
                                </motion.span>
                            </div>
                        </div>
                        <p className="text-buy text-xs mt-4 font-medium">
                            Above average
                        </p>
                    </motion.div>

                    {/* Total Fees Paid */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="rounded-2xl p-6 neon-border card-hover flex flex-col items-center justify-center"
                        style={{ background: "#16161a" }}
                    >
                        <p className="text-muted text-xs tracking-widest uppercase mb-4 font-medium">
                            Total Fees Paid
                        </p>
                        <motion.p
                            className="text-3xl font-bold font-mono text-neon"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            ${portfolioStats.totalFeesPaid.toLocaleString()}
                        </motion.p>
                        <p className="text-muted text-xs mt-3">
                            Protocol fees + Gas
                        </p>
                        <BarIndicator value={portfolioStats.totalFeesPaid} max={5000} color="#a855f7" />
                    </motion.div>

                    {/* Drawdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="rounded-2xl p-6 card-hover flex flex-col items-center justify-center"
                        style={{
                            background: "#16161a",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                        }}
                    >
                        <p className="text-muted text-xs tracking-widest uppercase mb-4 font-medium">
                            Max Drawdown
                        </p>
                        <motion.p
                            className="text-3xl font-bold font-mono text-sell"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            -{portfolioStats.drawdown}%
                        </motion.p>
                        <p className="text-muted text-xs mt-3">
                            Peak to trough
                        </p>
                        <BarIndicator value={portfolioStats.drawdown} max={50} color="#ef4444" />
                    </motion.div>
                </div>

                {/* Disclaimer */}
                <p className="text-muted/40 text-[10px] text-center mt-8 max-w-md mx-auto leading-relaxed">
                    Your trade data is public on Solana, but your notes are stored locally
                    and only visible to you.
                </p>
            </div>
        </section>
    );
}
