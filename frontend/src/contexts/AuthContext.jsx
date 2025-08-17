import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);        // { id, name, role } | null
    const [token, setToken] = useState(null);

    /* hydrate from localStorage once */
    useEffect(() => {
        const t = localStorage.getItem('token');
        if (t) setToken(t);
        const u = localStorage.getItem('user');
        if (u) setUser(JSON.parse(u));
    }, []);

    const login = ({ token, user }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);
    };

    const logout = () => {
        localStorage.clear();
        setToken(null);
        setUser(null);
    };

    return (
        <AuthCtx.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthCtx.Provider>
    );
}
