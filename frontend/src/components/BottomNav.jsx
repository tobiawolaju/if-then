import React from 'react';
import { Home, Search, MessageSquare, User } from 'lucide-react';
import './BottomNav.css';

const BottomNav = React.memo(({ activeView, onViewChange, onOpenChat, user }) => {
    return (
        <nav className="ios-tab-bar">
            <button
                className={`tab-item ${activeView === 'timeline' ? 'active' : ''}`}
                onClick={() => onViewChange('timeline')}
            >
                <div className="tab-icon">
                    <Home size={24} strokeWidth={activeView === 'timeline' ? 2.5 : 2} />
                </div>
                <span>Timeline</span>
            </button>

            <button
                className="tab-item"
                onClick={() => { }} // Search placeholder
            >
                <div className="tab-icon">
                    <Search size={24} strokeWidth={2} />
                </div>
                <span>Search</span>
            </button>

            <button
                className={`tab-item ${activeView === 'chat' ? 'active' : ''}`}
                onClick={onOpenChat}
            >
                <div className="tab-icon">
                    <MessageSquare size={24} strokeWidth={activeView === 'chat' ? 2.5 : 2} />
                </div>
                <span>Chat</span>
            </button>

            <button
                className={`tab-item ${activeView === 'profile' ? 'active' : ''}`}
                onClick={() => onViewChange('profile')}
            >
                <div className="tab-icon">
                    <User size={24} strokeWidth={activeView === 'profile' ? 2.5 : 2} />
                </div>
                <span>Profile</span>
            </button>
        </nav>
    );
});

export default BottomNav;
