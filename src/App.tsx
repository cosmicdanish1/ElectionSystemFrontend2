import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { SignupFormDemo } from './pages/SignUp';
import { LoginFormDemo as LoginPage } from './pages/LoginPage';
import VoterDashboard from './pages/VoterDashboard';
import CommitteeDashboard from './pages/CommitteeDashboard';
import { NavbarMain } from './components/layout/NavbarMain';
import './App.css';
import { useState, useRef, useEffect } from 'react';
import ProfilePage from './pages/ProfilePage';
import RegistrationPage from './pages/RegistrationPage';
import ElectionDetailsPage from './pages/ElectionDetailsPage';
import VoterElectionsPage from './pages/VoterElectionsPage';
import CreateElectionPage from './pages/CreateElectionPage';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state && location.state.background;
  const isModal =
    (location.pathname === '/login' || location.pathname === '/signup') &&
    background && background.pathname === '/';
  const modal = location.pathname === '/login' ? 'login' : location.pathname === '/signup' ? 'signup' : null;

  // Modal close handler
  const handleCloseModal = () => {
    if (background) {
      navigate(background.pathname, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="App">
      <NavbarMain />
      <div className="main-content pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={isModal ? background?.pathname : location.pathname}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <Routes location={isModal ? background : location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<SignupFormDemo />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/voter-dashboard" element={<VoterDashboard />} />
              <Route path="/committee-dashboard" element={<CommitteeDashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/registration" element={<RegistrationPage />} />
              <Route path="/voter-elections" element={<VoterElectionsPage />} />
              <Route path="/elections/:electionid" element={<ElectionDetailsPage />} />
              <Route path="/create-election" element={<CreateElectionPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
        {/* Modal overlay for login/signup if routed from landing page */}
        {isModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg p-8 w-[350px] max-w-full mx-auto">
                {modal === 'login' && <LoginPage />}
                {modal === 'signup' && <SignupFormDemo />}
              </div>
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 text-white text-2xl"
                style={{ top: 8, right: 16 }}
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
