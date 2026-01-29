import React from 'react';
import ActivityBlock from './ActivityBlock';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function Timeline({ activities, onSelectActivity }) {
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const filteredActivities = activities.filter(activity => {
        if (!activity.days || activity.days.length === 0) return true;
        return activity.days.some(day => day.toString().toLowerCase() === currentDay);
    });

    // Simple track assignment logic (same as vanilla)
    const sorted = [...filteredActivities].sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));
    const tracks = [];
    sorted.forEach(activity => {
        const start = parseTime(activity.startTime);
        let placed = false;
        for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            const lastActivityInTrack = track[track.length - 1];
            if (start >= parseTime(lastActivityInTrack.endTime)) {
                track.push(activity);
                activity.trackIndex = i;
                placed = true;
                break;
            }
        }
        if (!placed) {
            tracks.push([activity]);
            activity.trackIndex = tracks.length - 1;
        }
    });

    function parseTime(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') return 0;
        const [hours, minutes] = timeStr.trim().split(':').map(Number);
        return (hours || 0) * 60 + (minutes || 0);
    }

    return (
        <div className="timeline-container">
            <div className="time-ruler" id="time-ruler">
                {HOURS.map(hour => (
                    <div key={hour} className="time-marker">
                        {String(hour).padStart(2, '0')}:00
                    </div>
                ))}
            </div>
            <div className="tracks-container" style={{ height: `${tracks.length * (80 + 16)}px` }}>
                <div className="current-time-indicator" id="current-time-indicator"></div>
                {sorted.map(activity => (
                    <ActivityBlock
                        key={activity.id}
                        activity={activity}
                        onClick={() => onSelectActivity(activity)}
                    />
                ))}
            </div>
        </div>
    );
}
