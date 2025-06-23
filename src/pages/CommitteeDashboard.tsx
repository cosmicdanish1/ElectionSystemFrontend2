import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CandidateManagement from '../components/admin/CandidateManagement';
import { motion, AnimatePresence } from 'framer-motion';

const CommitteeDashboard = () => {
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
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Committee Dashboard</h1>
      <div className="flex justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Election Management</h2>
          <p className="text-gray-600 mb-6">Create new elections and add candidates to existing ones.</p>
          <button
            className="w-full mb-4 px-4 py-2 rounded-md bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition"
            onClick={() => navigate('/create-election')}
          >
            Create New Election
          </button>
          <button
            className="w-full px-4 py-2 rounded-md bg-green-600 text-white font-bold shadow hover:bg-green-700 transition"
            onClick={() => navigate('/add-candidate')}
          >
            Add Candidate to Election
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-12">
        <motion.div
          className="max-w-2xl mx-auto mb-12 relative w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4 text-blue-700">Candidate Leaderboard</h2>
            {loadingElections ? (
              <div>Loading elections...</div>
            ) : (
              <motion.select
                className="mb-4 w-full border rounded p-2"
                value={selectedElection?.electionid || ''}
                onChange={e => {
                  const eid = e.target.value;
                  setSelectedElection(elections.find(el => el.electionid == eid));
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {elections.map(e => (
                  <option key={e.electionid} value={e.electionid}>
                    {e.title} ({e.type} - {e.location_region})
                  </option>
                ))}
              </motion.select>
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
                            className={idx === 0 ? 'bg-yellow-100 font-bold animate-pulse' : ''}
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
          </motion.div>
        </motion.div>
      </div>
      <div className="flex justify-center mt-12">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Candidate Management</h2>
          <CandidateManagement />
        </div>
      </div>
    </div>
  );
};

export default CommitteeDashboard; 