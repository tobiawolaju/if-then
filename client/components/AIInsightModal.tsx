"use client";

import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { useDeriverseStore } from "@/lib/store";
import { useEffect } from "react";

export default function AIInsightModal() {
    const { aiInsightOpen, setAiInsightOpen } = useDeriverseStore();

    // Prevent scrolling when open
    useEffect(() => {
        if (aiInsightOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.backgroundColor = "#a855f7"; // Neon purple
        } else {
            document.body.style.overflow = "auto";
            document.body.style.backgroundColor = "";
        }
        return () => {
            document.body.style.overflow = "auto";
            document.body.style.backgroundColor = "";
        };
    }, [aiInsightOpen]);

    return (
        <Dialog.Root open={aiInsightOpen} onOpenChange={setAiInsightOpen}>
            <AnimatePresence>
                {aiInsightOpen && (
                    <Dialog.Portal forceMount>
                        <Dialog.Content asChild>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-0 z-[100] bg-neon flex items-center justify-center px-8 text-center"
                            >
                                {/* Close Button */}
                                <Dialog.Close asChild>
                                    <button className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white z-50 backdrop-blur-md">
                                        <span className="text-2xl">✕</span>
                                    </button>
                                </Dialog.Close>

                                {/* Content */}
                                <div className="max-w-3xl flex flex-col items-center">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-8"
                                    >
                                        <div className="flex flex-col items-center gap-4 mb-4">
                                            <img src="/logo.png" alt="Hashquant Logo" className="w-16 h-16 rounded-2xl shadow-2xl" />
                                            <span className="px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold tracking-widest uppercase inline-flex items-center gap-2">
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="w-4 h-4"
                                                >
                                                    <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" />
                                                </svg>
                                                Deep Intelligence
                                            </span>
                                        </div>
                                        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                                            AI INSIGHTS
                                        </h2>
                                    </motion.div>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="space-y-12"
                                    >
                                        <div className="space-y-2">
                                            <p className="text-white/60 text-sm uppercase tracking-widest font-bold">Execution Timing</p>
                                            <p className="text-2xl md:text-4xl font-medium text-white italic">
                                                "You are profitable when holding trades longer than 2 hours."
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-white/60 text-sm uppercase tracking-widest font-bold">Psychology Trap</p>
                                            <p className="text-2xl md:text-4xl font-medium text-white italic">
                                                "You lose 58% of trades you entered within 15 minutes of closing a previous loss."
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-white/60 text-sm uppercase tracking-widest font-bold">Performance Decay</p>
                                            <p className="text-2xl md:text-4xl font-medium text-white italic">
                                                "Your win rate drops after 3 consecutive wins."
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* Footer */}
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="mt-16 text-white/40 text-[10px] tracking-widest uppercase font-bold"
                                    >
                                        Powered by Deriverse Neural Engine
                                    </motion.p>
                                </div>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
}
