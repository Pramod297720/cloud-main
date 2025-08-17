import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

export default function Register() {
    const nav = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const submit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register', form);
            alert('Registered! You can now sign in.');
            nav('/', { replace: true });
        } catch (err) {
            alert(err.response?.data?.message || 'Register failed');
        }
    };

    return (
        <form className="login-container" onSubmit={submit}>
            <h2>Create Account</h2>
            <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button>Register</button>
            <p style={{ textAlign: 'center' }}>
                Have an account? <Link to="/">Sign in</Link>
            </p>
        </form>
    );
}
