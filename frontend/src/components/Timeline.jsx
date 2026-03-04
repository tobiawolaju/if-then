import React, { useMemo } from 'react';
import ActivityBlock from './ActivityBlock';
import './Timeline.css';

function parseTime(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const [hours, minutes] = timeStr.trim().split(':').map(Number);
    return (hours || 0) * 60 + (minutes || 0);
}

export default function Timeline({ activities, onSelectActivity }) {
    const currentDay = useMemo(
        () => new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
        []
    );

    const sortedActivities = useMemo(() => {
        const filteredActivities = activities.filter((activity) => {
            if (!activity.days || activity.days.length === 0) return true;
            return activity.days.some((day) => day.toString().toLowerCase() === currentDay);
        });

        return [...filteredActivities].sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));
    }, [activities, currentDay]);

    return (
        <div className="timeline-container" onClick={() => onSelectActivity(null)}>
            <div className="timeline-list" role="list">
                {sortedActivities.map((activity) => (
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
