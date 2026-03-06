import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { statusConfig } from '../data/sampleData';
import Header from '../components/Layout/Header';
import '../components/common/common.css';
import './DashboardPage.css';

export default function DashboardPage() {
    const { state } = useApp();
    const navigate = useNavigate();
    const { jobs } = state;

    // Weekly goal
    const weeklyGoal = 5;
    const weeklyApplied = 3; // simulated this-week count
    const goalPercent = Math.min((weeklyApplied / weeklyGoal) * 100, 100);
    const streak = 4; // simulated streak

    const stats = {
        total: jobs.length,
        saved: jobs.filter(j => j.status === 'saved').length,
        applied: jobs.filter(j => j.status === 'applied').length,
        interview: jobs.filter(j => j.status === 'interview').length,
        offer: jobs.filter(j => j.status === 'offer').length,
        rejected: jobs.filter(j => j.status === 'rejected').length,
    };

    const activeJobs = jobs.filter(j => ['applied', 'interview'].includes(j.status));
    const recentActivity = jobs
        .filter(j => j.timeline && j.timeline.length > 0)
        .flatMap(j => j.timeline.map(t => ({ ...t, company: j.company, jobId: j.id, logo: j.logo })))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    const responseRate = jobs.filter(j => j.status !== 'saved').length > 0
        ? Math.round((jobs.filter(j => ['interview', 'offer'].includes(j.status)).length / jobs.filter(j => j.status !== 'saved').length) * 100)
        : 0;

    // SVG ring values
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (goalPercent / 100) * circumference;

    return (
        <>
            <Header title="Dashboard" subtitle="Welcome back, Alex 👋" />
            <div className="dashboard">
                {/* V2: Weekly Goal & Streak Banner */}
                <div className="goal-banner card animate-fade-in-up">
                    <div className="goal-ring-container">
                        <svg className="goal-ring" viewBox="0 0 120 120">
                            <circle className="goal-ring-bg" cx="60" cy="60" r={radius} />
                            <circle
                                className="goal-ring-fill"
                                cx="60" cy="60" r={radius}
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                            />
                        </svg>
                        <div className="goal-ring-text">
                            <span className="goal-ring-value">{weeklyApplied}/{weeklyGoal}</span>
                            <span className="goal-ring-label">This Week</span>
                        </div>
                    </div>
                    <div className="goal-info">
                        <h2>Weekly Application Goal</h2>
                        <p className="goal-subtitle">You're {goalPercent >= 100 ? 'crushing it! 🎉' : `${Math.round(goalPercent)}% of the way there!`}</p>
                        <div className="goal-streak">
                            <span className="streak-flame">🔥</span>
                            <span className="streak-count">{streak}-day streak</span>
                            <span className="streak-msg">Keep it up! Consistency beats everything.</span>
                        </div>
                    </div>
                    <div className="goal-badges">
                        <div className="goal-badge earned">🏆<span>First Apply</span></div>
                        <div className="goal-badge earned">📊<span>5 Applied</span></div>
                        <div className="goal-badge earned">🎤<span>Interview</span></div>
                        <div className="goal-badge">🌟<span>10 Applied</span></div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="dashboard-stats stagger-children">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'var(--primary-50)' }}>📊</div>
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">Total Applications</div>
                        <div className="stat-change positive">↑ 3 this week</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'var(--warning-50)' }}>🎤</div>
                        <div className="stat-value">{stats.interview}</div>
                        <div className="stat-label">Interviews</div>
                        <div className="stat-change positive">↑ 1 new</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'var(--success-50)' }}>🎉</div>
                        <div className="stat-value">{stats.offer}</div>
                        <div className="stat-label">Offers</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'var(--accent-50)' }}>📈</div>
                        <div className="stat-value">{responseRate}%</div>
                        <div className="stat-label">Response Rate</div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    {/* Pipeline Overview */}
                    <div className="card dashboard-pipeline">
                        <div className="card-header">
                            <h2>Application Pipeline</h2>
                            <button className="btn btn-sm btn-secondary" onClick={() => navigate('/jobs')}>View Board →</button>
                        </div>
                        <div className="pipeline-bars">
                            {Object.entries(statusConfig).map(([key, config]) => (
                                <div className="pipeline-row" key={key}>
                                    <div className="pipeline-label">
                                        <span>{config.icon}</span>
                                        <span>{config.label}</span>
                                        <span className="pipeline-count">{stats[key] || 0}</span>
                                    </div>
                                    <div className="pipeline-bar">
                                        <div
                                            className="pipeline-bar-fill"
                                            style={{
                                                width: `${stats.total > 0 ? ((stats[key] || 0) / stats.total) * 100 : 0}%`,
                                                background: config.color,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="card dashboard-activity">
                        <div className="card-header">
                            <h2>Recent Activity</h2>
                        </div>
                        <div className="activity-list">
                            {recentActivity.map((activity, i) => (
                                <div className="activity-item" key={i}>
                                    <div className="activity-dot" data-type={activity.type} />
                                    <div className="activity-content">
                                        <div className="activity-text">
                                            <span className="activity-company">{activity.logo} {activity.company}</span>
                                            <span className="activity-event">{activity.event}</span>
                                        </div>
                                        <div className="activity-date">{new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Applications */}
                    <div className="card dashboard-active">
                        <div className="card-header">
                            <h2>Active Applications</h2>
                            <span className="badge badge-applied">{activeJobs.length} active</span>
                        </div>
                        <div className="active-list">
                            {activeJobs.map(job => (
                                <div className="active-job-card" key={job.id} onClick={() => navigate(`/jobs/${job.id}`)}>
                                    <div className="active-job-logo" style={{ background: job.color + '15', color: job.color }}>
                                        {job.logo}
                                    </div>
                                    <div className="active-job-info">
                                        <div className="active-job-role">{job.role}</div>
                                        <div className="active-job-company">{job.company} · {job.location}</div>
                                    </div>
                                    <span className={`badge badge-${job.status}`}>
                                        {statusConfig[job.status]?.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card dashboard-actions">
                        <div className="card-header">
                            <h2>Quick Actions</h2>
                        </div>
                        <div className="actions-grid">
                            <button className="action-card" onClick={() => navigate('/jobs')}>
                                <span className="action-icon">➕</span>
                                <span className="action-label">Add Application</span>
                            </button>
                            <button className="action-card" onClick={() => navigate('/recommendations')}>
                                <span className="action-icon">✨</span>
                                <span className="action-label">AI Recommendations</span>
                            </button>
                            <button className="action-card" onClick={() => navigate('/cover-letter')}>
                                <span className="action-icon">📝</span>
                                <span className="action-label">Generate Cover Letter</span>
                            </button>
                            <button className="action-card" onClick={() => navigate('/resume-tailor')}>
                                <span className="action-icon">📄</span>
                                <span className="action-label">AI Resume Tailor</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
