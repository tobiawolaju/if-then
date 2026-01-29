import React from 'react';
import { LogOut, User } from 'lucide-react';

export default function Header({ user, onLogout }) {
    if (!user) return null;

    return (
        <header>
            <h1>Life Timeline</h1>
            <div id="user-profile">
                <img id="user-photo" src={user.photoURL} alt={user.displayName} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.displayName}</span>
                <button className="icon-btn" onClick={(e) => {
                    e.stopPropagation();
                    onLogout();
                }} title="Sign Out">
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
}
