import React, { useState, useEffect } from 'react';
import './LandingPage.css';

export default function LandingPage({ onLogin }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Staggered entrance animation
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="landing-page">
            <div className="landing-content">
                {/* App Icon / Logo */}
                <div className={`landing-logo ${isLoaded ? 'animate-in' : ''}`}>
                    <div className="logo-mark">
                        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="80" height="80" rx="18" fill="black" />
                            <path d="M24 40C24 31.1634 31.1634 24 40 24V24C48.8366 24 56 31.1634 56 40V56H40C31.1634 56 24 48.8366 24 40V40Z" fill="white" />
                            <circle cx="40" cy="40" r="6" fill="black" />
                        </svg>
                    </div>
                </div>

                {/* Brand Name */}
                <div className={`landing-title ${isLoaded ? 'animate-in delay-1' : ''}`}>
                    <h1>IF·THEN</h1>
                </div>

                {/* Tagline */}
                <div className={`landing-tagline ${isLoaded ? 'animate-in delay-2' : ''}`}>
                    <p>Your AI-powered productivity companion</p>
                </div>

                {/* CTA Button - iOS Style */}
                <div className={`landing-cta ${isLoaded ? 'animate-in delay-3' : ''}`}>
                    <button
                        className="cta-button"
                        onClick={onLogin}
                    >
                        <span>Get Started</span>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Feature Pills */}
                <div className={`landing-features ${isLoaded ? 'animate-in delay-4' : ''}`}>
                    <div className="feature-pill">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>Smart Scheduling</span>
                    </div>
                    <div className="feature-pill">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span>AI Chat</span>
                    </div>
                    <div className="feature-pill">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <span>Goal Tracking</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className={`landing-footer ${isLoaded ? 'animate-in delay-5' : ''}`}>
                <p>By continuing, you agree to our Terms of Service</p>
            </div>
        </div>
    );
}
