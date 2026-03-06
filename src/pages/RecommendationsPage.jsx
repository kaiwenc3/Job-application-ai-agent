import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/Layout/Header';
import '../components/common/common.css';
import './RecommendationsPage.css';

export default function RecommendationsPage() {
    const { state, dispatch } = useApp();
    const [savedIds, setSavedIds] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzed, setAnalyzed] = useState(true);

    const handleSave = (recId) => {
        dispatch({ type: 'SAVE_RECOMMENDATION', payload: recId });
        setSavedIds([...savedIds, recId]);
    };

    const handleRefresh = () => {
        setIsAnalyzing(true);
        setAnalyzed(false);
        setTimeout(() => {
            setIsAnalyzing(false);
            setAnalyzed(true);
        }, 2500);
    };

    return (
        <>
            <Header title="AI Recommendations" subtitle="Powered by AppTrack AI" />
            <div className="recommendations">
                {/* AI Header */}
                <div className="rec-ai-header card">
                    <div className="rec-ai-icon">✨</div>
                    <div className="rec-ai-text">
                        <h2>Smart Job Matches</h2>
                        <p>Our AI analyzes your skills, experience, and preferences to find the best matching opportunities.</p>
                    </div>
                    <button className="btn btn-primary" onClick={handleRefresh} disabled={isAnalyzing}>
                        {isAnalyzing ? '⏳ Analyzing...' : '🔄 Refresh'}
                    </button>
                </div>

                {/* Loading State */}
                {isAnalyzing && (
                    <div className="rec-analyzing">
                        <div className="rec-analyzing-spinner" />
                        <h3>Analyzing your profile...</h3>
                        <p>Matching against 10,000+ open positions</p>
                        <div className="rec-analyzing-steps">
                            <div className="rec-step active">✓ Reading profile</div>
                            <div className="rec-step active">✓ Analyzing skills</div>
                            <div className="rec-step loading">⏳ Matching jobs...</div>
                        </div>
                    </div>
                )}

                {/* Results */}
                {analyzed && !isAnalyzing && (
                    <div className="rec-results stagger-children">
                        <div className="rec-results-header">
                            <h3>Found {state.recommendations.length} matches for you</h3>
                            <span className="rec-profile-badge">Based on your profile as {state.profile.title}</span>
                        </div>
                        {state.recommendations.map((rec, i) => (
                            <div
                                className={`rec-card card card-interactive ${expandedId === rec.id ? 'expanded' : ''}`}
                                key={rec.id}
                            >
                                <div className="rec-card-main" onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}>
                                    <div className="rec-card-left">
                                        <div className="rec-logo" style={{ background: rec.color + '15', color: rec.color }}>
                                            {rec.logo}
                                        </div>
                                        <div className="rec-info">
                                            <div className="rec-role">{rec.role}</div>
                                            <div className="rec-company">{rec.company} · {rec.location}</div>
                                            <div className="rec-meta">
                                                <span>💰 {rec.salary}</span>
                                                <span>🏠 {rec.remote}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rec-card-right">
                                        <div className="rec-score">
                                            <svg viewBox="0 0 36 36" className="rec-score-ring">
                                                <path
                                                    className="rec-score-bg"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                />
                                                <path
                                                    className="rec-score-fill"
                                                    strokeDasharray={`${rec.matchScore}, 100`}
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                />
                                            </svg>
                                            <span className="rec-score-text">{rec.matchScore}%</span>
                                        </div>
                                        <span className="rec-score-label">Match</span>
                                    </div>
                                </div>

                                {expandedId === rec.id && (
                                    <div className="rec-expanded">
                                        <p className="rec-description">{rec.description}</p>
                                        <div className="rec-reasons">
                                            <h4>Why this matches you:</h4>
                                            {rec.matchReasons.map((reason, j) => (
                                                <div className="rec-reason" key={j}>
                                                    <span className={`rec-reason-weight ${reason.weight}`}>
                                                        {reason.weight === 'high' ? '🟢' : reason.weight === 'medium' ? '🟡' : '⚪'}
                                                    </span>
                                                    <strong>{reason.skill}</strong>
                                                    <span className="rec-reason-match">— {reason.match}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="rec-actions">
                                            {savedIds.includes(rec.id) ? (
                                                <button className="btn btn-secondary" disabled>✓ Saved to Board</button>
                                            ) : (
                                                <button className="btn btn-primary" onClick={() => handleSave(rec.id)}>
                                                    📌 Save to Board
                                                </button>
                                            )}
                                            <button className="btn btn-accent">📝 Quick Apply</button>
                                            <button className="btn btn-ghost">🚫 Not Interested</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
