import React from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import { useAuth } from './hooks/useAuth';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("App Crash:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="crash-screen">
          <h1>Something went wrong.</h1>
          <button onClick={() => window.location.reload()}>Refresh App</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const { user, login, logout, accessToken, loading: authLoading, getFreshAccessToken } = useAuth();
  const [view, setView] = React.useState('timeline'); // 'timeline' or 'profile'
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (authLoading) return <div className="loading">Initializing...</div>;

  return (
    <ErrorBoundary>
      <div id="splash-screen" className={!showSplash ? 'fade-out' : ''}>
        <div className="splash-logo"></div>
      </div>

      {!user ? (
        <LandingPage onLogin={login} />
      ) : view === 'timeline' ? (
        <Dashboard
          user={user}
          onLogout={logout}
          accessToken={accessToken}
          getFreshAccessToken={getFreshAccessToken}
          onNavigateToProfile={() => setView('profile')}
        />
      ) : (
        <ProfilePage
          user={user}
          onLogout={logout}
          onBack={() => setView('timeline')}
        />
      )}
    </ErrorBoundary>
  );
}

export default App;
