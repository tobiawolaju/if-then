import React from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import './ProfilePage.css';

export default function ProfilePage({ user, accessToken, onLogout, onBack }) {
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
                overflowY: 'auto'
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
                    marginBottom: '32px'
                }}>
                    {user?.email}
                </p>

                {/* DEBUG SECTION */}
                <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-visible)',
                    borderRadius: '8px',
                    width: '100%',
                    maxWidth: '600px',
                    textAlign: 'left',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem'
                }}>
                    <h3 style={{ marginBottom: '12px', fontSize: '1rem', color: 'var(--text-primary)' }}>Debug Info (Testing Only)</h3>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px' }}>User ID:</label>
                        <code style={{ display: 'block', padding: '8px', backgroundColor: '#000', borderRadius: '4px', wordBreak: 'break-all' }}>{user?.uid}</code>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px' }}>Access Token:</label>
                        <code style={{ display: 'block', padding: '8px', backgroundColor: '#000', borderRadius: '4px', wordBreak: 'break-all', maxHeight: '100px', overflowY: 'auto' }}>{accessToken}</code>
                    </div>

                    <p style={{ marginTop: '16px', color: '#ff4444', fontSize: '0.7rem' }}>⚠️ This info is sensitive. Remove this section after testing.</p>
                </div>
            </main>
        </div>
    );
}
