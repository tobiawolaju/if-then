import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
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
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const handleImageLoad = useCallback(() => {
        setLoadedCount(prev => {
            const next = prev + 1;
            if (next >= SPLASH_IMAGES.length) {
                setImagesLoaded(true);
            }
            return next;
        });
    }, []);

    const handleStartTrading = () => {
        setIsVisible(false);
    };

    // Parallax Transforms (Reverse on Scroll)
    // As progress goes 0 -> 1:
    // BG (Layer 1): Scales up slightly and moves down
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    // Figure 1 (Diamond Hander): Moves left and fades
    const figure1X = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
    const figure1Opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Figure 2 (Degen Trader): Moves right and fades
    const figure2X = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const figure2Opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Floating Hands: Moves down and fades
    const handsY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const handsOpacity = useTransform(scrollYProgress, [0, 0.5], [0.9, 0]);

    // Title Transforms: Fades and scales down
    const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const titleScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

    // Content Reveal: Fades in as we scroll down
    const contentOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);
    const contentY = useTransform(scrollYProgress, [0.4, 0.7], [50, 0]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="fixed inset-0 z-[999] bg-black overflow-y-auto scrollbar-hide"
                >
                    {/* The Height of the Landing Page (200vh to allow for scroll reveal) */}
                    <div className="h-[200vh] w-full relative">
                        {/* Fixed Background Layers */}
                        <div className="sticky top-0 h-screen w-full overflow-hidden">
                            {/* ═══ z-[0]: Layer 1 — Major Background ═══ */}
                            <motion.div
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={imagesLoaded ? { scale: 1, opacity: 0.8 } : {}}
                                style={{ y: bgY, scale: bgScale, filter: "blur(4px)" }}
                                transition={{ duration: 6.5, ease: "easeOut" }}
                                className="absolute inset-0 z-[0] transform-gpu"
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
                                style={{ x: figure1X, opacity: figure1Opacity }}
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
                                style={{ x: figure2X, opacity: figure2Opacity }}
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
                                style={{ y: handsY, opacity: handsOpacity }}
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

                            {/* ═══ z-[40]: Gradient Overlay ═══ */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={imagesLoaded ? { opacity: 0.4 } : {}}
                                transition={{ duration: 2 }}
                                className="absolute inset-0 z-[40] bg-gradient-to-b from-neon via-abyss/80 to-black pointer-events-none"
                            />

                            {/* ═══ z-[50]: Central Title Section (100vh) ═══ */}
                            <div className="absolute inset-0 z-[50] flex items-center justify-center">
                                <motion.div
                                    style={{ opacity: titleOpacity, scale: titleScale }}
                                    className="text-center"
                                >
                                    <motion.h1
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={imagesLoaded ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 1.5 }}
                                        className="text-7xl md:text-9xl font-black text-white tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                                    >
                                        Dominus Quant
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={imagesLoaded ? { opacity: 0.6 } : {}}
                                        transition={{ delay: 2, duration: 1 }}
                                        className="text-white tracking-[0.5em] uppercase text-sm mt-4"
                                    >
                                        Scroll to Explore
                                    </motion.p>
                                </motion.div>
                            </div>

                            {/* ═══ z-[51]: Reveal Section Content ═══ */}
                            <div className="absolute inset-0 z-[51] flex flex-col items-center justify-center pointer-events-none">
                                <motion.div
                                    style={{ opacity: contentOpacity, y: contentY }}
                                    className="max-w-xl text-center px-6 pointer-events-auto"
                                >
                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Turning Random James into Quants</h2>
                                    <p className="text-white/60 text-lg mb-10 leading-relaxed">
                                        A high-fidelity on-chain trading intelligence protocol.
                                        Distributed market intelligence powering a shared algorithmic trading pool.
                                    </p>
                                    <button
                                        onClick={handleStartTrading}
                                        className="group relative px-12 py-5 bg-white text-black font-black text-sm tracking-widest uppercase overflow-hidden transition-all hover:scale-105 active:scale-95 rounded-full"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Hybrid Trade
                                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                        <div className="absolute inset-0 bg-neon opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </motion.div>
                            </div>

                            {/* ═══ z-[99]: Aesthetic Grain Overlay ═══ */}
                            <div className="absolute inset-0 z-[99] opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

{/* ═══ z-[99]: Aesthetic Grain Overlay ═══ */ }
<div className="absolute inset-0 z-[99] opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </motion.div >
            )}
        </AnimatePresence >
    );
}
