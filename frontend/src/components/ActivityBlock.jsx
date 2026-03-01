import React, { memo, useMemo } from 'react';
import './ActivityBlock.css';

const ActivityBlock = memo(({ activity, onClick }) => {
    const { startTime, endTime, trackIndex, color, title, id } = activity;

    const { start, duration } = useMemo(() => {
        const parseTime = (timeStr) => {
            if (!timeStr) return 0;
            const [hours, minutes] = timeStr.trim().split(':').map(Number);
            return (hours || 0) * 60 + (minutes || 0);
        };

        const s = parseTime(startTime);
        const e = parseTime(endTime);
        return { start: s, duration: e - s };
    }, [startTime, endTime]);

    const accentColor = color || 'var(--accent-primary)';

    const style = {
        left: `calc(${start} * var(--pixels-per-minute))`,
        width: `calc(${duration} * var(--pixels-per-minute))`,
        top: `calc(${trackIndex} * var(--grid-track-total))`,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-visible)',
        borderLeft: `8px solid ${accentColor}`,
        '--block-accent': accentColor,
        boxShadow: 'none',
        borderRadius: 0,
        willChange: 'left, width, transform'
    };

    return (
        <div
            className="activity-block"
            style={style}
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
                {startTime} — {endTime}
            </div>
        </div>
    );
});

export default ActivityBlock;
