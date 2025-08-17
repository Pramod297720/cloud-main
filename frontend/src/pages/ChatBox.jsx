// ChatBox.jsx
import React, { useState, useEffect } from 'react';
import './chatbox.css'
const ChatBox = ({ threadId, api, user }) => {
    const [msgs, setMsgs] = useState([]);
    const [txt, setTxt] = useState('');

    const load = () => api.get(`/threads/${threadId}/messages`).then(r => setMsgs(r.data));
    useEffect(load, [threadId]);

    const send = async () => {
        if (!txt.trim()) return;
        await api.post(`/threads/${threadId}/messages`, { body: txt });
        setTxt('');
        load();                       // refresh after send
    };

    return (
        <div className="chat-box">
            <div className="msgs">
                {msgs.map(m => (
                    <div className={m.sender_id === user.id ? 'me' : 'them'} key={m.id}>
                        {m.body}<time>{new Date(m.sent_at).toLocaleTimeString()}</time>
                    </div>
                ))}
            </div>
            <div className="input-row">
                <input value={txt} onChange={e => setTxt(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
                <button onClick={send}>➤</button>
            </div>
        </div>
    );
};

export default ChatBox;
