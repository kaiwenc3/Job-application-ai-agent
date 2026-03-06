import { useApp } from '../context/AppContext';
import Header from '../components/Layout/Header';
import '../components/common/common.css';
import './AnalyticsPage.css';

export default function AnalyticsPage() {
    const { state } = useApp();
    const { jobs } = state;

    const stats = {
        total: jobs.length,
        saved: jobs.filter(j => j.status === 'saved').length,
        applied: jobs.filter(j => j.status === 'applied').length,
        interview: jobs.filter(j => j.status === 'interview').length,
        offer: jobs.filter(j => j.status === 'offer').length,
        rejected: jobs.filter(j => j.status === 'rejected').length,
    };

    const responseRate = jobs.filter(j => j.status !== 'saved').length > 0
        ? Math.round((jobs.filter(j => ['interview', 'offer'].includes(j.status)).length / jobs.filter(j => j.status !== 'saved').length) * 100)
        : 0;

    const interviewRate = jobs.filter(j => j.status !== 'saved').length > 0
        ? Math.round((stats.interview / jobs.filter(j => j.status !== 'saved').length) * 100)
        : 0;

    const offerRate = stats.interview > 0
        ? Math.round((stats.offer / (stats.interview + stats.offer)) * 100)
        : 0;

    // Funnel data
    const funnelSteps = [
        { label: 'Applied', count: stats.applied + stats.interview + stats.offer + stats.rejected, color: 'var(--primary-500)' },
        { label: 'Interview', count: stats.interview + stats.offer, color: 'var(--warning-500)' },
        { label: 'Offer', count: stats.offer, color: 'var(--success-500)' },
    ];
    const maxFunnel = Math.max(...funnelSteps.map(f => f.count), 1);

    // Skills frequency
    const skillFreq = {};
    jobs.forEach(job => {
        job.tags?.forEach(tag => {
            skillFreq[tag] = (skillFreq[tag] || 0) + 1;
        });
    });
    const topSkills = Object.entries(skillFreq).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const maxSkillCount = Math.max(...topSkills.map(s => s[1]), 1);

    // Company applications
    const companyCount = {};
    jobs.forEach(job => {
        if (job.company) companyCount[job.company] = (companyCount[job.company] || 0) + 1;
    });
    const topCompanies = Object.entries(companyCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Weekly activity (simulated)
    const weeklyData = [
        { day: 'Mon', count: 2 },
        { day: 'Tue', count: 1 },
        { day: 'Wed', count: 3 },
        { day: 'Thu', count: 0 },
        { day: 'Fri', count: 2 },
        { day: 'Sat', count: 1 },
        { day: 'Sun', count: 0 },
    ];
    const maxWeekly = Math.max(...weeklyData.map(d => d.count), 1);

    return (
        <>
            <Header title="Analytics" subtitle="Track your progress" />
            <div className="analytics">
                {/* Overview Stats */}
                <div className="analytics-stats stagger-children">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'var(--primary-50)' }}>📊</div>
                        <div className="stat-value">{responseRate}%</div>
                        <div className="stat-label">Response Rate</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'var(--warning-50)' }}>🎤</div>
                        <div className="stat-value">{interviewRate}%</div>
                        <div className="stat-label">Interview Rate</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'var(--success-50)' }}>🎉</div>
                        <div className="stat-value">{offerRate}%</div>
                        <div className="stat-label">Offer Conversion</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'var(--accent-50)' }}>📅</div>
                        <div className="stat-value">12</div>
                        <div className="stat-label">Avg. Days to Response</div>
                    </div>
                </div>

                <div className="analytics-grid">
                    {/* Funnel */}
                    <div className="card animate-fade-in-up">
                        <h2 className="analytics-card-title">Application Funnel</h2>
                        <div className="funnel">
                            {funnelSteps.map((step, i) => (
                                <div className="funnel-step" key={step.label}>
                                    <div className="funnel-label">
                                        <span>{step.label}</span>
                                        <span className="funnel-count">{step.count}</span>
                                    </div>
                                    <div className="funnel-bar-container">
                                        <div
                                            className="funnel-bar"
                                            style={{
                                                width: `${(step.count / maxFunnel) * 100}%`,
                                                background: step.color,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="funnel-insight">
                            <span className="insight-badge">💡 AI Insight</span>
                            <p>Your funnel shows a {responseRate}% response rate. Companies in tech tend to have a 10-15% average — you're doing {responseRate > 15 ? 'better than' : 'around'} average!</p>
                        </div>
                    </div>

                    {/* Weekly Activity */}
                    <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <h2 className="analytics-card-title">Weekly Activity</h2>
                        <div className="chart-bars">
                            {weeklyData.map(day => (
                                <div className="chart-bar-column" key={day.day}>
                                    <div className="chart-bar-wrapper">
                                        <div
                                            className="chart-bar"
                                            style={{ height: `${(day.count / maxWeekly) * 100}%` }}
                                        >
                                            {day.count > 0 && <span className="chart-bar-value">{day.count}</span>}
                                        </div>
                                    </div>
                                    <span className="chart-bar-label">{day.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Skills */}
                    <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h2 className="analytics-card-title">Most Requested Skills</h2>
                        <div className="skills-chart">
                            {topSkills.map(([skill, count]) => (
                                <div className="skill-bar-row" key={skill}>
                                    <span className="skill-bar-label">{skill}</span>
                                    <div className="skill-bar-container">
                                        <div
                                            className="skill-bar"
                                            style={{ width: `${(count / maxSkillCount) * 100}%` }}
                                        />
                                    </div>
                                    <span className="skill-bar-count">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Companies */}
                    <div className="card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <h2 className="analytics-card-title">Applications by Company</h2>
                        <div className="companies-list">
                            {topCompanies.map(([company, count], i) => (
                                <div className="company-row" key={company}>
                                    <span className="company-rank">#{i + 1}</span>
                                    <span className="company-name">{company}</span>
                                    <span className="company-count">{count} app{count > 1 ? 's' : ''}</span>
                                </div>
                            ))}
                        </div>
                        <div className="funnel-insight" style={{ marginTop: 'var(--space-4)' }}>
                            <span className="insight-badge">💡 AI Insight</span>
                            <p>You've applied to {Object.keys(companyCount).length} unique companies. Diversifying across industries can increase your chances.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
