import { createContext, useContext, useReducer, useEffect } from 'react';
import { sampleJobs, sampleProfile, sampleRecommendations } from '../data/sampleData';

const AppContext = createContext();

const loadFromStorage = (key, fallback) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
};

const initialState = {
    jobs: loadFromStorage('apptrack_jobs', sampleJobs),
    profile: loadFromStorage('apptrack_profile', sampleProfile),
    recommendations: sampleRecommendations,
    onboardingComplete: loadFromStorage('apptrack_onboarding', false),
    notifications: [],
};

function appReducer(state, action) {
    switch (action.type) {
        case 'ADD_JOB': {
            const newJobs = [...state.jobs, { ...action.payload, id: Date.now().toString() }];
            return { ...state, jobs: newJobs };
        }
        case 'UPDATE_JOB': {
            const updatedJobs = state.jobs.map(job =>
                job.id === action.payload.id ? { ...job, ...action.payload } : job
            );
            return { ...state, jobs: updatedJobs };
        }
        case 'DELETE_JOB': {
            const filteredJobs = state.jobs.filter(job => job.id !== action.payload);
            return { ...state, jobs: filteredJobs };
        }
        case 'UPDATE_JOB_STATUS': {
            const statusJobs = state.jobs.map(job =>
                job.id === action.payload.id ? { ...job, status: action.payload.status } : job
            );
            return { ...state, jobs: statusJobs };
        }
        case 'UPDATE_PROFILE': {
            return { ...state, profile: { ...state.profile, ...action.payload } };
        }
        case 'COMPLETE_ONBOARDING': {
            return { ...state, onboardingComplete: true };
        }
        case 'SAVE_RECOMMENDATION': {
            const rec = state.recommendations.find(r => r.id === action.payload);
            if (rec) {
                const newJob = {
                    id: Date.now().toString(),
                    company: rec.company,
                    role: rec.role,
                    location: rec.location,
                    salary: rec.salary,
                    remote: rec.remote,
                    logo: rec.logo,
                    color: rec.color,
                    description: rec.description,
                    status: 'saved',
                    appliedDate: null,
                    notes: '',
                    tags: rec.matchReasons.map(r => r.skill),
                    timeline: [],
                };
                return { ...state, jobs: [...state.jobs, newJob] };
            }
            return state;
        }
        case 'ADD_NOTIFICATION': {
            return { ...state, notifications: [action.payload, ...state.notifications].slice(0, 10) };
        }
        case 'RESET_DATA': {
            localStorage.removeItem('apptrack_jobs');
            localStorage.removeItem('apptrack_profile');
            localStorage.removeItem('apptrack_onboarding');
            return {
                ...state,
                jobs: sampleJobs,
                profile: sampleProfile,
                onboardingComplete: false,
            };
        }
        default:
            return state;
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('apptrack_jobs', JSON.stringify(state.jobs));
    }, [state.jobs]);

    useEffect(() => {
        localStorage.setItem('apptrack_profile', JSON.stringify(state.profile));
    }, [state.profile]);

    useEffect(() => {
        localStorage.setItem('apptrack_onboarding', JSON.stringify(state.onboardingComplete));
    }, [state.onboardingComplete]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
}
