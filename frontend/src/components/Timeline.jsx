import React, { useMemo } from 'react';
import ActivityBlock from './ActivityBlock';
import './Timeline.css';

function parseTime(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const [hours, minutes] = timeStr.trim().split(':').map(Number);
    return (hours || 0) * 60 + (minutes || 0);
}

function formatMarkerTime(totalMinutes) {
    const normalized = ((Math.round(totalMinutes / 30) * 30) + 1440) % 1440;
    const hours = Math.floor(normalized / 60)
        .toString()
        .padStart(2, '0');
    const minutes = (normalized % 60)
        .toString()
        .padStart(2, '0');
    return `${hours}:${minutes}`;
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

    const timelineLayout = useMemo(() => {
        if (!sortedActivities.length) {
            return {
                items: [],
                minTime: 0,
                maxTime: 720,
                rowCount: 1
            };
        }

        const rows = [];
        const parsed = sortedActivities.map((activity) => {
            const start = parseTime(activity.startTime);
            const end = Math.max(start + 15, parseTime(activity.endTime));

            let rowIndex = rows.findIndex((rowEnd) => start >= rowEnd);
            if (rowIndex === -1) {
                rows.push(end);
                rowIndex = rows.length - 1;
            } else {
                rows[rowIndex] = end;
            }

            return { activity, start, end, rowIndex };
        });

        const minStart = Math.min(...parsed.map((item) => item.start));
        const maxEnd = Math.max(...parsed.map((item) => item.end));
        const padding = 30;

        return {
            items: parsed,
            minTime: Math.max(0, minStart - padding),
            maxTime: Math.min(1440, maxEnd + padding),
            rowCount: Math.max(1, rows.length)
        };
    }, [sortedActivities]);

    const { items, minTime, maxTime, rowCount } = timelineLayout;
    const span = Math.max(120, maxTime - minTime);

    const markers = useMemo(() => {
        const markerCount = 7;
        return Array.from({ length: markerCount }, (_, index) => {
            const ratio = index / (markerCount - 1);
            const minuteValue = minTime + span * ratio;
            return {
                label: formatMarkerTime(minuteValue),
                position: ratio * 100
            };
        });
    }, [minTime, span]);

    return (
        <div className="timeline-container" onClick={() => onSelectActivity(null)}>
            <div className="timeline-scroll-area">
                <div className="timeline-ruler" aria-hidden="true">
                    {markers.map((marker) => (
                        <div
                            key={`${marker.label}-${marker.position}`}
                            className="timeline-ruler-marker"
                            style={{ left: `${marker.position}%` }}
                        >
                            <span>{marker.label}</span>
                        </div>
                    ))}
                </div>

                <div className="timeline-track" style={{ '--row-count': rowCount }} role="list">
                    {items.map(({ activity, start, end, rowIndex }, index) => (
                        <ActivityBlock
                            key={activity.id}
                            activity={activity}
                            variantIndex={index}
                            onClick={() => onSelectActivity(activity)}
                            style={{
                                left: `${((start - minTime) / span) * 100}%`,
                                width: `${(Math.max(15, end - start) / span) * 100}%`,
                                top: `calc(${rowIndex} * (var(--timeline-row-height) + var(--timeline-row-gap)))`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
