import React from 'react';

export default function LandingPage({ onLogin }) {
    return (
        <div className="landing-page">
            <div className="landing-scroll-container">
                <section className="landing-section">
                    <div className="hero-badge">AI-Powered Planning</div>
                    <h1>Your Life,<br />On a Timeline.</h1>
                    <p>A minimalist command center for your day. Powered by AI, designed for clarity.</p>
                    <button className="action-button primary hero-cta" style={{ marginTop: '40px' }} onClick={onLogin}>
                        Get Started
                    </button>
                </section>
            </div>
        </div>
    );
}
