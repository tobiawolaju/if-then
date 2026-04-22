import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import './ChatInput.css';

export default function ChatInput({ onSendMessage, isProcessing, isBlocked = false, user, onProfileClick }) {
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
        }
    }, [message]);

    const handleSubmit = () => {
        if (message.trim() && !isProcessing) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className={`chat-input-container liquid-glass ${isBlocked ? 'chat-input-container--blocked' : ''}`}>
            <textarea
                ref={textareaRef}
                id="chat-input"
                rows="1"
                placeholder={isProcessing ? "Planning your time..." : "Schedule something..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isProcessing || isBlocked}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
            />
            <button
                className="action-btn"
                onClick={() => {
                    if (message.trim()) {
                        handleSubmit();
                    }
                }}
                disabled={isProcessing || isBlocked}
                aria-label={message.trim() ? "Send message" : "Open profile"}
                title={!message.trim() ? "Open profile" : "Send"}
            >
                {isProcessing ? (
                    <Sparkles size={18} className="animate-pulse" />
                ) : message.trim() ? (
                    <Send size={18} />
                ) : (
                    <div id="auth-container">
                        <div id="user-profile" onClick={onProfileClick}>
                            <img
                                id="user-photo"
                                src={user?.photoURL}
                                alt={user?.displayName || 'User'}
                            />
                        </div>
                    </div>
                )}
            </button>
        </div>
    );
}
