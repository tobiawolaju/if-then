import React, { memo, useMemo } from 'react';
import './ActivityBlock.css';

function parseTime(timeStr) {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.trim().split(':').map(Number);
    return (hours || 0) * 60 + (minutes || 0);
}

const ActivityBlock = memo(({ activity, onClick }) => {
    const { startTime, endTime, color, title } = activity;

    const durationLabel = useMemo(() => {
        const duration = Math.max(0, parseTime(endTime) - parseTime(startTime));
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        if (hours && minutes) return `${hours}h ${minutes}m`;
        if (hours) return `${hours}h`;
        return `${minutes}m`;
    }, [startTime, endTime]);

    const accentColor = color || '#fecaca';

    return (
        <div
            className="activity-block"
            style={{ '--block-accent': accentColor }}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <div className="activity-start-time">{startTime}</div>
            <div className="activity-card">
                <div className="activity-title">{title}</div>
                <div className="activity-time">
                    {startTime} — {endTime} • {durationLabel}
                </div>
            </div>
        </div>
    );
});

export default ActivityBlock;
