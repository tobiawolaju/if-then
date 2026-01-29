import React, { useState } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import ChatInput from './components/ChatInput';
import DetailsSheet from './components/DetailsSheet';
import { useAuth } from './hooks/useAuth';
import { useSchedule } from './hooks/useSchedule';
import { database } from './firebase-config';
import { ref, update, remove } from 'firebase/database';
import './index.css';

function App() {
  const { user, login, logout, loading: authLoading } = useAuth();
  const { activities, loading: scheduleLoading } = useSchedule(user?.uid);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = async (message) => {
    setIsProcessing(true);
    try {
      // Simplified AI communication logic for React version
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, userId: user.uid })
      });
      const result = await response.json();
      console.log("AI Response:", result);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveActivity = async (updatedActivity) => {
    if (!user) return;
    const activityRef = ref(database, `users/${user.uid}/schedule/${updatedActivity.id}`);
    await update(activityRef, updatedActivity);
    setSelectedActivity(null);
  };

  const handleDeleteActivity = async (activityId) => {
    if (!user || !window.confirm("Are you sure?")) return;
    const activityRef = ref(database, `users/${user.uid}/schedule/${activityId}`);
    await remove(activityRef);
    setSelectedActivity(null);
  };

  if (authLoading) return <div className="loading">Loading...</div>;

  if (!user) {
    return (
      <div className="landing-page">
        <div className="landing-scroll-container">
          <section className="landing-section">
            <div className="hero-badge">AI-Powered Planning</div>
            <h1>Your Life,<br />On a Timeline.</h1>
            <p>A minimalist command center for your day. Powered by AI, designed for clarity.</p>
            <button className="action-button primary hero-cta" style={{ marginTop: '40px' }} onClick={login}>
              Get Started
            </button>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header user={user} onLogout={logout} />
      <main className="main-content">
        <Timeline
          activities={activities}
          onSelectActivity={setSelectedActivity}
        />
        <DetailsSheet
          activity={selectedActivity}
          isOpen={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onSave={handleSaveActivity}
          onDelete={handleDeleteActivity}
        />
      </main>
      <ChatInput onSendMessage={handleSendMessage} isProcessing={isProcessing} />
    </div>
  );
}

export default App;
