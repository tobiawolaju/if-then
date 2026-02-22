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
        container: containerRef,
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

    // Parallax Transforms (Reverse on Scroll: Elements move AWAY as you scroll DOWN)
    // BG (Layer 1): Sinks and scales out
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

    // Figure 1 (Diamond Hander): Moves further left and fades out
    const figure1X = useTransform(scrollYProgress, [0, 0.4], ["0%", "-30%"]);
    const figure1Opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    // Figure 2 (Degen Trader): Moves further right and fades out
    const figure2X = useTransform(scrollYProgress, [0, 0.4], ["0%", "30%"]);
    const figure2Opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    // Floating Hands: Drops down quickly and fades
    const handsY = useTransform(scrollYProgress, [0, 0.5], ["0%", "40%"]);
    const handsOpacity = useTransform(scrollYProgress, [0, 0.4], [0.9, 0]);

    // Title Transforms: Fades out and scales down as we leave the hero section
    const titleOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
    const titleScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.5]);
    const titleY = useTransform(scrollYProgress, [0, 0.4], [0, -100]);

    // Content Reveal: Fades in and slides up ONLY after title is mostly gone
    const contentOpacity = useTransform(scrollYProgress, [0.5, 0.9], [0, 1]);
    const contentY = useTransform(scrollYProgress, [0.5, 0.9], [100, 0]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="fixed inset-0 z-[999] bg-black overflow-y-scroll scroll-smooth"
                >
                    {/* The Height of the Landing Page (Increased for a better scroll experience) */}
                    <div className="h-[250vh] w-full relative">
                        {/* Fixed Background Layers */}
                        <div className="sticky top-0 h-screen w-full overflow-hidden">
                            {/* ═══ z-[0]: Layer 1 — Major Background ═══ */}
                            <motion.div
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={imagesLoaded ? { scale: 1, opacity: 0.8 } : {}}
                                style={{ y: bgY, scale: bgScale, filter: "blur(4px)" }}
                                transition={{ duration: 2.5, ease: "easeOut" }}
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
                                transition={{ delay: 0.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute bottom-0 left-0 z-[10] w-[50%] h-[90%]"
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
                                transition={{ delay: 0.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute bottom-0 right-0 z-[10] w-[50%] h-[90%]"
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
                                transition={{ delay: 0.8, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
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
                                animate={imagesLoaded ? { opacity: 0.5 } : {}}
                                transition={{ duration: 2 }}
                                className="absolute inset-0 z-[40] bg-gradient-to-b from-abyss/40 via-black/20 to-black pointer-events-none"
                            />

                            {/* ═══ z-[50]: Central Title Section (Hero) ═══ */}
                            <div className="absolute inset-0 z-[50] flex items-center justify-center p-6 text-center">
                                <motion.div
                                    style={{ opacity: titleOpacity, scale: titleScale, y: titleY }}
                                >
                                    <motion.h1
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={imagesLoaded ? { opacity: 1, scale: 1 } : {}}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 1.2 }}
                                        className="text-6xl md:text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                                    >
                                        Dominus Quant
                                    </motion.h1>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={imagesLoaded ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: 1.8, duration: 1 }}
                                        className="mt-8 flex flex-col items-center gap-2"
                                    >
                                        <p className="text-white tracking-[0.6em] uppercase text-[10px] md:text-xs font-bold opacity-60">
                                            Scroll to Explore
                                        </p>
                                        <motion.div
                                            animate={{ y: [0, 5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-px h-12 bg-gradient-to-b from-white to-transparent"
                                        />
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* ═══ z-[51]: Reveal Section Content (Landing) ═══ */}
                            <div className="absolute inset-0 z-[51] flex flex-col items-center justify-center pointer-events-none p-6">
                                <motion.div
                                    style={{ opacity: contentOpacity, y: contentY }}
                                    className="max-w-2xl text-center pointer-events-auto"
                                >
                                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                                        Turning Random James<br />into Quants
                                    </h2>
                                    <p className="text-white/70 text-base md:text-lg mb-12 leading-relaxed max-w-lg mx-auto">
                                        A high-fidelity on-chain trading intelligence protocol.
                                        Distributed market intelligence powering a shared algorithmic trading pool.
                                    </p>
                                    <button
                                        onClick={handleStartTrading}
                                        className="group relative px-16 py-5 bg-white text-black font-black text-sm tracking-[0.2em] uppercase overflow-hidden transition-all hover:scale-105 active:scale-95 rounded-full"
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            Hybrid Trade
                                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

