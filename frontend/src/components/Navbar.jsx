// src/components/Navbar.jsx
import { Link as ScrollLink } from 'react-scroll';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './Navbar.css';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();            // needed for soft redirect

    const handleLogout = () => {
        logout();                                // clears state + localStorage
        navigate('/', { replace: true });        // go back to login page
    };

    return (
        <nav className="nav">
            <h1 className="logo">Youth Hub</h1>

            <ul>
                {['home', 'about', 'offer', 'contact'].map((id) => (
                    <li key={id}>
                        <ScrollLink to={id} spy smooth offset={-60} duration={400}>
                            {id.replace(/^\w/, (c) => c.toUpperCase())}
                        </ScrollLink>
                    </li>
                ))}

                {user?.role === 'student' && (
                    <li>
                        <NavLink to="/help">Help</NavLink>
                    </li>
                )}

                {user?.role === 'admin' && (
                    <li>
                        <NavLink to="/admin">Requests</NavLink>
                    </li>
                )}

                {user ? (
                    <li>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                ) : (
                    <li>
                        <NavLink to="/register">Create Account</NavLink>
                    </li>
                )}
            </ul>
        </nav>
    );
}
