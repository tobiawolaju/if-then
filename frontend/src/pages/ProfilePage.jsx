import React from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import './ProfilePage.css';

export default function ProfilePage({ user, onLogout, onBack }) {




    return (
        <div className="app-container">
            <header>
                <div className="header-main">
                    <button
                        className="icon-btn"
                        onClick={onBack}
                        aria-label="Go back"
                        style={{ marginRight: '12px' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1>{user?.displayName || 'Profile'}</h1>
                </div>
                <div id="auth-container">
                    <button
                        className="action-button secondary"
                        onClick={onLogout}
                        style={{ padding: '8px 20px' }}
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </header>

            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '48px 24px',
                textAlign: 'center',
                overflowY: 'auto',
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                <img
                    src={user?.photoURL}
                    alt={user?.displayName || 'User'}
                    style={{
                        width: '96px',
                        height: '96px',
                        borderRadius: '0px',
                        border: '1px solid var(--border-visible)',
                        marginBottom: '24px',
                        boxShadow: 'none'
                    }}
                />
                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.75rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: 'var(--text-primary)'
                }}>
                    {user?.displayName || 'User'}
                </h2>
                <p style={{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.875rem',
                    marginBottom: '48px'
                }}>
                    {user?.email}
                </p>

                <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                    textAlign: 'left',
                    width: '100%',
                    marginTop: '24px'
                }}>
                    Account Settings
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'left', width: '100%' }}>
                    This section is under construction.
                </p>
                {/* Futures section moved to Dashboard popup */}
            </main>
        </div>
    );
}

