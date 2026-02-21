"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDeriverseStore, type TabType } from "@/lib/store";
import { useState } from "react";
import { LightweightChart } from "./LightweightChart";
import { useMarketData } from "../hooks/useMarketData";
import { Timeframe } from "../services/candleAggregator";
import { Search, ChevronDown, Clock, MousePointer2, Slash, Minus, Ruler, Magnet, Trash2, LayoutGrid, BookOpen } from "lucide-react";

import { mockWalletData } from "@/lib/mockWalletData";
import { mockOrderBookData } from "@/lib/mockOrderBook";
import dynamic from 'next/dynamic';

interface ListProps {
    height: number;
    itemCount: number;
    itemSize: number;
    width: string | number;
    className?: string;
    style?: React.CSSProperties;
    children: (props: { index: number; style: React.CSSProperties }) => React.ReactElement;
}

const List = dynamic<ListProps>(() => import('react-window').then((mod: any) => mod.FixedSizeList), {
    ssr: false,
    loading: () => <div className="animate-pulse bg-white/5 w-full h-full rounded-md" />
});

const tabs: TabType[] = ["Chart", "Orderbook", "Wallet"];


const timeframes: Timeframe[] = ['1m', '5m', '15m', '1h'];

export default function ViewPager() {
    const { activeTab, setActiveTab } = useDeriverseStore();
    const currentIndex = tabs.indexOf(activeTab);
    const [prevIndex, setPrevIndex] = useState(currentIndex);
    const [direction, setDirection] = useState(0);
    const [timeframe, setTimeframe] = useState<Timeframe>('1m');
    const [activeTool, setActiveTool] = useState<string>("cursor");
    const [isMagnetActive, setIsMagnetActive] = useState(false);

    // Update direction when tab changes
    if (currentIndex !== prevIndex) {
        setDirection(currentIndex > prevIndex ? 1 : -1);
        setPrevIndex(currentIndex);
    }

    // We explicitly request 'Futures' market data regardless of active tab
    // because activeTab is now just a UI state ("Chart"), not a market product identifier.
    const { candles, loading, currentPrice, setOnCandleUpdate } = useMarketData("Futures", timeframe);


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
                        {activeTab === "Chart" && (
                            <>
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
                                        isMagnetActive={isMagnetActive}
                                        onToolChange={setActiveTool}
                                    />
                                )}
                            </>
                        )}

                        {activeTab === "Orderbook" && (
                            <div className="w-full h-full flex flex-col bg-abyss text-white/90 pt-16 px-4">
                                {/* Orderbook Header */}
                                <div className="flex justify-between items-center pb-2 border-b border-white/10 text-xs font-bold text-white/50 tracking-wider">
                                    <span className="w-1/3 text-left">PRICE</span>
                                    <span className="w-1/3 text-right">SIZE</span>
                                    <span className="w-1/3 text-right">TOTAL</span>
                                </div>

                                {/* Asks (Descending to Mid) */}
                                <div className="flex-1 overflow-hidden mt-2 relative">
                                    <List
                                        height={300} // Approximate half-height, flex handles actual bounds poorly in old react-window without AutoSizer
                                        itemCount={mockOrderBookData.asks.length}
                                        itemSize={24}
                                        width="100%"
                                        className="scrollbar-hide"
                                        style={{ height: '40vh' }}
                                    >
                                        {({ index, style }) => {
                                            // Reverse index so lowest ask is at the bottom near the spread
                                            const ask = mockOrderBookData.asks[mockOrderBookData.asks.length - 1 - index];
                                            return (
                                                <div style={style} className="flex justify-between items-center text-sm font-mono cursor-pointer hover:bg-white/5">
                                                    <span className="w-1/3 text-left text-sell drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">{ask.price}</span>
                                                    <span className="w-1/3 text-right text-white/80">{ask.size}</span>
                                                    <span className="w-1/3 text-right text-white/40">{ask.total}</span>
                                                </div>
                                            );
                                        }}
                                    </List>
                                </div>

                                {/* Spread / Mid Price */}
                                <div className="flex items-center justify-center py-2 bg-white/5 border-y border-white/10 my-2 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                                    <span className="text-xl font-black text-white tracking-tighter">
                                        {currentPrice?.toFixed(2) || "96,500.00"}
                                    </span>
                                </div>

                                {/* Bids (Ascending from Mid) */}
                                <div className="flex-1 overflow-hidden mb-2 relative">
                                    <List
                                        height={300}
                                        itemCount={mockOrderBookData.bids.length}
                                        itemSize={24}
                                        width="100%"
                                        className="scrollbar-hide"
                                        style={{ height: '40vh' }}
                                    >
                                        {({ index, style }) => {
                                            const bid = mockOrderBookData.bids[index];
                                            return (
                                                <div style={style} className="flex justify-between items-center text-sm font-mono cursor-pointer hover:bg-white/5">
                                                    <span className="w-1/3 text-left text-buy drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">{bid.price}</span>
                                                    <span className="w-1/3 text-right text-white/80">{bid.size}</span>
                                                    <span className="w-1/3 text-right text-white/40">{bid.total}</span>
                                                </div>
                                            );
                                        }}
                                    </List>
                                </div>
                            </div>
                        )}



                        {activeTab === "Wallet" && (
                            <div className="w-full h-full flex flex-col items-center justify-start bg-abyss pt-12 px-6">
                                <div className="w-full max-w-sm flex flex-col items-center gap-1 mb-10">
                                    <div style={{ marginTop: "100px" }}></div>
                                    <h2 className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                        {mockWalletData.totalBalanceUsd}
                                    </h2>
                                    <p className="text-xs font-mono text-neon bg-neon/10 px-3 py-1 rounded-full border border-neon/20">
                                        {mockWalletData.address}
                                    </p>
                                </div>

                                <div className="w-full max-w-sm flex flex-col gap-3">
                                    <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest pl-2 mb-2">Assets</h3>
                                    {mockWalletData.tokens.map(token => (
                                        <div key={token.id} className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 glass hover:bg-white/10 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-neon/20 flex items-center justify-center text-neon border border-neon/30 font-black">
                                                    {token.symbol[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white">{token.symbol}</span>
                                                    <span className="text-xs text-white/50">{token.name}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-white">{token.usdValue}</span>
                                                <div className="flex gap-2">
                                                    <span className="text-xs text-white/50">{token.balance} {token.symbol}</span>
                                                    <span className={`text-xs ${token.isUp ? 'text-buy' : 'text-sell'}`}>
                                                        {token.change24h}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Left Sidebar - Quant Tools (Only visible on Chart) */}
                {activeTab === "Chart" && (
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
                            active={isMagnetActive}
                            onClick={() => setIsMagnetActive(!isMagnetActive)}
                        />
                        <ToolButton
                            icon={<Trash2 size={18} />}
                            className="text-sell/60 hover:text-sell"
                            onClick={() => setActiveTool("trash")}
                        />
                    </div>
                )}
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
