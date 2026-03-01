import React from 'react';
import { Home, Search, MessageSquare, User } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav({ activeView, onViewChange, onOpenChat, user }) {
    return (
        <nav className="bottom-nav">
            <button
                className={`nav-item ${activeView === 'timeline' ? 'active' : ''}`}
                onClick={() => onViewChange('timeline')}
            >
                <div className="nav-icon-wrapper">
                    <Home size={24} />
                </div>
                <span>Photos</span>
            </button>
            <button
                className="nav-item"
                onClick={() => { }} // Search placeholder
            >
                <div className="nav-icon-wrapper">
                    <Search size={24} />
                </div>
                <span>Search</span>
            </button>
            <button
                className={`nav-item ${activeView === 'chat' ? 'active' : ''}`}
                onClick={onOpenChat}
            >
                <div className="nav-icon-wrapper">
                    <MessageSquare size={24} />
                </div>
                <span>Sharing</span>
            </button>
            <button
                className={`nav-item ${activeView === 'profile' ? 'active' : ''}`}
                onClick={() => onViewChange('profile')}
            >
                <div className="nav-icon-wrapper">
                    <User size={24} />
                </div>
                <span>Library</span>
            </button>
        </nav>
    );
}
