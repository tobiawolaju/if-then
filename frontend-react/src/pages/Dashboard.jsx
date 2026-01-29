import React, { useState } from 'react';
import Header from '../components/Header';
import Timeline from '../components/Timeline';
import ChatInput from '../components/ChatInput';
import DetailsSheet from '../components/DetailsSheet';
import { useSchedule } from '../hooks/useSchedule';
import { database } from '../firebase-config';
import { ref, update, remove } from 'firebase/database';

export default function Dashboard({ user, onLogout }) {
    const { activities, loading: scheduleLoading } = useSchedule(user?.uid);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSendMessage = async (message) => {
        setIsProcessing(true);
        try {
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

    if (scheduleLoading) return <div className="loading">Loading Schedule...</div>;

    return (
        <div className="app-container">
            <Header user={user} onLogout={onLogout} />
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
