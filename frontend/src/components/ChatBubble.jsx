import React from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import './ChatBubble.css';

export default function ChatBubble({ message, isUser, isTyping, isProposal, activities, onConfirm, onReject }) {
    if (isTyping) {
        return (
            <div className="chat-bubble assistant typing">
                <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        );
    }

    return (
        <div className={`chat-bubble ${isUser ? 'user' : 'assistant'} ${isProposal ? 'proposal' : ''}`}>
            <div className="bubble-content">
                {message}
            </div>

            {isProposal && activities && activities.length > 0 && (
                <div className="proposal-activities">
                    <div className="activities-list">
                        {activities.map((activity, i) => (
                            <div key={i} className="activity-preview">
                                <span className="activity-title">{activity.title}</span>
                                <span className="activity-time">
                                    {activity.startTime} - {activity.endTime}
                                </span>
                                {activity.days && (
                                    <span className="activity-days">
                                        {activity.days.slice(0, 3).join(', ')}{activity.days.length > 3 ? '...' : ''}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="proposal-actions">
                        <button className="confirm-btn" onClick={onConfirm}>
                            <Check size={16} />
                            Add to Schedule
                        </button>
                        <button className="reject-btn" onClick={onReject}>
                            <X size={16} />
                            Not yet
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
