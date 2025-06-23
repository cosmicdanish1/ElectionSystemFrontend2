import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Election {
  electionid: number;
  title: string;
  type: string;
  date: string;
  location_region: string;
  status: string;
}

const TABS = ['Nagar', 'Lok Sabha', 'Vidhan Sabha'];

const RelevantElections: React.FC = () => {
  const { user, loading } = useAuth();
  const [elections, setElections] = useState<Election[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('Nagar');
  const navigate = useNavigate();

  console.log('RelevantElections user:', user, 'loading:', loading);

  useEffect(() => {
    if (loading) return;
    const fetchElections = async () => {
      setFetching(true);
      setError(null);
      try {
        const res = await fetch(`/api/elections`);
        if (!res.ok) throw new Error('Failed to fetch elections');
        const data = await res.json();
        console.log('Fetched elections:', data);
        setElections(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching elections');
      } finally {
        setFetching(false);
      }
    };
    fetchElections();
  }, [loading]);

  // Filter elections by selected tab/type
  const filteredElections = elections.filter(e => e.type === selectedTab);

  if (loading || fetching) return <div>Loading elections...</div>;
  if (!user) return null;
  if (error) return <div className="text-red-600">{error}</div>;
  if (elections.length === 0) return <div>No elections found.</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">All Elections</h2>
      <div className="flex gap-4 mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`relative px-4 py-2 rounded font-semibold border-b-2 transition-colors ${selectedTab === tab ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 bg-gray-100 hover:bg-blue-100'}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
            {selectedTab === tab && (
              <motion.div layoutId="tab-underline" className="absolute left-0 right-0 bottom-0 h-1 bg-blue-600 rounded" layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
            )}
          </button>
        ))}
      </div>
      <motion.div
        key={selectedTab}
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence initial={false}>
          {filteredElections.map((election, idx) => (
            <motion.div
              key={election.electionid}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4, delay: idx * 0.08, type: 'spring', stiffness: 120 }}
              className="bg-white rounded shadow-lg hover:shadow-2xl transition-shadow flex flex-col items-center justify-between cursor-pointer p-3"
              onClick={() => navigate(`/elections/${election.electionid}`)}
            >
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="font-semibold text-lg text-center mb-2">{election.title}</div>
                <div className="text-sm text-gray-600 text-center mb-1">
                  {election.type} | {election.location_region}
                </div>
                <div className="text-xs text-gray-500 text-center mb-2">{election.date.slice(0, 10)}</div>
                <div className="text-xs text-gray-500 text-center">Status: {election.status}</div>
              </div>
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full"
                onClick={e => {
                  e.stopPropagation();
                  navigate(`/elections/${election.electionid}`);
                }}
              >
                View & Vote
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RelevantElections;
