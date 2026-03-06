import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../components/common/common.css';
import './OnboardingPage.css';

const steps = [
    {
        id: 'welcome',
        title: 'Welcome to AppTrack',
        subtitle: 'Your AI-powered job application companion',
        description: 'Track applications, get smart recommendations, auto-fill forms, and generate cover letters — all in one place.',
        features: [
            { icon: '📊', label: 'Track Applications', desc: 'Organize all your job applications in one place' },
            { icon: '✨', label: 'AI Recommendations', desc: 'Get matched to jobs based on your skills' },
            { icon: '⚡', label: 'Auto-Fill', desc: 'Fill application forms instantly with saved profile data' },
            { icon: '📝', label: 'Cover Letter AI', desc: 'Generate tailored cover letters in seconds' },
            { icon: '📄', label: 'Resume Tailor', desc: 'Optimize your resume for every job' },
        ],
    },
    {
        id: 'profile',
        title: 'Set Up Your Profile',
        subtitle: 'Tell us about yourself to get personalized recommendations',
        description: 'This info powers your auto-fill and AI features. You can always update it later.',
    },
    {
        id: 'preferences',
        title: 'Your Job Preferences',
        subtitle: 'Help us find the right opportunities for you',
        description: 'We\'ll use these preferences to filter recommendations and job searches.',
    },
];

const roleOptions = ['Frontend Engineer', 'Backend Engineer', 'Full Stack Developer', 'Product Designer', 'Product Manager', 'Data Scientist', 'DevOps Engineer', 'Other'];
const typeOptions = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const remoteOptions = ['Remote', 'Hybrid', 'On-site', 'No Preference'];

export default function OnboardingPage() {
    const navigate = useNavigate();
    const { state, dispatch } = useApp();
    const [step, setStep] = useState(0);
    const [profileData, setProfileData] = useState({
        firstName: state.profile.firstName || '',
        lastName: state.profile.lastName || '',
        email: state.profile.email || '',
        title: state.profile.title || '',
        location: state.profile.location || '',
    });
    const [preferences, setPreferences] = useState({
        targetRoles: [],
        jobType: 'Full-time',
        workStyle: 'No Preference',
        salaryMin: '',
        weeklyGoal: 5,
    });

    const toggleRole = (role) => {
        setPreferences(prev => ({
            ...prev,
            targetRoles: prev.targetRoles.includes(role)
                ? prev.targetRoles.filter(r => r !== role)
                : [...prev.targetRoles, role],
        }));
    };

    const handleComplete = () => {
        dispatch({ type: 'UPDATE_PROFILE', payload: { ...profileData, preferences } });
        dispatch({ type: 'COMPLETE_ONBOARDING' });
        navigate('/');
    };

    const handleSkip = () => {
        dispatch({ type: 'COMPLETE_ONBOARDING' });
        navigate('/');
    };

    return (
        <div className="onboarding">
            <div className="onboarding-container animate-scale-in">
                {/* Progress */}
                <div className="onboarding-progress">
                    {steps.map((s, i) => (
                        <div key={s.id} className={`onboarding-step-dot ${i <= step ? 'active' : ''}`} />
                    ))}
                </div>

                {/* Step indicator */}
                <div className="onboarding-step-label">
                    Step {step + 1} of {steps.length}
                </div>

                {step === 0 && (
                    <div className="onboarding-welcome">
                        <div className="onboarding-logo">
                            <div className="onboarding-logo-icon">A</div>
                            <h1>App<span className="text-gradient">Track</span></h1>
                        </div>
                        <p className="onboarding-subtitle">{steps[0].subtitle}</p>
                        <p className="onboarding-desc">{steps[0].description}</p>

                        <div className="onboarding-features">
                            {steps[0].features.map(f => (
                                <div className="onboarding-feature" key={f.label}>
                                    <div className="onboarding-feature-icon">{f.icon}</div>
                                    <div>
                                        <div className="onboarding-feature-label">{f.label}</div>
                                        <div className="onboarding-feature-desc">{f.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setStep(1)}>
                            Get Started →
                        </button>
                        <button className="btn btn-ghost" style={{ width: '100%', marginTop: 'var(--space-2)' }} onClick={handleSkip}>
                            Skip for now
                        </button>
                    </div>
                )}

                {step === 1 && (
                    <div className="onboarding-profile">
                        <h2>{steps[1].title}</h2>
                        <p className="onboarding-desc">{steps[1].description}</p>

                        <div className="onboarding-form">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                <div className="form-group">
                                    <label className="form-label">First Name</label>
                                    <input className="form-input" value={profileData.firstName} onChange={e => setProfileData({ ...profileData, firstName: e.target.value })} placeholder="Alex" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Name</label>
                                    <input className="form-input" value={profileData.lastName} onChange={e => setProfileData({ ...profileData, lastName: e.target.value })} placeholder="Morgan" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input className="form-input" type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} placeholder="alex@email.com" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Current Job Title</label>
                                <input className="form-input" value={profileData.title} onChange={e => setProfileData({ ...profileData, title: e.target.value })} placeholder="Frontend Engineer" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input className="form-input" value={profileData.location} onChange={e => setProfileData({ ...profileData, location: e.target.value })} placeholder="San Francisco, CA" />
                            </div>
                        </div>

                        <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setStep(2)}>
                            Next: Job Preferences →
                        </button>
                        <button className="btn btn-ghost" style={{ width: '100%', marginTop: 'var(--space-2)' }} onClick={handleSkip}>
                            Skip for now
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="onboarding-preferences">
                        <h2>{steps[2].title}</h2>
                        <p className="onboarding-desc">{steps[2].description}</p>

                        <div className="onboarding-form">
                            <div className="form-group">
                                <label className="form-label">Target Roles (select all that apply)</label>
                                <div className="pref-chips">
                                    {roleOptions.map(role => (
                                        <button
                                            key={role}
                                            className={`pref-chip ${preferences.targetRoles.includes(role) ? 'active' : ''}`}
                                            onClick={() => toggleRole(role)}
                                            type="button"
                                        >
                                            {preferences.targetRoles.includes(role) ? '✓ ' : ''}{role}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                <div className="form-group">
                                    <label className="form-label">Job Type</label>
                                    <select className="form-input form-select" value={preferences.jobType} onChange={e => setPreferences({ ...preferences, jobType: e.target.value })}>
                                        {typeOptions.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Work Style</label>
                                    <select className="form-input form-select" value={preferences.workStyle} onChange={e => setPreferences({ ...preferences, workStyle: e.target.value })}>
                                        {remoteOptions.map(r => <option key={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Weekly Application Goal</label>
                                <div className="goal-slider-group">
                                    <input
                                        type="range"
                                        className="goal-slider"
                                        min="1" max="15"
                                        value={preferences.weeklyGoal}
                                        onChange={e => setPreferences({ ...preferences, weeklyGoal: parseInt(e.target.value) })}
                                    />
                                    <span className="goal-slider-value">{preferences.weeklyGoal} apps/week</span>
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleComplete}>
                            ✨ Start Tracking →
                        </button>
                        <button className="btn btn-ghost" style={{ width: '100%', marginTop: 'var(--space-2)' }} onClick={() => setStep(1)}>
                            ← Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
