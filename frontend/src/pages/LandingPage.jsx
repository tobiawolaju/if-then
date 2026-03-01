import React, { useEffect, useRef, useState } from 'react';
import './LandingPage.css';

// Neon Nebulas
function NeonOrbs() {
    return (
        <div className="floating-orbs">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
        </div>
    );
}

export default function LandingPage({ onLogin }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const heroRef = useRef(null);

    // Parallax
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
                const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
                setMousePosition({ x, y });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="landing-page">
            <NeonOrbs />

            <div className="landing-scroll-container">
                <section className="landing-section" ref={heroRef}>
                    <div
                        className="hero-content"
                        style={{
                            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
                        }}
                    >
                        <div className="hero-glow-container">
                            <h1 className="brand-title fade-in-up">
                                IF·THEN
                            </h1>
                            <div className="brand-subtitle fade-in-up" style={{ animationDelay: '0.2s' }}>
                                The Next Era of Agentic Productivity
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="fade-in-up cta-wrapper" style={{ animationDelay: '0.5s' }}>
                        <button
                            className="hero-cta"
                            onClick={onLogin}
                        >
                            Get Started
                            <div className="cta-glow" />
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
