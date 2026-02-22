"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(false), 4500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="fixed inset-0 z-[999] bg-black flex items-center justify-center overflow-hidden"
                >
                    {/* ═══ z-[0]: Layer 1 — Major Background (Slow zoom 1→1.1) ═══ */}
                    <motion.div
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{ scale: 1.1, opacity: 1 }}
                        transition={{ duration: 4.5, ease: "easeOut" }}
                        className="absolute inset-0 z-[0]"
                    >
                        <Image
                            src="/splash/Layer_1_TheMajorBackground_FurthestBack.png"
                            alt="Background"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>

                    {/* ═══ z-[10]: Layer 3 — Diamond Hander (Slides in from left) ═══ */}
                    <motion.div
                        initial={{ x: "-60%", opacity: 0 }}
                        animate={{ x: "0%", opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-0 left-0 z-[10] w-[45%] h-[85%]"
                    >
                        <Image
                            src="/splash/Layer_3_Figure_1_The_Diamond_Hander_Center_Left.png"
                            alt="Diamond Hander"
                            fill
                            className="object-contain object-bottom"
                        />
                    </motion.div>

                    {/* ═══ z-[10]: Layer 4 — Degen Trader (Slides in from right) ═══ */}
                    <motion.div
                        initial={{ x: "60%", opacity: 0 }}
                        animate={{ x: "0%", opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-0 right-0 z-[10] w-[45%] h-[85%]"
                    >
                        <Image
                            src="/splash/Layer_4_Figure_2_The_Degen_Trader_Center_Right.png"
                            alt="Degen Trader"
                            fill
                            className="object-contain object-bottom"
                        />
                    </motion.div>

                    {/* ═══ z-[20]: Center Text — #Quant branding (Un-blur) ═══ */}
                    <div className="relative z-[20]">
                        <motion.h1
                            initial={{ filter: "blur(20px)", opacity: 0, scale: 0.9 }}
                            animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
                            transition={{ duration: 2, ease: "easeOut", delay: 1.0 }}
                            className="text-6xl md:text-8xl font-black text-white tracking-[-0.05em] drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                        >
                            <span className="text-white opacity-80">#</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-neon to-neon-dim">Quant</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.5, duration: 1 }}
                            className="text-center mt-4"
                        >
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.6em]">Modular Liquidity Protocol</span>
                        </motion.div>
                    </div>

                    {/* ═══ z-[30]: Layer 5 — Floating Hands (Rises from bottom) ═══ */}
                    <motion.div
                        initial={{ y: "40%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-0 left-0 right-0 z-[30] h-[50%]"
                    >
                        <Image
                            src="/splash/Layer_5_Floating_Hands_Foreground_Overlays.png"
                            alt="Floating Hands"
                            fill
                            className="object-contain object-bottom"
                        />
                    </motion.div>

                    {/* ═══ z-[40]: MEME LAYER — Bouncy spring pop-ins ═══ */}

                    {/* McDonald's Hat → over Figure 1's head (top-left area) */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.5, type: "spring", damping: 10, stiffness: 200 }}
                        className="absolute top-[5%] left-[8%] z-[40] w-[20%] h-[20%] drop-shadow-[0_0_4px_rgba(255,255,255,1)]"
                    >
                        <Image
                            src="/splash/Meme_Cutout_2_The_McDonald_Hat_To_place_on_Figure_1_head.png"
                            alt="McDonald's Hat"
                            fill
                            className="object-contain"
                        />
                    </motion.div>

                    {/* Diamond → over Figure 1's hands */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.7, type: "spring", damping: 10, stiffness: 200 }}
                        className="absolute bottom-[25%] left-[10%] z-[40] w-[15%] h-[15%] drop-shadow-[0_0_4px_rgba(255,255,255,1)]"
                    >
                        <Image
                            src="/splash/Meme_Cutout_1_The_Diamond_To_place_over_Figure_1_hands.png"
                            alt="Diamond Hands"
                            fill
                            className="object-contain"
                        />
                    </motion.div>

                    {/* Stonks Arrow → over Figure 2's hand (right side) */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.6, type: "spring", damping: 10, stiffness: 200 }}
                        className="absolute top-[25%] right-[5%] z-[40] w-[18%] h-[25%] drop-shadow-[0_0_4px_rgba(255,255,255,1)]"
                    >
                        <Image
                            src="/splash/MemeCutout3TheStonksArrowToplaceinFigure2pointinghand.png"
                            alt="Stonks Arrow"
                            fill
                            className="object-contain"
                        />
                    </motion.div>

                    {/* Laser Eyes → over Figure 2's eyes (mix-blend-screen) */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.8, type: "spring", damping: 10, stiffness: 200 }}
                        className="absolute top-[12%] right-[15%] z-[40] w-[16%] h-[12%] mix-blend-screen drop-shadow-[0_0_4px_rgba(255,255,255,1)]"
                    >
                        <Image
                            src="/splash/MemeCutout5LaserEyesToputonFigure2.png"
                            alt="Laser Eyes"
                            fill
                            className="object-contain"
                        />
                    </motion.div>

                    {/* Doge Pepe → peeks out from behind the columns */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.9, type: "spring", damping: 10, stiffness: 200 }}
                        className="absolute bottom-[15%] right-[35%] z-[40] w-[14%] h-[18%] drop-shadow-[0_0_4px_rgba(255,255,255,1)]"
                    >
                        <Image
                            src="/splash/MemeCutout4TheDogePepeMascotTopeekoutfrombehindthecolumns.png"
                            alt="Doge Pepe"
                            fill
                            className="object-contain"
                        />
                    </motion.div>

                    {/* ═══ z-[50]: Layer 2 — Outer Frame (Fades in, scales down slightly) ═══ */}
                    <motion.div
                        initial={{ scale: 1.05, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 z-[50]"
                    >
                        <Image
                            src="/splash/Layer_2_The_Outer_Piece_Frame_Foreground_Borders.png"
                            alt="Frame"
                            fill
                            className="object-cover"
                        />
                    </motion.div>

                    {/* ═══ z-[99]: Aesthetic Grain Overlay ═══ */}
                    <div className="absolute inset-0 z-[99] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
