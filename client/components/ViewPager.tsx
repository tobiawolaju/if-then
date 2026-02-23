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
import { mockMarkets } from "@/lib/mockTokens";
import dynamic from 'next/dynamic';


const tabs: TabType[] = ["Chart", "Orderbook", "Wallet"];


const timeframes: Timeframe[] = ['1m', '5m', '15m', '1h'];

export default function ViewPager() {
    const { activeTab, setActiveTab, activeMarket, setActiveMarket } = useDeriverseStore();
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

    // We explicitly request data for the active market from the store
    const { candles, loading, currentPrice, setOnCandleUpdate } = useMarketData(activeMarket, timeframe);


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

            {/* Header Controls - Centered (Only on Chart) */}
            {activeTab === "Chart" && (
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
            )}

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
                        {/* 
                            Note: The Chart is now hoisted OUTSIDE of AnimatePresence.
                            This is to prevent "Object is disposed" errors from LightweightCharts
                            when Framer Motion destroys the DOM element while polling continues.
                            We keep it empty here to reserve the animated slide space if needed.
                        */}



                        {activeTab === "Orderbook" && (
                            <div className="w-full h-full flex flex-col bg-abyss text-white/90 pt-16 px-6 select-none overflow-hidden">
                                {/* Orderbook Header */}
                                <div className="flex justify-between items-center pb-3 border-b border-white/5 text-[10px] font-black text-white/30 tracking-[0.2em] uppercase">
                                    <span className="w-1/3 text-left">Price (USD)</span>
                                    <span className="w-1/3 text-right">Size</span>
                                    <span className="w-1/3 text-right">Total</span>
                                </div>

                                <div
                                    className="flex-1 flex flex-col justify-end overflow-hidden py-1"
                                    style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%)' }}
                                >
                                    {mockOrderBookData.asks.slice(0, 15).reverse().map((ask, i) => {
                                        const total = parseFloat(ask.total);
                                        const maxTotal = parseFloat(mockOrderBookData.asks[14].total);
                                        const depthPercent = (total / maxTotal) * 100;

                                        return (
                                            <div key={`ask-${i}`} className="group relative flex justify-between items-center h-6 text-[12px] font-mono hover:bg-white/5 transition-colors">
                                                {/* Depth Bar */}
                                                <div
                                                    className="absolute right-0 top-0 bottom-0 bg-white/5 transition-all duration-500"
                                                    style={{ width: `${depthPercent}%` }}
                                                />
                                                <span className="w-1/3 text-left text-white/40 font-black z-10">{ask.price}</span>
                                                <span className="w-1/3 text-right text-white/70 z-10">{ask.size}</span>
                                                <span className="w-1/3 text-right text-white/30 z-10">{ask.total}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Current Price / Spread Indicator */}
                                <div className="relative py-4 my-2 border-y border-white/5 bg-white/[0.02] overflow-hidden">
                                    <div className="absolute inset-0 bg-neon/5 animate-pulse" />
                                    <div className="relative flex items-center justify-between px-2">
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                                {currentPrice?.toFixed(2) || "96,500.00"}
                                            </span>
                                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest -mt-1">Mid Price</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-mono text-neon">+$1,245.20</span>
                                            <span className="text-[10px] font-mono text-white/20">Spread: 1.00</span>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="flex-1 flex flex-col justify-start overflow-hidden py-1"
                                    style={{ maskImage: 'linear-gradient(to top, transparent, black 20%)', WebkitMaskImage: 'linear-gradient(to top, transparent, black 20%)' }}
                                >
                                    {mockOrderBookData.bids.slice(0, 15).map((bid, i) => {
                                        const total = parseFloat(bid.total);
                                        const maxTotal = parseFloat(mockOrderBookData.bids[14].total);
                                        const depthPercent = (total / maxTotal) * 100;

                                        return (
                                            <div key={`bid-${i}`} className="group relative flex justify-between items-center h-6 text-[12px] font-mono hover:bg-white/5 transition-colors">
                                                {/* Depth Bar */}
                                                <div
                                                    className="absolute right-0 top-0 bottom-0 bg-neon/10 transition-all duration-500"
                                                    style={{ width: `${depthPercent}%` }}
                                                />
                                                <span className="w-1/3 text-left text-neon font-black z-10">{bid.price}</span>
                                                <span className="w-1/3 text-right text-white/70 z-10">{bid.size}</span>
                                                <span className="w-1/3 text-right text-white/30 z-10">{bid.total}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Legend or Volume summary */}
                                <div className="mt-auto py-4 border-t border-white/5 flex justify-between text-[10px] font-black text-white/20 tracking-tighter uppercase">
                                    <span>Liquidity Depth: 25.4M</span>
                                    <span>24h Vol: 1.2B</span>
                                </div>
                            </div>
                        )}



                        {activeTab === "Wallet" && (
                            <div
                                className="w-full h-full flex flex-col items-center justify-start bg-abyss pt-12 px-6 overflow-y-auto pb-24 scrollbar-hide"
                                style={{ maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)' }}
                            >
                                <div className="w-full max-w-sm flex flex-col items-center gap-1 mb-10">
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

                {/* Hoisted Chart Container to prevent Unmount crashes */}
                <div
                    className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${activeTab === 'Chart' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none -z-10'}`}
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
                            isMagnetActive={isMagnetActive}
                            onToolChange={setActiveTool}
                        />
                    )}
                </div>

                {/* Left Sidebar - Quant Tools (Only visible on Chart) */}
                {activeTab === "Chart" && (
                    <div
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-[70] flex flex-col gap-2 p-1.5 bg-abyss-light/60 glass-heavy rounded-2xl shadow-2xl border border-white/5 touch-none"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >

                        <MarketSelector
                            activeMarket={activeMarket}
                            onSelect={setActiveMarket}
                        />

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

function MarketSelector({ activeMarket, onSelect }: { activeMarket: string; onSelect: (m: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-10 h-12 flex flex-col items-center justify-center rounded-xl transition-all duration-200 gap-0.5
                    ${isOpen ? 'bg-neon text-white' : 'text-muted hover:bg-white/5 hover:text-white'}
                `}
            >
                <span className="text-[8px] font-black tracking-tighter uppercase opacity-50">Pair</span>
                <span className="text-[10px] font-black tracking-tighter leading-none">{activeMarket.split('/')[0]}</span>
                <ChevronDown size={10} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.95 }}
                        className="absolute left-14 top-0 z-[100] w-48 bg-abyss-light/95 glass-heavy rounded-2xl border border-white/10 shadow-2xl p-2 overflow-hidden"
                    >
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-3 py-2 border-b border-white/5 mb-1">
                            Select Market
                        </div>
                        <div className="flex flex-col gap-1">
                            {mockMarkets.map((market) => (
                                <button
                                    key={market.id}
                                    onClick={() => {
                                        onSelect(market.symbol);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        flex items-center justify-between px-3 py-2.5 rounded-xl transition-all
                                        ${activeMarket === market.symbol
                                            ? 'bg-neon/20 text-white border border-neon/30'
                                            : 'hover:bg-white/5 text-white/60 hover:text-white border border-transparent'}
                                    `}
                                >
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs font-black">{market.symbol}</span>
                                        <span className="text-[9px] opacity-40 font-bold">{market.name}</span>
                                    </div>
                                    {activeMarket === market.symbol && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-neon shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
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
