"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import * as Slider from "@radix-ui/react-slider";
import { useDeriverseStore } from "@/lib/store";

const emotionChips = [
    { emoji: "🔥", label: "FOMO" },
    { emoji: "💎", label: "Strategy" },
    { emoji: "📰", label: "News" },
    { emoji: "🧤", label: "Fat Finger" },
];

export default function ExecutionModal() {
    const { executionModalOpen, closeExecutionModal } = useDeriverseStore();
    const [size, setSize] = useState("");
    const [lockProgress, setLockProgress] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [confidence, setConfidence] = useState([3]);
    const [activeChips, setActiveChips] = useState<string[]>([]);

    const toggleChip = (label: string) => {
        setActiveChips((prev) =>
            prev.includes(label)
                ? prev.filter((c) => c !== label)
                : [...prev, label]
        );
    };

    const handleLockDrag = (value: number[]) => {
        setLockProgress(value[0]);
        if (value[0] >= 95) {
            setIsLocked(true);
        }
    };

    const resetModal = () => {
        setSize("");
        setLockProgress(0);
        setIsLocked(false);
        setConfidence([3]);
        setActiveChips([]);
        closeExecutionModal();
    };

    return (
        <Dialog.Root open={executionModalOpen} onOpenChange={(open) => !open && resetModal()}>
            <AnimatePresence>
                {executionModalOpen && (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                            />
                        </Dialog.Overlay>

                        <Dialog.Content asChild>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                                className="fixed left-1/2 top-1/2 z-[70] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 neon-border focus:outline-none"
                                style={{ background: "#111114" }}
                            >
                                {/* Title */}
                                <Dialog.Title className="text-xl font-bold tracking-tight mb-1">
                                    Execute Trade
                                </Dialog.Title>
                                <Dialog.Description className="text-muted text-xs mb-6">
                                    Confirm your position size and lock to execute.
                                </Dialog.Description>

                                {/* Size Input */}
                                <div className="mb-5">
                                    <label className="text-xs text-muted font-medium tracking-wide uppercase block mb-2">
                                        Position Size
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={size}
                                            onChange={(e) => setSize(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-abyss border border-surface rounded-xl px-4 py-3 text-lg font-mono text-white placeholder:text-muted/40 focus:outline-none focus:border-neon/50 transition-colors"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-sm">
                                            SOL
                                        </span>
                                    </div>
                                </div>

                                {/* Lock Slider */}
                                <div className="mb-6">
                                    <label className="text-xs text-muted font-medium tracking-wide uppercase block mb-3">
                                        {isLocked ? "🔒 Locked" : "Slide to Lock"}
                                    </label>
                                    <div className="relative">
                                        <Slider.Root
                                            value={[lockProgress]}
                                            onValueChange={handleLockDrag}
                                            max={100}
                                            step={1}
                                            disabled={isLocked}
                                            className="relative flex items-center select-none touch-none w-full h-10"
                                        >
                                            <Slider.Track className="relative grow h-10 rounded-xl overflow-hidden bg-surface/60">
                                                <Slider.Range
                                                    className="absolute h-full rounded-xl transition-colors"
                                                    style={{
                                                        background: isLocked
                                                            ? "rgba(34, 197, 94, 0.3)"
                                                            : "rgba(168, 85, 247, 0.2)",
                                                    }}
                                                />
                                                {!isLocked && (
                                                    <span className="absolute inset-0 flex items-center justify-center text-muted/40 text-xs tracking-widest pointer-events-none">
                                                        SLIDE →
                                                    </span>
                                                )}
                                            </Slider.Track>
                                            <Slider.Thumb className="block w-10 h-10 rounded-xl bg-neon shadow-lg shadow-neon/30 hover:bg-neon-dim focus:outline-none focus:ring-2 focus:ring-neon/50 cursor-grab active:cursor-grabbing transition-colors" />
                                        </Slider.Root>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-surface mb-5" />

                                {/* Psychology Section */}
                                <div>
                                    <p className="text-xs text-muted font-medium tracking-wide uppercase mb-4">
                                        🧠 Psychology Capture
                                    </p>

                                    {/* Confidence Slider */}
                                    <div className="mb-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-muted">Confidence</span>
                                            <span className="text-sm font-mono font-bold text-neon">
                                                {confidence[0]}/5
                                            </span>
                                        </div>
                                        <Slider.Root
                                            value={confidence}
                                            onValueChange={setConfidence}
                                            min={1}
                                            max={5}
                                            step={1}
                                            className="relative flex items-center select-none touch-none w-full h-5"
                                        >
                                            <Slider.Track className="relative grow h-1.5 rounded-full bg-surface/80">
                                                <Slider.Range className="absolute h-full rounded-full bg-neon" />
                                            </Slider.Track>
                                            <Slider.Thumb className="block w-5 h-5 rounded-full bg-neon shadow-lg shadow-neon/40 hover:scale-110 focus:outline-none transition-transform cursor-pointer" />
                                        </Slider.Root>
                                        <div className="flex justify-between mt-1">
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <span key={n} className="text-[10px] text-muted/40 font-mono">
                                                    {n}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Emotion Chips */}
                                    <div className="flex flex-wrap gap-2">
                                        {emotionChips.map((chip) => {
                                            const isActive = activeChips.includes(chip.label);
                                            return (
                                                <motion.button
                                                    key={chip.label}
                                                    whileTap={{ scale: 0.92 }}
                                                    onClick={() => toggleChip(chip.label)}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${isActive
                                                            ? "bg-neon/20 text-neon neon-glow-sm border border-neon/30"
                                                            : "bg-surface/50 text-muted hover:text-white border border-transparent hover:border-surface"
                                                        }`}
                                                >
                                                    <span>{chip.emoji}</span>
                                                    {chip.label}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Close */}
                                <Dialog.Close asChild>
                                    <button
                                        className="absolute top-4 right-4 text-muted hover:text-white transition-colors text-lg"
                                        aria-label="Close"
                                    >
                                        ✕
                                    </button>
                                </Dialog.Close>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
}
