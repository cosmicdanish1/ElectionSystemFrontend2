import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { SignupFormDemo } from './pages/SignUp';
import { LoginFormDemo as LoginPage } from './pages/LoginPage';
import VoterDashboard from './pages/VoterDashboard';
import CommitteeDashboard from './pages/CommitteeDashboard';
import { NavbarMain } from './components/layout/NavbarMain';
import './App.css';
import { useState } from 'react';
import ProfilePage from './pages/ProfilePage';
import RegistrationPage from './pages/RegistrationPage';
import ElectionDetailsPage from './pages/ElectionDetailsPage';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const isHomePage = location.pathname === '/';

  return (
    <div className="App">
      <NavbarMain onLoginClick={handleLoginClick} />
      {isHomePage}

      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative">
            <LoginPage />
            <button
              onClick={handleCloseLogin}
              className="absolute top-2 right-2 text-white"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="main-content pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupFormDemo />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/voter-dashboard" element={<VoterDashboard />} />
          <Route path="/committee-dashboard" element={<CommitteeDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/elections/:electionid" element={<ElectionDetailsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
