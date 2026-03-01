import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, MapPin, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import './DetailsSheet.css';

export default function DetailsSheet({ activity, isOpen, onClose, onSave, onDelete }) {
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef(0);
    const panelRef = useRef(null);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        const panel = panelRef.current;
        if (!panel) return;
        const rect = panel.getBoundingClientRect();
        if (touch.clientY - rect.top <= 80) {
            setIsDragging(true);
            dragStartY.current = touch.clientY;
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const deltaY = e.touches[0].clientY - dragStartY.current;
        if (deltaY > 0) setDragY(deltaY);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        if (dragY > 150) onClose();
        setDragY(0);
    };

    if (!activity) return null;

    return (
        <>
            <div
                className={`details-panel-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                ref={panelRef}
                className={`details-panel ${isOpen ? 'open' : ''}`}
                style={{
                    transform: isDragging ? `translateY(${dragY}px)` : undefined,
                    transition: isDragging ? 'none' : undefined
                }}
                role="dialog"
                aria-modal="true"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="drag-handle">
                    <div className="handle-bar" />
                </div>

                <div className="detail-container">
                    <header className="detail-header">
                        <div className="category-tag" style={{ background: activity.color || 'var(--accent-primary)' }}>
                            {activity.tags?.[0] || 'Activity'}
                        </div>
                        <h2>{activity.title}</h2>
                        <div className="time-info">
                            <Clock size={16} />
                            <span>{activity.startTime} — {activity.endTime}</span>
                        </div>
                    </header>

                    <div className="simulation-impact">
                        <div className="impact-card baseline">
                            <div className="impact-icon"><Zap size={20} /></div>
                            <div className="impact-content">
                                <h3>Direct Consequence</h3>
                                <p>{activity.description || "Maintaining this habit builds consistency in your daily structure."}</p>
                            </div>
                        </div>

                        <div className="impact-stats">
                            <div className="stat-item">
                                <TrendingUp size={16} className="text-success" />
                                <span>+2.4% Momentum</span>
                            </div>
                            <div className="stat-item">
                                <AlertTriangle size={16} className="text-warning" />
                                <span>-15m Free Time</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-actions-minimal">
                        <button className="delete-minimal" onClick={() => onDelete(activity.id)}>
                            Remove from Timeline
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
