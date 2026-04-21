import React, { memo, useMemo } from 'react';
import './ActivityBlock.css';

function parseTime(timeStr) {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.trim().split(':').map(Number);
    return (hours || 0) * 60 + (minutes || 0);
}

const BLOCK_COLORS = ['#8b5cf6', '#14b8a6', '#7f1d3f'];

const ActivityBlock = memo(({ activity, onClick, style, variantIndex = 0 }) => {
    const { startTime, endTime, title } = activity;

    const durationLabel = useMemo(() => {
        const duration = Math.max(0, parseTime(endTime) - parseTime(startTime));
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        if (hours && minutes) return `${hours}h ${minutes}m`;
        if (hours) return `${hours}h`;
        return `${minutes}m`;
    }, [startTime, endTime]);

    const accentColor = BLOCK_COLORS[variantIndex % BLOCK_COLORS.length];

    return (
        <div
            className="activity-block"
            style={{ '--block-accent': accentColor, ...style }}
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
            <div className="activity-title">{title}</div>
            <div className="activity-time">
                {startTime} — {endTime} • {durationLabel}
            </div>
        </div>
    );
});

export default ActivityBlock;
