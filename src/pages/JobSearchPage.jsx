import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sampleSearchResults } from '../data/sampleData';
import Header from '../components/Layout/Header';
import '../components/common/common.css';
import './JobSearchPage.css';

export default function JobSearchPage() {
    const { dispatch } = useApp();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const [remote, setRemote] = useState('all');
    const [savedIds, setSavedIds] = useState([]);
    const [results, setResults] = useState(sampleSearchResults);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setIsSearching(true);
        setTimeout(() => {
            const filtered = sampleSearchResults.filter(job => {
                const matchesQuery = !query || job.role.toLowerCase().includes(query.toLowerCase()) || job.company.toLowerCase().includes(query.toLowerCase());
                const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
                const matchesRemote = remote === 'all' || (remote === 'remote' && job.remote === 'Remote') || (remote === 'hybrid' && job.remote === 'Hybrid') || (remote === 'onsite' && job.remote === 'On-site');
                return matchesQuery && matchesLocation && matchesRemote;
            });
            setResults(filtered);
            setIsSearching(false);
        }, 800);
    };

    const handleSave = (job) => {
        dispatch({
            type: 'ADD_JOB',
            payload: {
                company: job.company,
                role: job.role,
                location: job.location,
                salary: job.salary,
                remote: job.remote,
                logo: job.logo,
                color: job.color,
                description: job.description,
                status: 'saved',
                appliedDate: null,
                notes: '',
                tags: job.tags,
                timeline: [],
            },
        });
        setSavedIds([...savedIds, job.id]);
    };

    const handleQuickApply = (job) => {
        dispatch({
            type: 'ADD_JOB',
            payload: {
                company: job.company,
                role: job.role,
                location: job.location,
                salary: job.salary,
                remote: job.remote,
                logo: job.logo,
                color: job.color,
                description: job.description,
                status: 'applied',
                appliedDate: new Date().toISOString().split('T')[0],
                notes: 'Applied via Quick Apply with auto-filled profile data.',
                tags: job.tags,
                timeline: [{ date: new Date().toISOString().split('T')[0], event: 'Applied (Quick Apply)', type: 'applied' }],
            },
        });
        setSavedIds([...savedIds, job.id]);
    };

    return (
        <>
            <Header title="Job Search" subtitle="Find your next opportunity" />
            <div className="job-search">
                {/* Search Bar */}
                <div className="card search-card animate-fade-in-up">
                    <form className="search-form" onSubmit={handleSearch}>
                        <div className="search-input-group">
                            <span className="search-icon">🔍</span>
                            <input
                                className="search-main-input"
                                placeholder="Job title, company, or keyword..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                        </div>
                        <div className="search-input-group">
                            <span className="search-icon">📍</span>
                            <input
                                className="search-main-input"
                                placeholder="Location..."
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                            />
                        </div>
                        <div className="search-filters">
                            <select className="form-input form-select search-select" value={remote} onChange={e => setRemote(e.target.value)}>
                                <option value="all">All Types</option>
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="onsite">On-site</option>
                            </select>
                        </div>
                        <button className="btn btn-primary btn-lg" type="submit">
                            {isSearching ? '⏳ Searching...' : '🔍 Search'}
                        </button>
                    </form>
                </div>

                {/* Results */}
                <div className="search-results-header">
                    <h3>{results.length} jobs found</h3>
                </div>

                <div className="search-results stagger-children">
                    {results.map(job => (
                        <div className="card card-interactive search-result-card" key={job.id}>
                            <div className="search-result-main">
                                <div className="search-result-logo" style={{ background: job.color + '15', color: job.color }}>
                                    {job.logo}
                                </div>
                                <div className="search-result-info">
                                    <div className="search-result-role">{job.role}</div>
                                    <div className="search-result-company">{job.company}</div>
                                    <div className="search-result-meta">
                                        <span>📍 {job.location}</span>
                                        <span>💰 {job.salary}</span>
                                        <span>🏠 {job.remote}</span>
                                    </div>
                                    <div className="search-result-tags">
                                        {job.tags?.map(tag => (
                                            <span className="tag" key={tag}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="search-result-actions">
                                    {savedIds.includes(job.id) ? (
                                        <button className="btn btn-secondary" disabled>✓ Saved</button>
                                    ) : (
                                        <>
                                            <button className="btn btn-primary" onClick={() => handleQuickApply(job)}>
                                                ⚡ Quick Apply
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => handleSave(job)}>
                                                📌 Save
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <p className="search-result-desc">{job.description}</p>
                            <div className="search-result-posted">Posted {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
