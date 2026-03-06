import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { statusConfig } from '../data/sampleData';
import Header from '../components/Layout/Header';
import '../components/common/common.css';
import './JobDetailPage.css';

const statusOrder = ['saved', 'applied', 'interview', 'offer', 'rejected'];

export default function JobDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state, dispatch } = useApp();
    const job = state.jobs.find(j => j.id === id);

    if (!job) {
        return (
            <>
                <Header title="Job Detail" />
                <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <div className="empty-state-title">Job not found</div>
                    <button className="btn btn-primary" onClick={() => navigate('/jobs')}>Back to Board</button>
                </div>
            </>
        );
    }

    const handleStatusChange = (newStatus) => {
        dispatch({ type: 'UPDATE_JOB_STATUS', payload: { id: job.id, status: newStatus } });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this application?')) {
            dispatch({ type: 'DELETE_JOB', payload: job.id });
            navigate('/jobs');
        }
    };

    return (
        <>
            <Header title="Job Detail" />
            <div className="job-detail">
                <button className="btn btn-ghost" onClick={() => navigate('/jobs')} style={{ marginBottom: 'var(--space-4)' }}>
                    ← Back to Board
                </button>

                <div className="job-detail-grid">
                    {/* Main Info */}
                    <div className="card job-detail-main animate-fade-in-up">
                        <div className="job-detail-header">
                            <div className="job-detail-logo" style={{ background: job.color + '15', color: job.color }}>
                                {job.logo}
                            </div>
                            <div className="job-detail-title-group">
                                <h1 className="job-detail-role">{job.role}</h1>
                                <div className="job-detail-company">{job.company}</div>
                            </div>
                            <span className={`badge badge-${job.status}`}>
                                {statusConfig[job.status]?.icon} {statusConfig[job.status]?.label}
                            </span>
                        </div>

                        <div className="job-detail-meta">
                            <div className="job-meta-item">📍 {job.location}</div>
                            {job.salary && <div className="job-meta-item">💰 {job.salary}</div>}
                            {job.remote && <div className="job-meta-item">🏠 {job.remote}</div>}
                            {job.type && <div className="job-meta-item">💼 {job.type}</div>}
                        </div>

                        {job.description && (
                            <div className="job-detail-section">
                                <h3>About the Role</h3>
                                <p>{job.description}</p>
                            </div>
                        )}

                        {job.tags && job.tags.length > 0 && (
                            <div className="job-detail-section">
                                <h3>Required Skills</h3>
                                <div className="job-detail-tags">
                                    {job.tags.map(tag => (
                                        <span className="tag" key={tag}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {job.notes && (
                            <div className="job-detail-section">
                                <h3>📝 Notes</h3>
                                <p className="job-detail-notes">{job.notes}</p>
                            </div>
                        )}

                        {job.contact && (
                            <div className="job-detail-section">
                                <h3>👤 Contact</h3>
                                <p>{job.contact}</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="job-detail-sidebar">
                        {/* Status */}
                        <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <h3 style={{ marginBottom: 'var(--space-4)' }}>Update Status</h3>
                            <div className="status-buttons">
                                {statusOrder.map(s => (
                                    <button
                                        key={s}
                                        className={`status-btn ${job.status === s ? 'active' : ''}`}
                                        data-status={s}
                                        onClick={() => handleStatusChange(s)}
                                    >
                                        {statusConfig[s].icon} {statusConfig[s].label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Timeline */}
                        {job.timeline && job.timeline.length > 0 && (
                            <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <h3 style={{ marginBottom: 'var(--space-4)' }}>Timeline</h3>
                                <div className="timeline">
                                    {job.timeline.map((item, i) => (
                                        <div className="timeline-item" key={i} data-type={item.type}>
                                            <div className="timeline-dot" />
                                            <div className="timeline-content">
                                                <div className="timeline-event">{item.event}</div>
                                                <div className="timeline-date">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <h3 style={{ marginBottom: 'var(--space-4)' }}>Actions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                <button className="btn btn-secondary" onClick={() => navigate('/cover-letter')} style={{ justifyContent: 'flex-start' }}>
                                    📝 Generate Cover Letter
                                </button>
                                <button className="btn btn-danger" onClick={handleDelete} style={{ justifyContent: 'flex-start' }}>
                                    🗑️ Delete Application
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
