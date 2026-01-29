import React from 'react';

export default function LandingPage({ onLogin }) {
    return (
        <div className="landing-page">
            <div className="landing-scroll-container">
                {/* Hero Section */}
                <section className="landing-section">
                    <h1 className="brand-title fade-in-up">crastinat</h1>
                    <p className="brand-tagline fade-in-up" style={{ animationDelay: '0.2s' }}>
                        If it's not on the timeline, it doesn't exist.
                    </p>
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
