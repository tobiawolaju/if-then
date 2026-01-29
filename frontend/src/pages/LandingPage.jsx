import React from 'react';

export default function LandingPage({ onLogin }) {
    return (
        <div className="landing-page">
            <div className="landing-scroll-container">
                {/* Hero Section */}
                <section className="landing-section">
                    <div className="hero-badge fade-in-up">AI-Powered Planning</div>

                    <p className="fade-in-up" style={{ animationDelay: '0.2s' }}>
                        A minimalist command center for your day. Powered by AI, designed for clarity.
                    </p>
                    <button
                        className="action-button primary hero-cta fade-in-up"
                        style={{ marginTop: '40px', animationDelay: '0.3s' }}
                        onClick={onLogin}
                    >
                        Get Started
                    </button>

                    <div className="scroll-indicator fade-in-up" style={{ animationDelay: '1s' }}>
                        <span>Scroll</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                        </svg>
                    </div>
                </section>



                {/* Final CTA Section */}
                <section className="landing-section signin-section">
                    <h1>Ready to start?</h1>
                    <button className="action-button primary hero-cta" onClick={onLogin}>
                        Sign in with Google
                    </button>
                </section>
            </div>
        </div>
    );
}
