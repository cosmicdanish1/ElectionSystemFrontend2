import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import OngoingElectionsCard from '../components/elections/OngoingElectionsCard';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const VoterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Leaderboard state
  const [elections, setElections] = useState<any[]>([]);
  const [selectedElection, setSelectedElection] = useState<any | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loadingElections, setLoadingElections] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all elections on mount
  useEffect(() => {
    setLoadingElections(true);
    fetch('/api/elections')
      .then(res => res.json())
      .then(data => {
        setElections(data);
        if (data.length > 0) setSelectedElection(data[0]);
        setLoadingElections(false);
      })
      .catch(() => {
        setError('Failed to fetch elections');
        setLoadingElections(false);
      });
  }, []);

  // Fetch leaderboard when selectedElection changes
  useEffect(() => {
    if (!selectedElection) return;
    setLoadingLeaderboard(true);
    fetch(`/api/votes/leaderboard/${selectedElection.electionid}`)
      .then(res => res.json())
      .then(data => {
        setLeaderboard(data);
        setLoadingLeaderboard(false);
      })
      .catch(() => {
        setError('Failed to fetch leaderboard');
        setLoadingLeaderboard(false);
      });
  }, [selectedElection]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Voter Dashboard</h1>
        <p className="text-lg text-gray-600">
          Welcome, {user ? user.name : 'Voter'}!
        </p>
      </div>
      <div className="flex justify-center mb-8">
        <div onClick={() => navigate('/voter-elections')} className="cursor-pointer w-full max-w-md">
          <OngoingElectionsCard>{/* No children */}</OngoingElectionsCard>
        </div>
      </div>
      {/* Leaderboard Card */}
      <div className="max-w-2xl mx-auto mb-12 relative">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Candidate Leaderboard</h2>
          {loadingElections ? (
            <div>Loading elections...</div>
          ) : (
            <select
              className="mb-4 w-full border rounded p-2"
              value={selectedElection?.electionid || ''}
              onChange={e => {
                const eid = e.target.value;
                setSelectedElection(elections.find(el => el.electionid == eid));
              }}
            >
              {elections.map(e => (
                <option key={e.electionid} value={e.electionid}>
                  {e.title} ({e.type} - {e.location_region})
                </option>
              ))}
            </select>
          )}
          {loadingLeaderboard ? (
            <div>Loading leaderboard...</div>
          ) : Array.isArray(leaderboard) ? (
            leaderboard.length === 0 ? (
              <div className="text-gray-500">No candidates or votes found for this election.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-center">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Rank</th>
                      <th className="px-4 py-2">Candidate</th>
                      <th className="px-4 py-2">Party</th>
                      <th className="px-4 py-2">Votes</th>
                    </tr>
                  </thead>
                  <AnimatePresence initial={false}>
                    <tbody>
                      {leaderboard.map((c, idx) => (
                        <motion.tr
                          key={c.cid}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3, delay: idx * 0.07 }}
                          className={idx === 0 ? 'bg-yellow-100 font-bold' : ''}
                        >
                          <td className="px-4 py-2">{idx + 1}</td>
                          <td className="px-4 py-2">{c.name}</td>
                          <td className="px-4 py-2">{c.partyname || 'Independent'}</td>
                          <td className="px-4 py-2">{c.votes}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </AnimatePresence>
                </table>
              </div>
            )
          ) : (
            <div className="text-red-600">Failed to load leaderboard. Please try again later.</div>
          )}
        </div>
      </div>
      {/* Placeholder content for scrolling */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">News & Updates</h2>
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">Update Title {i + 1}</h3>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoterDashboard;
