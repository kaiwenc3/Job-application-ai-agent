import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Sidebar.css';

const navItems = [
    {
        section: 'Main', items: [
            { path: '/', icon: '📊', label: 'Dashboard' },
            { path: '/jobs', icon: '📋', label: 'Job Board' },
            { path: '/search', icon: '🔍', label: 'Job Search' },
        ]
    },
    {
        section: 'AI Tools', items: [
            { path: '/recommendations', icon: '✨', label: 'AI Recommendations', badge: true },
            { path: '/cover-letter', icon: '📝', label: 'Cover Letter AI' },
            { path: '/resume-tailor', icon: '📄', label: 'Resume Tailor' },
        ]
    },
    {
        section: 'Profile', items: [
            { path: '/profile', icon: '👤', label: 'My Profile' },
            { path: '/analytics', icon: '📈', label: 'Analytics' },
            { path: '/settings', icon: '⚙️', label: 'Settings' },
        ]
    },
];

export default function Sidebar() {
    const { state } = useApp();
    const location = useLocation();

    const recCount = state.recommendations?.length || 0;

    return (
        <aside className="sidebar" role="navigation" aria-label="Main navigation">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">A</div>
                <div className="sidebar-logo-text">
                    App<span>Track</span>
                </div>
            </div>

            {navItems.map(section => (
                <div className="sidebar-section" key={section.section}>
                    <div className="sidebar-section-title">{section.section}</div>
                    {section.items.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                            end={item.path === '/'}
                        >
                            <span className="sidebar-link-icon">{item.icon}</span>
                            {item.label}
                            {item.badge && recCount > 0 && (
                                <span className="sidebar-link-badge">{recCount}</span>
                            )}
                        </NavLink>
                    ))}
                </div>
            ))}

            <div className="sidebar-spacer" />

            <div className="sidebar-footer">
                <NavLink to="/profile" className="sidebar-user" style={{ textDecoration: 'none' }}>
                    <div className="sidebar-avatar">
                        {state.profile.firstName?.[0]}{state.profile.lastName?.[0]}
                    </div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{state.profile.firstName} {state.profile.lastName}</div>
                        <div className="sidebar-user-email">{state.profile.email}</div>
                    </div>
                </NavLink>
            </div>
        </aside>
    );
}
