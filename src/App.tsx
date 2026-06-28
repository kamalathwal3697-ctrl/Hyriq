import React from 'react';
import { AppStateProvider, useAppState } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { CandidateDashboard } from './components/CandidateDashboard';
import { RecruiterDashboard } from './components/RecruiterDashboard';
import { AuthPage } from './components/AuthPage';
import './App.css';

const AppContent: React.FC = () => {
  const { perspective, setPerspective, token, login, signup, logout } = useAppState();

  const renderMainContent = () => {
    if (perspective === 'visitor') {
      return <LandingPage />;
    }

    // Require authentication for candidate/recruiter workspaces
    if (!token) {
      return <AuthPage onLogin={login} onSignup={signup} />;
    }

    // Authenticated views
    if (perspective === 'candidate') {
      return <CandidateDashboard />;
    }

    if (perspective === 'recruiter') {
      return <RecruiterDashboard />;
    }

    return <LandingPage />;
  };

  return (
    <div className="app-container">
      <Navbar />
      
      {/* Mobile Top Branding Bar */}
      <div className="mobile-header-bar" style={{
        position: 'sticky',
        top: 0,
        height: '56px',
        background: 'rgba(9, 11, 16, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1001,
        padding: '0 16px'
      }}>
        <div 
          onClick={() => setPerspective('visitor')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <img src="/logo.png" alt="Hyriq Logo" style={{ width: '30px', height: '30px', borderRadius: '6px', objectFit: 'cover' }} />
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit' }}>Hyriq</span>
        </div>

        {/* APK & Session Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a 
            href="/hyriq.apk" 
            download="hyriq.apk"
            style={{
              background: 'rgba(249, 115, 22, 0.1)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              color: '#f97316',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            APK 📱
          </a>

          {!token ? (
            <button 
              onClick={() => setPerspective('candidate')}
              style={{
                background: 'var(--tech-orange)',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 750,
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
          ) : (
            <button 
              onClick={logout}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'var(--text-secondary)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
      
      <main style={{ flex: 1 }}>
        {renderMainContent()}
      </main>

      {/* Modern Gen-Z Minimalist Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '32px 0',
        textAlign: 'center',
        background: 'rgba(5, 3, 10, 0.4)',
        marginTop: 'auto'
      }}>
        <div className="container">
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500 }}>
            Hyriq © {new Date().getFullYear()} • Find Your Vibe. Land Your Career.
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.15)', fontSize: '11px', marginTop: '6px' }}>
            Zero resume spam, zero ghost jobs. Real-time direct chat for modern workplaces.
          </p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}

export default App;
