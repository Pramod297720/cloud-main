import { useState, useEffect } from 'react';
import api from '../utils/api';
import './Help.css';

export default function HelpPage() {
    const [threads, setThreads] = useState([]);
    const [form, setForm] = useState({ title: '', message: '' });

    const loadThreads = () =>
        api.get('/help/mine').then((r) => setThreads(r.data));

    useEffect(loadThreads, []);

    const submit = async (e) => {
        e.preventDefault();
        await api.post('/help', form);
        setForm({ title: '', message: '' });
        loadThreads();
    };

    return (
        <section className="help-wrap">
            <h2>Need Help?</h2>

            <form className="help-form" onSubmit={submit}>
                <input
                    placeholder="Short title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                />
                <textarea
                    rows={5}
                    placeholder="Describe your situation"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                />
                <button type="submit">Send Request</button>
            </form>

            <h3>My Requests</h3>
            {threads.map((t) => (
                <div className="ticket" key={t.id}>
                    <header>
                        <strong>{t.title}</strong>
                        <time>{new Date(t.created_at).toLocaleString()}</time>
                    </header>

                    <p>{t.message}</p>

                    {t.reply_text ? (
                        <div className="reply">
                            <em>{t.reply_text}</em>
                            <small>
                                — {t.admin_name} ({new Date(t.replied_at).toLocaleString()})
                            </small>
                        </div>
                    ) : (
                        <p className="pending">⏳ Awaiting response…</p>
                    )}
                </div>
            ))}
        </section>
    );
}
