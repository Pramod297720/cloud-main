// ThreadList.jsx
import React, { useState, useEffect } from 'react';

const ThreadList = ({ api, isAdmin, setActive }) => {
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        api.get(isAdmin ? '/threads' : '/threads/mine')
            .then(r => setThreads(r.data));
    }, [api, isAdmin]);

    return (
        <ul>
            {threads.map(t => (
                <li key={t.id} onClick={() => setActive(t.id)}>
                    {t.title} {t.status === 'open' ? '🟢' : '🔒'}
                </li>
            ))}
        </ul>
    );
};

export default ThreadList;
