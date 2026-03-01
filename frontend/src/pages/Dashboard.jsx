import React, { useState } from 'react';
import Header from '../components/Header';
import Timeline from '../components/Timeline';
import ChatInput from '../components/ChatInput';
import ChatOverlay from '../components/ChatOverlay';
import DetailsSheet from '../components/DetailsSheet';
import FuturesNotification from '../components/FuturesNotification';
import FuturesModal from '../components/FuturesModal';
import { useSchedule } from '../hooks/useSchedule';
import { useConversation } from '../hooks/useConversation';
import './Dashboard.css';

import BottomNav from '../components/BottomNav';

export default function Dashboard({ user, onLogout, accessToken, getFreshAccessToken, onNavigateToProfile }) {
    const { activities, loading: scheduleLoading } = useSchedule(user?.uid);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showFuturesModal, setShowFuturesModal] = useState(false);
    const [activeView, setActiveView] = useState('timeline');

    // Conversation state
    const conversation = useConversation(user, getFreshAccessToken);

    // ... (rest of logic)

    const handleViewChange = (view) => {
        if (view === 'profile') {
            onNavigateToProfile();
        } else {
            setActiveView(view);
        }
    };

    if (scheduleLoading) return <div className="loading">Loading Schedule...</div>;

    return (
        <div className="app-container">
            <Header user={user} onLogout={onLogout} onProfileClick={onNavigateToProfile} />
            <main className={`main-content ${selectedActivity ? 'has-selection' : ''}`}>
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

            <ChatOverlay
                isOpen={conversation.isOpen}
                messages={conversation.messages}
                isTyping={conversation.isTyping}
                pendingActivities={conversation.pendingActivities}
                onClose={conversation.closeOverlay}
                onConfirm={handleConfirmActivities}
                onReject={conversation.rejectActivities}
                onClear={conversation.clearConversation}
            />

            <ChatInput
                onSendMessage={handleSendMessage}
                isProcessing={conversation.isTyping}
                onOpenFutures={() => setShowFuturesModal(true)}
            />

            <BottomNav
                activeView={activeView}
                onViewChange={handleViewChange}
                onOpenChat={conversation.openOverlay}
                user={user}
            />

            <FuturesNotification
                userId={user?.uid}
                apiBaseUrl={API_BASE_URL}
                onViewFutures={() => setShowFuturesModal(true)}
            />

            {showFuturesModal && (
                <FuturesModal
                    user={user}
                    onClose={() => setShowFuturesModal(false)}
                    apiBaseUrl={API_BASE_URL}
                />
            )}
        </div>
    );
}
