import { useState, useEffect } from 'react';
import api from '../api';
import './ExerciseList.css';

export default function ExerciseList() {
    const [list, setList] = useState([]);

    useEffect(() => { api.get('/api/exercises').then(r => setList(r.data)); }, []);

    const add = async () => {
        const title = prompt('Title for new Thought Diary?'); if (!title) return;
        await api.post('/api/exercises', { title, type: 'thoughtDiary' });
        const { data } = await api.get('/api/exercises'); setList(data);
    };

    return (
        <div className="ex-wrap">
            <h2>My CBT Exercises</h2>
            <button className="btn" onClick={add}>+ New Diary</button>
            <ul>
                {list.map(e => (
                    <li key={e.id}>{e.title} <small>{new Date(e.created_at).toLocaleDateString()}</small></li>
                ))}
            </ul>
        </div>
    );
}
