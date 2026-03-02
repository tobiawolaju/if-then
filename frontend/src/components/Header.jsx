import React from 'react';
import { LogOut, Settings, ChevronRight } from 'lucide-react';
import './Header.css';

export default function Header({ user, onLogout, onProfileClick }) {
    if (!user) return null;

    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('en-US', dateOptions);

    return (
        <header className="ios-header">
            <div className="header-content">
                {/* Logo / Title */}
                <div className="header-left">
                    <span className="header-logo">IF·THEN</span>
                </div>

                {/* Center - Date */}
                <div className="header-center">
                    <span className="header-date">{currentDate}</span>
                </div>

                {/* Right - User Actions */}
                <div className="header-right">
                    <button
                        className="header-avatar-btn"
                        onClick={onProfileClick}
                        aria-label="View profile"
                    >
                        <img
                            src={user.photoURL}
                            alt={user.displayName || 'User'}
                            className="header-avatar"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
}
