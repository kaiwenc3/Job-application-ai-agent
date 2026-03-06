import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Layout/Header';
import '../components/common/common.css';
import './SettingsPage.css';

export default function SettingsPage() {
    const { dispatch } = useApp();
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            <Header title="Settings" subtitle="Customize your experience" />
            <div className="settings-page">
                <div className="settings-grid">
                    {/* Appearance */}
                    <div className="card animate-fade-in-up">
                        <h2 className="settings-section-title">🎨 Appearance</h2>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <div className="settings-item-label">Dark Mode</div>
                                <div className="settings-item-desc">Switch between light and dark themes</div>
                            </div>
                            <button className="toggle-switch" data-active={theme === 'dark'} onClick={toggleTheme} aria-label="Toggle dark mode">
                                <div className="toggle-knob" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <h2 className="settings-section-title">🔔 Notifications</h2>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <div className="settings-item-label">Application Reminders</div>
                                <div className="settings-item-desc">Get reminded about pending applications</div>
                            </div>
                            <button className="toggle-switch" data-active="true" aria-label="Toggle application reminders">
                                <div className="toggle-knob" />
                            </button>
                        </div>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <div className="settings-item-label">Interview Prep Alerts</div>
                                <div className="settings-item-desc">Notifications before scheduled interviews</div>
                            </div>
                            <button className="toggle-switch" data-active="true" aria-label="Toggle interview alerts">
                                <div className="toggle-knob" />
                            </button>
                        </div>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <div className="settings-item-label">New Job Matches</div>
                                <div className="settings-item-desc">Get notified when AI finds new matches</div>
                            </div>
                            <button className="toggle-switch" data-active="false" aria-label="Toggle job match notifications">
                                <div className="toggle-knob" />
                            </button>
                        </div>
                    </div>

                    {/* Auto-fill */}
                    <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h2 className="settings-section-title">⚡ Auto-Fill Preferences</h2>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <div className="settings-item-label">Auto-fill on Quick Apply</div>
                                <div className="settings-item-desc">Automatically populate fields when using Quick Apply</div>
                            </div>
                            <button className="toggle-switch" data-active="true" aria-label="Toggle auto-fill">
                                <div className="toggle-knob" />
                            </button>
                        </div>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <div className="settings-item-label">Include Cover Letter</div>
                                <div className="settings-item-desc">Auto-generate and attach cover letter with applications</div>
                            </div>
                            <button className="toggle-switch" data-active="false" aria-label="Toggle cover letter inclusion">
                                <div className="toggle-knob" />
                            </button>
                        </div>
                    </div>

                    {/* Data */}
                    <div className="card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <h2 className="settings-section-title">💾 Data Management</h2>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <div className="settings-item-label">Export Data</div>
                                <div className="settings-item-desc">Download all your application data as JSON</div>
                            </div>
                            <button className="btn btn-secondary btn-sm">📥 Export</button>
                        </div>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <div className="settings-item-label">Reset All Data</div>
                                <div className="settings-item-desc">Reset to sample data (cannot be undone)</div>
                            </div>
                            <button className="btn btn-danger btn-sm" onClick={() => {
                                if (confirm('Are you sure? This will reset all your data to the defaults.')) {
                                    dispatch({ type: 'RESET_DATA' });
                                }
                            }}>🗑️ Reset</button>
                        </div>
                    </div>

                    {/* About */}
                    <div className="card animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <h2 className="settings-section-title">ℹ️ About</h2>
                        <div className="settings-about">
                            <div className="settings-about-logo">
                                <div className="sidebar-logo-icon" style={{ width: 32, height: 32, fontSize: 14 }}>A</div>
                                <span style={{ fontWeight: 700 }}>AppTrack</span>
                                <span className="badge badge-applied">v1.0</span>
                            </div>
                            <p>AI-powered job application tracker with smart recommendations and auto-fill. Built for the modern job seeker.</p>
                            <div className="settings-credits">
                                <p>🤖 AI Tools Used: Claude Code for templates, Midjourney for conceptual assets</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
