import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/Layout/Header';
import '../components/common/common.css';
import './ResumeTailorPage.css';

const generateTailoredBullets = (profile, jobDesc) => {
    const skills = profile.skills || ['React', 'JavaScript', 'TypeScript'];
    return [
        {
            section: 'Professional Summary',
            original: `Experienced ${profile.title || 'Software Engineer'} with a strong background in building user-facing applications.`,
            tailored: `Results-driven ${profile.title || 'Software Engineer'} with proven expertise in ${skills.slice(0, 3).join(', ')}, specializing in building high-performance, user-centric applications for fast-paced product teams.`,
            reason: 'Added specific technologies and impact-focused language matching job requirements.',
            impact: 'high',
        },
        {
            section: 'Experience',
            original: `Led development of the design system at ${profile.experience?.[0]?.company || 'previous company'}.`,
            tailored: `Architected and shipped a scalable design system adopted by 40+ engineers, reducing UI development time by 35% and ensuring pixel-perfect consistency across 12 product surfaces.`,
            reason: 'Added quantified impact metrics and scope to demonstrate business value.',
            impact: 'high',
        },
        {
            section: 'Experience',
            original: 'Built reusable components and improved application performance.',
            tailored: `Engineered 50+ reusable ${skills[0] || 'React'} components with comprehensive test coverage, improving Core Web Vitals scores by 28% and reducing bundle size by 40%.`,
            reason: 'Quantified achievements and aligned with performance-focused requirements.',
            impact: 'medium',
        },
        {
            section: 'Skills',
            original: skills.join(', '),
            tailored: `${skills.slice(0, 4).join(' • ')} • Design Systems • Performance Optimization • Cross-functional Collaboration • CI/CD`,
            reason: 'Added soft skills and tools mentioned in the job description that you have experience with.',
            impact: 'medium',
        },
        {
            section: 'Education',
            original: `${profile.education?.[0]?.degree || 'B.S. Computer Science'} from ${profile.education?.[0]?.school || 'University'}`,
            tailored: `${profile.education?.[0]?.degree || 'B.S. Computer Science'}, ${profile.education?.[0]?.school || 'University'} — Relevant coursework: HCI, Software Engineering, Data Structures`,
            reason: 'Added relevant coursework to strengthen qualification alignment.',
            impact: 'low',
        },
    ];
};

export default function ResumeTailorPage() {
    const { state } = useApp();
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState(0);
    const [results, setResults] = useState(null);
    const [acceptedIds, setAcceptedIds] = useState([]);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setAnalysisStep(0);
        setResults(null);
        setAcceptedIds([]);

        const steps = [
            () => setAnalysisStep(1),
            () => setAnalysisStep(2),
            () => setAnalysisStep(3),
            () => {
                setResults(generateTailoredBullets(state.profile, jobDescription));
                setIsAnalyzing(false);
                setAnalysisStep(4);
            },
        ];

        steps.forEach((step, i) => setTimeout(step, (i + 1) * 700));
    };

    const handleAccept = (idx) => {
        setAcceptedIds(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    };

    const overallScore = results ? Math.round((results.filter((_, i) => acceptedIds.includes(i)).length / results.length) * 100) : 0;

    return (
        <>
            <Header title="AI Resume Tailor" subtitle="Optimize your resume for any job" />
            <div className="resume-tailor">
                <div className="rt-grid">
                    {/* Input */}
                    <div className="rt-input-side">
                        <div className="card animate-fade-in-up">
                            <div className="cl-ai-badge">
                                <span className="cl-ai-sparkle">🎯</span>
                                <span>Resume Optimization Engine</span>
                            </div>
                            <h2 style={{ marginBottom: 'var(--space-2)' }}>Tailor Your Resume</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-5)' }}>
                                Paste a job description and AI will suggest specific improvements to each section of your resume.
                            </p>

                            <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
                                <label className="form-label">Job Description *</label>
                                <textarea
                                    className="form-input form-textarea"
                                    placeholder="Paste the full job description here..."
                                    value={jobDescription}
                                    onChange={e => setJobDescription(e.target.value)}
                                    style={{ minHeight: '200px' }}
                                />
                            </div>

                            <button
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%' }}
                                onClick={handleAnalyze}
                                disabled={!jobDescription.trim() || isAnalyzing}
                            >
                                {isAnalyzing ? '⏳ Analyzing...' : '🎯 Analyze & Tailor Resume'}
                            </button>

                            {results && (
                                <div className="rt-score-card" style={{ marginTop: 'var(--space-5)' }}>
                                    <div className="rt-score-label">Optimization Progress</div>
                                    <div className="rt-score-bar">
                                        <div className="rt-score-fill" style={{ width: `${overallScore}%` }} />
                                    </div>
                                    <div className="rt-score-text">{acceptedIds.length}/{results.length} suggestions accepted</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Output */}
                    <div className="rt-output-side">
                        {isAnalyzing && (
                            <div className="card rt-analyzing">
                                <div className="cl-gen-spinner" />
                                <h3>Analyzing resume fit...</h3>
                                <div className="cl-gen-steps">
                                    <div className={`cl-gen-step ${analysisStep >= 1 ? 'done' : ''}`}>
                                        {analysisStep >= 1 ? '✓' : '○'} Parsing job requirements
                                    </div>
                                    <div className={`cl-gen-step ${analysisStep >= 2 ? 'done' : ''}`}>
                                        {analysisStep >= 2 ? '✓' : '○'} Comparing with your profile
                                    </div>
                                    <div className={`cl-gen-step ${analysisStep >= 3 ? 'done' : ''}`}>
                                        {analysisStep >= 3 ? '✓' : '○'} Generating tailored suggestions
                                    </div>
                                </div>
                            </div>
                        )}

                        {results && !isAnalyzing && (
                            <div className="rt-results stagger-children">
                                {results.map((item, i) => (
                                    <div className={`card rt-suggestion ${acceptedIds.includes(i) ? 'accepted' : ''}`} key={i}>
                                        <div className="rt-suggestion-header">
                                            <span className="rt-section-badge">{item.section}</span>
                                            <span className={`rt-impact rt-impact-${item.impact}`}>
                                                {item.impact === 'high' ? '🔴' : item.impact === 'medium' ? '🟡' : '🟢'} {item.impact} impact
                                            </span>
                                        </div>

                                        <div className="rt-diff">
                                            <div className="rt-diff-block rt-diff-original">
                                                <div className="rt-diff-label">❌ Current</div>
                                                <p>{item.original}</p>
                                            </div>
                                            <div className="rt-diff-arrow">→</div>
                                            <div className="rt-diff-block rt-diff-tailored">
                                                <div className="rt-diff-label">✅ Tailored</div>
                                                <p>{item.tailored}</p>
                                            </div>
                                        </div>

                                        <div className="rt-reason">
                                            <span className="insight-badge">💡 Why this change</span>
                                            <p>{item.reason}</p>
                                        </div>

                                        <button
                                            className={`btn ${acceptedIds.includes(i) ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                                            onClick={() => handleAccept(i)}
                                        >
                                            {acceptedIds.includes(i) ? '✓ Accepted' : 'Accept Suggestion'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!results && !isAnalyzing && (
                            <div className="card cl-empty">
                                <div className="cl-empty-icon">📄</div>
                                <h3>No analysis yet</h3>
                                <p>Paste a job description to get personalized resume improvement suggestions.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
