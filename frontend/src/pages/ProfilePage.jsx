import React from 'react';
import { ArrowLeft, LogOut, Settings, User, Bell, Shield, HelpCircle } from 'lucide-react';
import './ProfilePage.css';

export default function ProfilePage({ user, onLogout, onBack }) {
    return (
        <div className="ios-profile-page">
            {/* Header */}
            <header className="ios-profile-header">
                <button
                    className="profile-back-btn"
                    onClick={onBack}
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="profile-title">Profile</h1>
                <div style={{ width: 40 }} /> {/* Spacer for alignment */}
            </header>

            {/* Profile Card */}
            <div className="profile-card">
                <div className="profile-avatar-container">
                    <img
                        src={user?.photoURL}
                        alt={user?.displayName || 'User'}
                        className="profile-avatar"
                    />
                </div>
                <div className="profile-info">
                    <h2 className="profile-name">{user?.displayName || 'User'}</h2>
                    <p className="profile-email">{user?.email}</p>
                </div>
            </div>

            {/* Settings List - iOS Style */}
            <div className="settings-group">
                <div className="settings-list">
                    <button className="settings-item">
                        <div className="settings-item-left">
                            <div className="settings-icon" style={{ backgroundColor: '#007AFF' }}>
                                <User size={18} color="white" />
                            </div>
                            <span>Personal Information</span>
                        </div>
                        <div className="settings-item-right">
                            <ChevronRight size={18} />
                        </div>
                    </button>

                    <button className="settings-item">
                        <div className="settings-item-left">
                            <div className="settings-icon" style={{ backgroundColor: '#FF9500' }}>
                                <Bell size={18} color="white" />
                            </div>
                            <span>Notifications</span>
                        </div>
                        <div className="settings-item-right">
                            <ChevronRight size={18} />
                        </div>
                    </button>

                    <button className="settings-item">
                        <div className="settings-item-left">
                            <div className="settings-icon" style={{ backgroundColor: '#34C759' }}>
                                <Shield size={18} color="white" />
                            </div>
                            <span>Privacy & Security</span>
                        </div>
                        <div className="settings-item-right">
                            <ChevronRight size={18} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Help Section */}
            <div className="settings-group">
                <div className="settings-list">
                    <button className="settings-item">
                        <div className="settings-item-left">
                            <div className="settings-icon" style={{ backgroundColor: '#8E8E93' }}>
                                <HelpCircle size={18} color="white" />
                            </div>
                            <span>Help & Support</span>
                        </div>
                        <div className="settings-item-right">
                            <ChevronRight size={18} />
                        </div>
                    </button>

                    <button className="settings-item">
                        <div className="settings-item-left">
                            <div className="settings-icon" style={{ backgroundColor: '#8E8E93' }}>
                                <Settings size={18} color="white" />
                            </div>
                            <span>App Settings</span>
                        </div>
                        <div className="settings-item-right">
                            <ChevronRight size={18} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Sign Out */}
            <div className="settings-group">
                <div className="settings-list">
                    <button
                        className="settings-item sign-out"
                        onClick={onLogout}
                    >
                        <div className="settings-item-left">
                            <span className="sign-out-text">Sign Out</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* App Info */}
            <div className="profile-footer">
                <p>IF·THEN v1.0.0</p>
                <p className="profile-copyright">Made with ❤️ for productivity</p>
            </div>
        </div>
    );
}
