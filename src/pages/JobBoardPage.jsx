import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { statusConfig } from '../data/sampleData';
import Header from '../components/Layout/Header';
import '../components/common/common.css';
import './JobBoardPage.css';

const statusOrder = ['saved', 'applied', 'interview', 'offer', 'rejected'];

export default function JobBoardPage() {
    const { state, dispatch } = useApp();
    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);
    const [newJob, setNewJob] = useState({ company: '', role: '', location: '', salary: '', status: 'saved', logo: '💼', color: '#6366f1', tags: [] });
    const [tagInput, setTagInput] = useState('');

    // V2: Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // V2: Filter & sort logic
    const filteredJobs = useMemo(() => {
        let result = [...state.jobs];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(j =>
                j.company?.toLowerCase().includes(q) ||
                j.role?.toLowerCase().includes(q) ||
                j.tags?.some(t => t.toLowerCase().includes(q))
            );
        }

        if (filterStatus !== 'all') {
            result = result.filter(j => j.status === filterStatus);
        }

        if (sortBy === 'newest') {
            result.sort((a, b) => (b.id || 0) - (a.id || 0));
        } else if (sortBy === 'company') {
            result.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
        } else if (sortBy === 'salary') {
            result.sort((a, b) => {
                const sa = parseInt((a.salary || '').replace(/[^0-9]/g, '')) || 0;
                const sb = parseInt((b.salary || '').replace(/[^0-9]/g, '')) || 0;
                return sb - sa;
            });
        }

        return result;
    }, [state.jobs, searchQuery, filterStatus, sortBy]);

    const columns = statusOrder.map(status => ({
        status,
        ...statusConfig[status],
        jobs: filteredJobs.filter(j => j.status === status),
    }));

    const activeFilterCount = (searchQuery ? 1 : 0) + (filterStatus !== 'all' ? 1 : 0);

    const handleAddJob = (e) => {
        e.preventDefault();
        dispatch({
            type: 'ADD_JOB',
            payload: {
                ...newJob,
                appliedDate: newJob.status !== 'saved' ? new Date().toISOString().split('T')[0] : null,
                description: '',
                notes: '',
                timeline: newJob.status !== 'saved' ? [{ date: new Date().toISOString().split('T')[0], event: 'Applied', type: 'applied' }] : [],
            },
        });
        setShowAddModal(false);
        setNewJob({ company: '', role: '', location: '', salary: '', status: 'saved', logo: '💼', color: '#6366f1', tags: [] });
    };

    const handleStatusChange = (jobId, newStatus) => {
        dispatch({ type: 'UPDATE_JOB_STATUS', payload: { id: jobId, status: newStatus } });
    };

    const addTag = () => {
        if (tagInput.trim() && !newJob.tags.includes(tagInput.trim())) {
            setNewJob({ ...newJob, tags: [...newJob.tags, tagInput.trim()] });
            setTagInput('');
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setFilterStatus('all');
        setSortBy('newest');
    };

    return (
        <>
            <Header title="Job Board" subtitle={`${state.jobs.length} applications`} />
            <div className="jobboard">
                {/* V2: Toolbar with filters */}
                <div className="jobboard-toolbar">
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                        ➕ Add Application
                    </button>
                    <div className="jb-filters">
                        <div className="jb-search-wrap">
                            <span className="jb-search-icon">🔍</span>
                            <input
                                className="jb-search-input"
                                placeholder="Search jobs, companies, skills..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="jb-search-clear" onClick={() => setSearchQuery('')}>✕</button>
                            )}
                        </div>
                        <div className="jb-filter-tabs">
                            <button
                                className={`jb-filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('all')}
                            >All</button>
                            {statusOrder.map(s => (
                                <button
                                    key={s}
                                    className={`jb-filter-tab ${filterStatus === s ? 'active' : ''}`}
                                    onClick={() => setFilterStatus(s)}
                                >
                                    {statusConfig[s].icon} {statusConfig[s].label}
                                </button>
                            ))}
                        </div>
                        <select
                            className="form-input form-select jb-sort-select"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                        >
                            <option value="newest">Sort: Newest</option>
                            <option value="company">Sort: Company A-Z</option>
                            <option value="salary">Sort: Highest Salary</option>
                        </select>
                        {activeFilterCount > 0 && (
                            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                                ✕ Clear ({activeFilterCount})
                            </button>
                        )}
                    </div>
                </div>

                <div className="kanban">
                    {columns.map(col => (
                        <div className="kanban-column" key={col.status}>
                            <div className="kanban-column-header">
                                <div className="kanban-column-title">
                                    <span>{col.icon}</span>
                                    <span>{col.label}</span>
                                    <span className="kanban-count">{col.jobs.length}</span>
                                </div>
                            </div>
                            <div className="kanban-cards">
                                {col.jobs.map(job => (
                                    <div
                                        className="kanban-card"
                                        key={job.id}
                                        onClick={() => navigate(`/jobs/${job.id}`)}
                                    >
                                        <div className="kanban-card-header">
                                            <div className="kanban-card-logo" style={{ background: job.color + '15', color: job.color }}>
                                                {job.logo}
                                            </div>
                                            <div className="kanban-card-company">{job.company}</div>
                                        </div>
                                        <div className="kanban-card-role">{job.role}</div>
                                        <div className="kanban-card-meta">
                                            <span>📍 {job.location}</span>
                                            {job.salary && <span>💰 {job.salary}</span>}
                                        </div>
                                        {job.tags && job.tags.length > 0 && (
                                            <div className="kanban-card-tags">
                                                {job.tags.slice(0, 3).map(tag => (
                                                    <span className="tag" key={tag}>{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="kanban-card-actions" onClick={e => e.stopPropagation()}>
                                            <select
                                                className="kanban-status-select"
                                                value={job.status}
                                                onChange={(e) => handleStatusChange(job.id, e.target.value)}
                                                aria-label="Change status"
                                            >
                                                {statusOrder.map(s => (
                                                    <option key={s} value={s}>{statusConfig[s].label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                                {col.jobs.length === 0 && (
                                    <div className="kanban-empty">No jobs here yet</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Job Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Add New Application</h2>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleAddJob}>
                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                <div className="form-group">
                                    <label className="form-label">Company *</label>
                                    <input className="form-input" required value={newJob.company} onChange={e => setNewJob({ ...newJob, company: e.target.value })} placeholder="e.g. Google" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Role *</label>
                                    <input className="form-input" required value={newJob.role} onChange={e => setNewJob({ ...newJob, role: e.target.value })} placeholder="e.g. Frontend Engineer" />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                    <div className="form-group">
                                        <label className="form-label">Location</label>
                                        <input className="form-input" value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} placeholder="e.g. San Francisco, CA" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Salary Range</label>
                                        <input className="form-input" value={newJob.salary} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} placeholder="e.g. $150k - $200k" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select className="form-input form-select" value={newJob.status} onChange={e => setNewJob({ ...newJob, status: e.target.value })}>
                                        {statusOrder.map(s => (
                                            <option key={s} value={s}>{statusConfig[s].label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Skills / Tags</label>
                                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                        <input className="form-input" style={{ flex: 1 }} value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Add a tag" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                                        <button type="button" className="btn btn-secondary" onClick={addTag}>Add</button>
                                    </div>
                                    {newJob.tags.length > 0 && (
                                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
                                            {newJob.tags.map(tag => (
                                                <span className="tag" key={tag} onClick={() => setNewJob({ ...newJob, tags: newJob.tags.filter(t => t !== tag) })} style={{ cursor: 'pointer' }}>{tag} ✕</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Add Application</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
