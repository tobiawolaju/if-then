import React from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import { useAuth } from './hooks/useAuth';
import './index.css';

function App() {
  const { user, login, logout, accessToken, loading: authLoading } = useAuth();

  if (authLoading) return <div className="loading">Initializing...</div>;

  return (
    <>
      {!user ? (
        <LandingPage onLogin={login} />
      ) : (
        <Dashboard user={user} onLogout={logout} accessToken={accessToken} />
      )}
    </>
  );
}

export default App;
