"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

const SPLASH_IMAGES = [
    "/splash/Layer_1_TheMajorBackground_FurthestBack.png",
    "/splash/Layer_2_The_Outer_Piece_Frame_Foreground_Borders.png",
    "/splash/Layer_3_Figure_1_The_Diamond_Hander_Center_Left.png",
    "/splash/Layer_4_Figure_2_The_Degen_Trader_Center_Right.png",
    "/splash/Layer_5_Floating_Hands_Foreground_Overlays.png",
];

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadedCount, setLoadedCount] = useState(0);

    const handleImageLoad = useCallback(() => {
        setLoadedCount(prev => {
            const next = prev + 1;
            if (next >= SPLASH_IMAGES.length) {
                setImagesLoaded(true);
            }
            return next;
        });
    }, []);

    // Start the dismiss timer only after all images are loaded
    useEffect(() => {
        if (!imagesLoaded) return;
        // Extend animation by 1s (to 5.5s) + wait 2 more seconds = 7.5s total
        const timer = setTimeout(() => setIsVisible(false), 7500);
        return () => clearTimeout(timer);
    }, [imagesLoaded]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="fixed inset-0 z-[999] bg-black flex items-center justify-center overflow-hidden"
                >
                    {/* ═══ z-[0]: Layer 1 — Major Background (Blurred for Perspective) ═══ */}
                    <motion.div
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={imagesLoaded ? { scale: 1, opacity: 0.8 } : {}}
                        transition={{ duration: 6.5, ease: "easeOut" }}
                        className="absolute inset-0 z-[0] transform-gpu"
                        style={{ filter: "blur(4px)" }}
                    >
                        <Image
                            src="/splash/Layer_1_TheMajorBackground_FurthestBack.png"
                            alt="Background"
                            fill
                            className="object-cover brightness-50"
                            priority
                            onLoad={handleImageLoad}
                        />
                    </motion.div>

                    {/* ═══ z-[5]: Layer 2 — Outer Frame ═══ */}
                    <motion.div
                        initial={{ scale: 1.05, opacity: 0 }}
                        animate={imagesLoaded ? { scale: 1, opacity: 0.6 } : {}}
                        transition={{ delay: 0.3, duration: 2, ease: "easeOut" }}
                        className="absolute inset-0 z-[5]"
                    >
                        <Image
                            src="/splash/Layer_2_The_Outer_Piece_Frame_Foreground_Borders.png"
                            alt="Frame"
                            fill
                            className="object-cover"
                            onLoad={handleImageLoad}
                        />
                    </motion.div>

                    {/* ═══ z-[10]: Layer 3 — Diamond Hander ═══ */}
                    <motion.div
                        initial={{ x: "-40%", opacity: 0 }}
                        animate={imagesLoaded ? { x: "0%", opacity: 1 } : {}}
                        transition={{ delay: 0.8, duration: 2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-0 left-[-10%] z-[10] w-[50%] h-[90%]"
                    >
                        <Image
                            src="/splash/Layer_3_Figure_1_The_Diamond_Hander_Center_Left.png"
                            alt="Diamond Hander"
                            fill
                            className="object-contain object-bottom"
                            onLoad={handleImageLoad}
                        />
                    </motion.div>

                    {/* ═══ z-[10]: Layer 4 — Degen Trader ═══ */}
                    <motion.div
                        initial={{ x: "40%", opacity: 0 }}
                        animate={imagesLoaded ? { x: "0%", opacity: 1 } : {}}
                        transition={{ delay: 0.8, duration: 2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-0 right-[-10%] z-[10] w-[50%] h-[90%]"
                    >
                        <Image
                            src="/splash/Layer_4_Figure_2_The_Degen_Trader_Center_Right.png"
                            alt="Degen Trader"
                            fill
                            className="object-contain object-bottom"
                            onLoad={handleImageLoad}
                        />
                    </motion.div>

                    {/* ═══ z-[30]: Layer 5 — Floating Hands ═══ */}
                    <motion.div
                        initial={{ y: "20%", opacity: 0 }}
                        animate={imagesLoaded ? { y: "0%", opacity: 0.9 } : {}}
                        transition={{ delay: 1.2, duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-0 left-0 right-0 z-[30] h-[60%]"
                    >
                        <Image
                            src="/splash/Layer_5_Floating_Hands_Foreground_Overlays.png"
                            alt="Floating Hands"
                            fill
                            className="object-contain object-bottom contrast-125"
                            onLoad={handleImageLoad}
                        />
                    </motion.div>

                    {/* ═══ z-[40]: Gradient Overlay (Purple Top -> Black Bottom) ═══ */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={imagesLoaded ? { opacity: 0.4 } : {}}
                        transition={{ duration: 2 }}
                        className="absolute inset-0 z-[40] bg-gradient-to-b from-neon via-abyss/80 to-black pointer-events-none"
                    />

                    {/* ═══ z-[50]: Center Text — All White Fade-in (Highest Z) ═══ */}
                    <div className="relative z-[50] flex flex-col items-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={imagesLoaded ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 1.5 }}
                            className="text-4xl md:text-6xl font-black text-white tracking-[-0.05em] drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            <span>DQ </span>Labs
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={imagesLoaded ? { opacity: 0.8 } : {}}
                            transition={{ delay: 2.5, duration: 1.5 }}
                            className="text-center mt-6"
                        >
                        </motion.div>
                    </div>

                    {/* ═══ z-[99]: Aesthetic Grain Overlay ═══ */}
                    <div className="absolute inset-0 z-[99] opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
