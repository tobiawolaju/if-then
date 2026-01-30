import React, { useEffect, useRef, useState } from 'react';

// Floating orbs component for atmospheric effect
function FloatingOrbs() {
    return (
        <div className="floating-orbs" aria-hidden="true">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
        </div>
    );
}

// Animated clock display
function LiveClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');

    return (
        <div className="live-clock fade-in-up" style={{ animationDelay: '0.4s' }}>
            <span className="clock-segment">{hours}</span>
            <span className="clock-separator">:</span>
            <span className="clock-segment">{minutes}</span>
            <span className="clock-separator blink">:</span>
            <span className="clock-segment clock-seconds">{seconds}</span>
        </div>
    );
}

// Scroll indicator
function ScrollIndicator() {
    return (
        <div className="scroll-indicator fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="scroll-mouse">
                <div className="scroll-wheel" />
            </div>
            <span>Scroll</span>
        </div>
    );
}

export default function LandingPage({ onLogin }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const heroRef = useRef(null);

    // Track mouse for subtle parallax
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
            <FloatingOrbs />

            <div className="landing-scroll-container">
                {/* Hero Section */}
                <section className="landing-section" ref={heroRef}>
                    <div
                        className="hero-content"
                        style={{
                            transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`
                        }}
                    >
                        <div className="hero-badge fade-in-up">
                            <span className="badge-dot" />
                            Personal Time Editor
                        </div>

                        <h1 className="brand-title fade-in-up" style={{ animationDelay: '0.1s' }}>
                            crastinat
                        </h1>

                        <p className="brand-tagline fade-in-up" style={{ animationDelay: '0.2s' }}>
                            If it's not on the timeline, it doesn't exist.
                        </p>

                        <LiveClock />
                    </div>

                    <ScrollIndicator />
                </section>

                {/* Philosophy Section */}
                <section className="landing-section philosophy-section">
                    <div className="philosophy-grid">
                        <div className="philosophy-card fade-in-up">
                            <div className="card-number">01</div>
                            <h3>Visualize</h3>
                            <p>See your entire day as an editable timeline. Time becomes tangible.</p>
                        </div>
                        <div className="philosophy-card fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="card-number">02</div>
                            <h3>Command</h3>
                            <p>Speak naturally. "Swimming at 5pm for 2 hours" — done.</p>
                        </div>
                        <div className="philosophy-card fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="card-number">03</div>
                            <h3>Execute</h3>
                            <p>Turn intentions into commitments. What's scheduled, happens.</p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="landing-section signin-section">
                    <div className="cta-content">
                        <h2 className="fade-in-up">Ready to own your time?</h2>
                        <p className="fade-in-up" style={{ animationDelay: '0.1s' }}>
                            Stop planning. Start living.
                        </p>
                        <button
                            className="hero-cta fade-in-up"
                            style={{ animationDelay: '0.2s' }}
                            onClick={onLogin}
                        >
                            <span className="cta-text">Sign in with Google</span>
                            <span className="cta-arrow">→</span>
                        </button>

                        <div className="trust-badges fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <span>🔒 Secure</span>
                            <span>📅 Syncs with Calendar</span>
                            <span>🤖 AI-Powered</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
