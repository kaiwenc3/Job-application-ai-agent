import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import JobBoardPage from './pages/JobBoardPage';
import JobDetailPage from './pages/JobDetailPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import CoverLetterPage from './pages/CoverLetterPage';
import JobSearchPage from './pages/JobSearchPage';
import OnboardingPage from './pages/OnboardingPage';
import SettingsPage from './pages/SettingsPage';
import ResumeTailorPage from './pages/ResumeTailorPage';
import './App.css';

function AppLayout() {
  const { state } = useApp();
  const location = useLocation();

  // Show onboarding if not completed (except when already on onboarding page)
  if (!state.onboardingComplete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Onboarding page has its own layout (no sidebar)
  if (location.pathname === '/onboarding') {
    return <OnboardingPage />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobBoardPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/cover-letter" element={<CoverLetterPage />} />
          <Route path="/search" element={<JobSearchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/resume-tailor" element={<ResumeTailorPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppProvider>
          <Routes>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="*" element={<AppLayout />} />
          </Routes>
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
