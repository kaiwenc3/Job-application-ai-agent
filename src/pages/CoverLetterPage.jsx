import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/Layout/Header';
import '../components/common/common.css';
import './CoverLetterPage.css';

const tones = [
    { id: 'professional', label: 'Professional', icon: '👔', desc: 'Formal and polished' },
    { id: 'conversational', label: 'Conversational', icon: '💬', desc: 'Friendly and personable' },
    { id: 'bold', label: 'Bold', icon: '🔥', desc: 'Confident and impactful' },
];

const generateCoverLetter = (profile, jobDesc, tone) => {
    const name = `${profile.firstName} ${profile.lastName}`;
    const toneStyle = tone === 'bold' ? 'dynamic and results-driven' : tone === 'conversational' ? 'approachable and genuine' : 'professional and articulate';

    return `Dear Hiring Manager,

I am writing to express my strong interest in the position described in your job posting. As a ${toneStyle} ${profile.title} with extensive experience in ${profile.skills?.slice(0, 3).join(', ')}, I am confident in my ability to make a meaningful contribution to your team.

In my current role at ${profile.experience?.[0]?.company || 'my company'}, I have ${profile.experience?.[0]?.description || 'developed significant expertise in my field'}. This experience has equipped me with a deep understanding of modern development practices and a passion for creating exceptional user experiences.

${tone === 'bold' ? 'I don\'t just write code — I craft solutions that drive real business outcomes. ' : ''}What excites me most about this opportunity is the chance to leverage my expertise in ${profile.skills?.slice(0, 2).join(' and ')} to tackle new challenges and grow alongside your team.${tone === 'conversational' ? ' I genuinely believe that great products come from passionate teams, and I\'d love to be part of yours.' : ''}

My technical toolkit includes ${profile.skills?.slice(0, 6).join(', ')}, which I have used to deliver impactful projects throughout my career. I am particularly proud of my work at ${profile.experience?.[0]?.company || 'my previous company'}, where I ${profile.experience?.[0]?.description?.split('.')[0]?.toLowerCase() || 'delivered key features'}.

I would welcome the opportunity to discuss how my background, skills, and enthusiasm can contribute to your team's success. Thank you for considering my application.

Best regards,
${name}
${profile.email}
${profile.phone}`;
};

export default function CoverLetterPage() {
    const { state } = useApp();
    const [jobDescription, setJobDescription] = useState('');
    const [selectedTone, setSelectedTone] = useState('professional');
    const [coverLetter, setCoverLetter] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState(0);
    const [copied, setCopied] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setGenerationStep(0);
        setCoverLetter('');

        const steps = [
            () => setGenerationStep(1),
            () => setGenerationStep(2),
            () => setGenerationStep(3),
            () => {
                setCoverLetter(generateCoverLetter(state.profile, jobDescription, selectedTone));
                setIsGenerating(false);
                setGenerationStep(4);
            },
        ];

        steps.forEach((step, i) => setTimeout(step, (i + 1) * 800));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(coverLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <Header title="AI Cover Letter" subtitle="Generate tailored cover letters" />
            <div className="cover-letter-page">
                <div className="cl-grid">
                    {/* Input Side */}
                    <div className="cl-input-side">
                        <div className="card animate-fade-in-up">
                            <div className="cl-ai-badge">
                                <span className="cl-ai-sparkle">✨</span>
                                <span>Powered by AppTrack AI</span>
                            </div>
                            <h2 style={{ marginBottom: 'var(--space-2)' }}>Generate Cover Letter</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-6)' }}>
                                Paste a job description and we'll create a personalized cover letter using your profile data.
                            </p>

                            <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
                                <label className="form-label">Job Description *</label>
                                <textarea
                                    className="form-input form-textarea"
                                    placeholder="Paste the job description here..."
                                    value={jobDescription}
                                    onChange={e => setJobDescription(e.target.value)}
                                    style={{ minHeight: '180px' }}
                                />
                            </div>

                            <div style={{ marginBottom: 'var(--space-5)' }}>
                                <label className="form-label" style={{ marginBottom: 'var(--space-3)', display: 'block' }}>Tone & Style</label>
                                <div className="tone-selector">
                                    {tones.map(tone => (
                                        <button
                                            key={tone.id}
                                            className={`tone-option ${selectedTone === tone.id ? 'active' : ''}`}
                                            onClick={() => setSelectedTone(tone.id)}
                                        >
                                            <span className="tone-icon">{tone.icon}</span>
                                            <span className="tone-label">{tone.label}</span>
                                            <span className="tone-desc">{tone.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%' }}
                                onClick={handleGenerate}
                                disabled={!jobDescription.trim() || isGenerating}
                            >
                                {isGenerating ? '⏳ Generating...' : '✨ Generate Cover Letter'}
                            </button>
                        </div>
                    </div>

                    {/* Output Side */}
                    <div className="cl-output-side">
                        {isGenerating && (
                            <div className="card cl-generating">
                                <div className="cl-gen-spinner" />
                                <h3>AI is crafting your letter...</h3>
                                <div className="cl-gen-steps">
                                    <div className={`cl-gen-step ${generationStep >= 1 ? 'done' : ''}`}>
                                        {generationStep >= 1 ? '✓' : '○'} Analyzing job requirements
                                    </div>
                                    <div className={`cl-gen-step ${generationStep >= 2 ? 'done' : ''}`}>
                                        {generationStep >= 2 ? '✓' : '○'} Matching your experience
                                    </div>
                                    <div className={`cl-gen-step ${generationStep >= 3 ? 'done' : ''}`}>
                                        {generationStep >= 3 ? '✓' : '○'} Writing personalized content
                                    </div>
                                </div>
                            </div>
                        )}

                        {coverLetter && !isGenerating && (
                            <div className="card cl-result animate-scale-in">
                                <div className="cl-result-header">
                                    <h3>📝 Your Cover Letter</h3>
                                    <div className="cl-result-actions">
                                        <button className="btn btn-sm btn-secondary" onClick={handleCopy}>
                                            {copied ? '✓ Copied!' : '📋 Copy'}
                                        </button>
                                        <button className="btn btn-sm btn-secondary">📥 Download</button>
                                    </div>
                                </div>
                                <div className="cl-result-meta">
                                    <span className="badge badge-applied">Tone: {tones.find(t => t.id === selectedTone)?.label}</span>
                                    <span className="cl-word-count">{coverLetter.split(' ').length} words</span>
                                </div>
                                <div className="cl-letter-content">
                                    {coverLetter.split('\n').map((line, i) => (
                                        <p key={i}>{line || <br />}</p>
                                    ))}
                                </div>
                                <div className="cl-result-footer">
                                    <button className="btn btn-ghost" onClick={handleGenerate}>🔄 Regenerate</button>
                                </div>
                            </div>
                        )}

                        {!coverLetter && !isGenerating && (
                            <div className="card cl-empty">
                                <div className="cl-empty-icon">📝</div>
                                <h3>No cover letter yet</h3>
                                <p>Paste a job description and click Generate to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
