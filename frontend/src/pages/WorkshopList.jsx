import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../api';
import './WorkshopList.css';

export default function WorkshopList() {
    const { user } = useOutletContext();
    const [list, setList] = useState([]);

    useEffect(() => {
        api.get('/api/workshops').then(r => setList(r.data));
    }, []);

    const enrol = async (id) => {
        await api.post(`/api/workshops/${id}/enrol`);
        alert('Enrolled!');
    };

    const del = async (id) => {
        if (!window.confirm('Delete workshop?')) return;
        await api.delete(`/api/workshops/${id}`);
        setList(list.filter(w => w.id !== id));
    };

    return (
        <div className="wrap">
            <h2>Workshops</h2>
            {user.role === 'admin' && <a className="btn" href="#">+ Create</a>}
            <ul>
                {list.map(w => (
                    <li key={w.id}>
                        <div>
                            <h3>{w.title}</h3>
                            <span>{w.date_start}</span>
                        </div>
                        {user.role === 'admin'
                            ? <button onClick={() => del(w.id)}>Delete</button>
                            : <button onClick={() => enrol(w.id)}>Enrol</button>}
                    </li>
                ))}
            </ul>
        </div>
    );
}
