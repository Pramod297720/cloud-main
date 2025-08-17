import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HelpRequestPanel.css';

const HelpRequestPanel = () => {
    const [requests, setRequests] = useState([]);
    const [reply, setReply] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);

    const fetchRequests = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('/api/help', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(res.data);
        } catch (err) {
            console.error('Failed to fetch help requests:', err);
        }
    };

    const handleReply = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`/api/help/${id}/reply`, { reply }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReply('');
            setReplyingTo(null);
            fetchRequests();
        } catch (err) {
            console.error('Reply failed:', err);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (window.confirm('Are you sure you want to delete this help request?')) {
            try {
                await axios.delete(`/api/help/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchRequests();
            } catch (err) {
                console.error('Delete failed:', err);
            }
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div className="help-panel-container">
            <h2 className="panel-title">All Help Requests</h2>
            {requests.length === 0 ? (
                <p className="no-requests">No help requests available.</p>
            ) : (
                <div className="request-list">
                    {requests.map((req) => (
                        <div className="request-card" key={req.id}>
                            <div className="request-header">
                                <span className="requester">{req.requester}</span>
                                <span className={`status ${req.status}`}>{req.status}</span>
                            </div>

                            <h4 className="request-title">{req.title}</h4>
                            <p className="message">{req.message}</p>

                            {req.reply_text && (
                                <div className="admin-reply">
                                    <strong>Admin Reply:</strong>
                                    <p>{req.reply_text}</p>
                                </div>
                            )}

                            {replyingTo === req.id ? (
                                <div className="reply-box">
                                    <textarea
                                        value={reply}
                                        onChange={(e) => setReply(e.target.value)}
                                        placeholder="Type your reply..."
                                    />
                                    <div className="reply-actions">
                                        <button onClick={() => handleReply(req.id)}>Send Reply</button>
                                        <button className="cancel" onClick={() => setReplyingTo(null)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="actions">
                                    <button className="reply" onClick={() => setReplyingTo(req.id)}>Reply</button>
                                    <button className="delete" onClick={() => handleDelete(req.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HelpRequestPanel;
