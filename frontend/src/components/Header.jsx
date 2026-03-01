import React from 'react';
import { LogOut, ChevronRight } from 'lucide-react';
import './Header.css';

export default function Header({ user, onLogout, onProfileClick }) {
    if (!user) return null;

    const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('en-US', dateOptions);

    return (
        <header className="floating-header">
            <div className="header-search-bar">
                <div className="search-logo">
                    <span className="logo-text">IF·THEN</span>
                </div>
                <div className="search-content">
                    <span id="current-date" className="hidden-mobile">
                        {currentDate}
                    </span>
                </div>
                <div id="auth-container">
                    <div id="user-profile" onClick={onProfileClick}>
                        <img
                            id="user-photo"
                            src={user.photoURL}
                            alt={user.displayName || 'User'}
                        />
                    </div>
                    <button
                        className="icon-btn logout-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onLogout();
                        }}
                        title="Sign Out"
                        aria-label="Sign out"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}
