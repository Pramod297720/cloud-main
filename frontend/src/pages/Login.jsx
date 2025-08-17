// Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Login.css';

export default function Login() {
    const nav = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });

    const submit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/auth/login', form);
            login({ token: data.token, user: data.user });
            data.user.role === 'admin' ? nav('/admin', { replace: true }) : nav('/landing', { replace: true });
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2 className="login-title">Sign In</h2>
                <form className="login-form" onSubmit={submit}>
                    <input
                        className="login-input"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button type="submit" className="login-button">Login</button>
                </form>
                <p className="login-footer">
                    No account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    );
}
