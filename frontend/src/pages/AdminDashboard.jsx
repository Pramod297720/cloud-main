import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HelpRequestPanel from './HelpRequestPanel';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
    const [activeTab, setActiveTab] = useState('users');

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data.users);
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('/api/admin/create-user', form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setForm({ name: '', email: '', password: '', role: 'user' });
            fetchUsers();
            alert('User added successfully!');
        } catch (err) {
            alert('Error creating user');
        }
    };

    return (
        <div className="admin-container">
            <h2 className="admin-title">Admin Dashboard</h2>

            <div className="tab-buttons">
                <button
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    Manage Users
                </button>
                <button
                    className={activeTab === 'help' ? 'active' : ''}
                    onClick={() => setActiveTab('help')}
                >
                    Help Requests
                </button>
            </div>

            {activeTab === 'users' && (
                <div className="user-section">
                    <h3>Add New User</h3>
                    <form onSubmit={handleSubmit} className="user-form">
                        <input
                            placeholder="Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Password"
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <select
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button type="submit">Add User</button>
                    </form>

                    <h3>All Users ({users.length})</h3>
                    <div className="user-table-container">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user.id || user._id}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'help' && (
                <div className="help-section">
                    <HelpRequestPanel />
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
