import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/Layout/Header';
import '../components/common/common.css';
import './ProfilePage.css';

export default function ProfilePage() {
    const { state, dispatch } = useApp();
    const [editing, setEditing] = useState(false);
    const [profile, setProfile] = useState(state.profile);
    const [showAutoFill, setShowAutoFill] = useState(false);

    const handleSave = () => {
        dispatch({ type: 'UPDATE_PROFILE', payload: profile });
        setEditing(false);
    };

    const profileCompleteness = () => {
        const fields = [profile.firstName, profile.lastName, profile.email, profile.phone, profile.location, profile.title, profile.summary, profile.portfolio];
        const filled = fields.filter(f => f && f.trim()).length;
        return Math.round((filled / fields.length) * 100);
    };

    return (
        <>
            <Header title="My Profile" subtitle="Auto-fill & resume data" />
            <div className="profile-page">
                <div className="profile-grid">
                    {/* Main Profile */}
                    <div className="profile-main">
                        {/* Profile Header Card */}
                        <div className="card profile-header-card animate-fade-in-up">
                            <div className="profile-header">
                                <div className="profile-avatar">
                                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                                </div>
                                <div className="profile-header-info">
                                    <h1>{profile.firstName} {profile.lastName}</h1>
                                    <p className="profile-title">{profile.title}</p>
                                    <div className="profile-links">
                                        {profile.portfolio && <span>🌐 {profile.portfolio}</span>}
                                        {profile.linkedin && <span>💼 {profile.linkedin}</span>}
                                        {profile.github && <span>🐙 {profile.github}</span>}
                                    </div>
                                </div>
                                <button className="btn btn-primary" onClick={() => setEditing(!editing)}>
                                    {editing ? '✕ Cancel' : '✏️ Edit'}
                                </button>
                            </div>

                            <div className="profile-completion">
                                <div className="profile-completion-header">
                                    <span>Profile Completeness</span>
                                    <span className="profile-completion-pct">{profileCompleteness()}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-bar-fill" style={{ width: `${profileCompleteness()}%` }} />
                                </div>
                            </div>
                        </div>

                        {/* Personal Info */}
                        <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <h2 className="profile-section-title">Personal Information</h2>
                            <div className="profile-form-grid">
                                <div className="form-group">
                                    <label className="form-label">First Name</label>
                                    <input className="form-input" value={profile.firstName} disabled={!editing} onChange={e => setProfile({ ...profile, firstName: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Name</label>
                                    <input className="form-input" value={profile.lastName} disabled={!editing} onChange={e => setProfile({ ...profile, lastName: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input className="form-input" type="email" value={profile.email} disabled={!editing} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input className="form-input" value={profile.phone} disabled={!editing} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Location</label>
                                    <input className="form-input" value={profile.location} disabled={!editing} onChange={e => setProfile({ ...profile, location: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Job Title</label>
                                    <input className="form-input" value={profile.title} disabled={!editing} onChange={e => setProfile({ ...profile, title: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
                                <label className="form-label">Professional Summary</label>
                                <textarea className="form-input form-textarea" value={profile.summary} disabled={!editing} onChange={e => setProfile({ ...profile, summary: e.target.value })} />
                            </div>
                            {editing && (
                                <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="btn btn-primary" onClick={handleSave}>💾 Save Changes</button>
                                </div>
                            )}
                        </div>

                        {/* Experience */}
                        <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <h2 className="profile-section-title">Work Experience</h2>
                            <div className="experience-list">
                                {profile.experience?.map(exp => (
                                    <div className="experience-item" key={exp.id}>
                                        <div className="experience-dot" />
                                        <div className="experience-content">
                                            <div className="experience-role">{exp.role}</div>
                                            <div className="experience-company">{exp.company}</div>
                                            <div className="experience-dates">{exp.startDate} — {exp.endDate}</div>
                                            <p className="experience-desc">{exp.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <h2 className="profile-section-title">Skills</h2>
                            <div className="skills-grid">
                                {profile.skills?.map(skill => (
                                    <span className="tag" key={skill}>{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="profile-sidebar">
                        {/* Auto-fill Preview */}
                        <div className="card animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                            <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                ⚡ Auto-fill Preview
                            </h3>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                                See how your data auto-fills common application fields.
                            </p>
                            <button className="btn btn-accent" style={{ width: '100%' }} onClick={() => setShowAutoFill(!showAutoFill)}>
                                {showAutoFill ? 'Hide Preview' : 'Show Preview'}
                            </button>

                            {showAutoFill && (
                                <div className="autofill-preview">
                                    <div className="autofill-field">
                                        <span className="autofill-label">Full Name</span>
                                        <span className="autofill-value">{profile.firstName} {profile.lastName}</span>
                                    </div>
                                    <div className="autofill-field">
                                        <span className="autofill-label">Email</span>
                                        <span className="autofill-value">{profile.email}</span>
                                    </div>
                                    <div className="autofill-field">
                                        <span className="autofill-label">Phone</span>
                                        <span className="autofill-value">{profile.phone}</span>
                                    </div>
                                    <div className="autofill-field">
                                        <span className="autofill-label">Location</span>
                                        <span className="autofill-value">{profile.location}</span>
                                    </div>
                                    <div className="autofill-field">
                                        <span className="autofill-label">LinkedIn</span>
                                        <span className="autofill-value">{profile.linkedin}</span>
                                    </div>
                                    <div className="autofill-field">
                                        <span className="autofill-label">Portfolio</span>
                                        <span className="autofill-value">{profile.portfolio}</span>
                                    </div>
                                    <div className="autofill-field">
                                        <span className="autofill-label">Current Title</span>
                                        <span className="autofill-value">{profile.title}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Education */}
                        <div className="card animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                            <h3 style={{ marginBottom: 'var(--space-4)' }}>🎓 Education</h3>
                            {profile.education?.map(edu => (
                                <div className="education-item" key={edu.id}>
                                    <div className="education-school">{edu.school}</div>
                                    <div className="education-degree">{edu.degree}</div>
                                    <div className="education-year">{edu.year}</div>
                                </div>
                            ))}
                        </div>

                        {/* Preferences */}
                        <div className="card animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
                            <h3 style={{ marginBottom: 'var(--space-4)' }}>🎯 Job Preferences</h3>
                            <div className="preferences-list">
                                <div className="pref-item">
                                    <span className="pref-label">Target Roles</span>
                                    <div className="pref-tags">
                                        {profile.preferences?.roles?.map(r => (
                                            <span className="tag" key={r} style={{ fontSize: '11px' }}>{r}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="pref-item">
                                    <span className="pref-label">Locations</span>
                                    <span className="pref-value">{profile.preferences?.locations?.join(', ')}</span>
                                </div>
                                <div className="pref-item">
                                    <span className="pref-label">Min Salary</span>
                                    <span className="pref-value">${profile.preferences?.salaryMin?.toLocaleString()}</span>
                                </div>
                                <div className="pref-item">
                                    <span className="pref-label">Remote</span>
                                    <span className="pref-value">{profile.preferences?.remote ? '✅ Yes' : '❌ No'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
