import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaUsers, FaClipboardList, FaChartBar, FaCalendarAlt, FaProjectDiagram, FaBell } from 'react-icons/fa';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        navigate('/login'); 
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const isAuthenticated = !!localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    // Different navigation links based on user role
    const getNavLinks = () => {
        if (!isAuthenticated) {
            // Public navigation links
            return [
                { title: 'Home', path: '/' },
                { title: 'Services', path: '/services' },
                { title: 'About Us', path: '/about' },
                { title: 'Contact', path: '/contact' }
            ];
        } else if (userRole === 'ADMIN') {
            // Admin navigation links
            return [
                { title: 'Dashboard', path: '/admin', icon: <FaChartBar /> },
                { title: 'Employees', path: '/admin/employees', icon: <FaUsers /> },
                { title: 'Attendance', path: '/admin/attendance', icon: <FaCalendarAlt /> },
                { title: 'Projects', path: '/admin/projects', icon: <FaProjectDiagram /> },
                { title: 'Reports', path: '/admin/reports', icon: <FaClipboardList /> }
            ];
        } else {
            // Employee navigation links
            return [
                { title: 'Dashboard', path: '/employee', icon: <FaChartBar /> },
                { title: 'Attendance', path: '/employee/attendance', icon: <FaCalendarAlt /> },
                { title: 'Projects', path: '/employee/projects', icon: <FaProjectDiagram /> },
                { title: 'Notifications', path: '/employee/notifications', icon: <FaBell /> }
            ];
        }
    };

    const navLinks = getNavLinks();

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isAuthenticated && userRole ? userRole.toLowerCase() + '-navbar' : ''}`}>
            <div className="navbar-container">
                <Link to={isAuthenticated && userRole ? `/${userRole.toLowerCase()}` : "/"} className="navbar-logo">
                    <img src={logo} alt="ARM Infotech Logo" />
                    <div className="company-info">
                        <h2>ARM Infotech</h2>
                        {!isAuthenticated && <p>Chittorgarh, Rajasthan</p>}
                        {isAuthenticated && userRole && <p>{userRole === 'ADMIN' ? 'Admin Portal' : 'Employee Portal'}</p>}
                    </div>
                </Link>

                <div className="menu-icon" onClick={toggleMenu}>
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </div>

                <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    {navLinks.map((link, index) => (
                        <li key={index} className="nav-item">
                            <Link 
                                to={link.path} 
                                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.icon && <span className="nav-icon">{link.icon}</span>}
                                {link.title}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="auth-buttons">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            {userRole && <span className="user-role">{userRole}</span>}
                            <button className="logout-button" onClick={handleLogout}>
                                <FaSignOutAlt /> Logout
                            </button>
                        </div>
                    ) : (
                        <button className="login-button" onClick={handleLogin}>
                            <FaUserCircle /> Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;