import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowLeft } from 'lucide-react';
import './FuturesModal.css';

export default function FuturesModal({ user, onClose, apiBaseUrl }) {
    const [futures, setFutures] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedFuture, setSelectedFuture] = useState(null);

    useEffect(() => {
        if (!user) return;

        async function fetchFutures() {
            try {
                // Use token if available on user object (from Firebase Auth)
                const token = user.accessToken;

                const res = await fetch(`${apiBaseUrl}/api/predict-future`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.uid,
                        accessToken: token,
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                    })
                });

                const data = await res.json();
                if (data.futures) {
                    setFutures(data.futures);
                }
            } catch (err) {
                console.error("Failed to load futures", err);
            } finally {
                setLoading(false);
            }
        }

        fetchFutures();
    }, [user, apiBaseUrl]);

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="futures-modal-overlay" onClick={handleBackgroundClick}>
            <div className="futures-modal-container">
                <div className="futures-modal-header">
                    <h2>
                        <Sparkles size={24} className="text-accent-primary" />
                        <span>Predicted Futures</span>
                    </h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="futures-modal-content">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Analyzing your timeline to generate predictions...</p>
                        </div>
                    ) : selectedFuture ? (
                        <div className="future-detail-view">
                            <button className="back-to-grid-btn" onClick={() => setSelectedFuture(null)}>
                                <ArrowLeft size={16} /> Back to paths
                            </button>
                            <div className="future-detail-header">
                                <h3>{selectedFuture.title}</h3>
                                <span className="horizon">{selectedFuture.timeHorizon}</span>
                            </div>
                            <div className="future-detail-body">
                                {selectedFuture.details}
                            </div>
                        </div>
                    ) : futures && futures.length > 0 ? (
                        <>
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '8px' }}>
                                Three possible paths based on your current timeline.
                            </p>
                            <div className="futures-grid">
                                {futures.map((future, idx) => (
                                    <div
                                        key={idx}
                                        className="future-card"
                                        onClick={() => setSelectedFuture(future)}
                                    >
                                        <div className="future-card-header">
                                            <h4>{future.title}</h4>
                                            <span className="time-horizon">{future.timeHorizon}</span>
                                        </div>
                                        <ul className="future-summary">
                                            {future.summary?.map((point, i) => (
                                                <li key={i}>{point}</li>
                                            ))}
                                        </ul>
                                        <div className="future-card-footer">
                                            <span>Explore path &rarr;</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="loading-container">
                            <p>No predictions available yet. Start using the app to generate data!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
