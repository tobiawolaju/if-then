import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin } from 'lucide-react';

export default function DetailsSheet({ activity, isOpen, onClose, onSave, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(activity || {});

    useEffect(() => {
        if (activity) {
            setEditData(activity);
            setIsEditing(false);
        }
    }, [activity]);

    if (!activity && !editData.id) return null;

    const handleSave = () => {
        onSave(editData);
        setIsEditing(false);
    };

    const getStatusColor = (status) => {
        const colors = {
            'Completed': '#4CAF50',
            'In Progress': '#2196F3',
            'Pending': '#FFC107',
            'Missed': '#F44336'
        };
        return colors[status] || '#999';
    };

    const hexToRgba = (hex, alpha) => {
        if (!hex || hex[0] !== '#') return hex;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const renderView = () => {
        if (!activity) return null;
        const statusColor = getStatusColor(activity.status);
        return (
            <div className="detail-container">
                <button className="close-panel-btn" onClick={onClose} aria-label="Close">
                    <X size={20} />
                </button>
                <header className="detail-header">
                    <div className="detail-title-row">
                        <span className="status-chip" style={{
                            backgroundColor: hexToRgba(statusColor, 0.1),
                            color: statusColor,
                            border: `1px solid ${hexToRgba(statusColor, 0.2)}`
                        }}>
                            {activity.status || 'Scheduled'}
                        </span>
                        <h2>{activity.title}</h2>
                    </div>
                    <div className="detail-time">
                        <Clock size={16} />
                        {activity.startTime} to {activity.endTime}
                    </div>
                </header>

                {activity.description && (
                    <div className="detail-section">
                        <h3>Description</h3>
                        <p>{activity.description}</p>
                    </div>
                )}

                <div className="detail-grid">
                    <div className="detail-section">
                        <h3>Location</h3>
                        <div className="detail-value">
                            <MapPin size={16} />
                            {activity.location || 'Remote / None'}
                        </div>
                    </div>
                </div>

                <div className="detail-actions">
                    <button className="action-button primary" onClick={() => setIsEditing(true)}>Edit Details</button>
                    <button className="action-button secondary" onClick={() => onDelete(activity.id)}>Delete</button>
                </div>
            </div>
        );
    };

    const renderEdit = () => (
        <div className="detail-container edit-container">
            <header className="detail-header">
                <h2>Edit Activity</h2>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Modify the details of your scheduled activity.</p>
            </header>

            <div className="form-group">
                <label>Activity Title</label>
                <input type="text" value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} />
            </div>

            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                    <label>Start Time</label>
                    <input type="time" value={editData.startTime} onChange={e => setEditData({ ...editData, startTime: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>End Time</label>
                    <input type="time" value={editData.endTime} onChange={e => setEditData({ ...editData, endTime: e.target.value })} />
                </div>
            </div>

            <div className="form-group">
                <label>Location</label>
                <input type="text" value={editData.location || ''} onChange={e => setEditData({ ...editData, location: e.target.value })} />
            </div>

            <div className="detail-actions">
                <button className="action-button primary" onClick={handleSave}>Save Changes</button>
                <button className="action-button secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
        </div>
    );

    return (
        <>
            <div className={`details-panel-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
            <div className={`details-panel ${isOpen ? 'open' : ''}`}>
                {isEditing ? renderEdit() : renderView()}
            </div>
        </>
    );
}
