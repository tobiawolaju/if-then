import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';

export default function ChatInput({ onSendMessage, isProcessing }) {
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [message]);

    const handleSubmit = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="chat-input-container">
            <textarea
                ref={textareaRef}
                id="chat-input"
                rows="1"
                placeholder={isProcessing ? "Thinking..." : "What's on your mind?"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isProcessing}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
            />
            <button
                className="action-btn"
                onClick={handleSubmit}
                disabled={isProcessing}
            >
                {message.trim().length > 0 ? <Send size={18} /> : <Mic size={18} />}
            </button>
        </div>
    );
}
