import { useTheme } from '../../context/ThemeContext';
import './Header.css';

export default function Header({ title, subtitle }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="header">
            <div className="header-left">
                <h1 className="header-title">{title}</h1>
                {subtitle && <span className="header-subtitle">{subtitle}</span>}
            </div>
            <div className="header-right">
                <div className="header-search">
                    <span className="header-search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search jobs, companies..."
                        aria-label="Search"
                    />
                </div>
                <button className="header-btn" aria-label="Notifications">
                    🔔
                    <span className="notification-dot" />
                </button>
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>
        </header>
    );
}
