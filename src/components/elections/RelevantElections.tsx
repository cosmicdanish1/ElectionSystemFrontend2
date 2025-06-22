import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Election {
  electionid: number;
  title: string;
  type: string;
  date: string;
  location_region: string;
  status: string;
}

const RelevantElections: React.FC = () => {
  const { user, loading } = useAuth();
  const [elections, setElections] = useState<Election[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  if (loading || fetching) return <div>Loading elections...</div>;
  if (!user) return null;
  if (error) return <div className="text-red-600">{error}</div>;
  if (elections.length === 0) return <div>No elections found.</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">All Elections</h2>
      <ul className="space-y-4">
        {elections.map(election => (
          <li
            key={election.electionid}
            className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer hover:bg-blue-50 transition-colors"
            onClick={() => navigate(`/elections/${election.electionid}`)}
          >
            <div>
              <div className="font-semibold text-lg">{election.title}</div>
              <div className="text-sm text-gray-600">{election.type} | {election.location_region} | {election.date.slice(0, 10)}</div>
              <div className="text-xs text-gray-500">Status: {election.status}</div>
            </div>
            <button
              className="mt-2 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              onClick={e => { e.stopPropagation(); navigate(`/elections/${election.electionid}`); }}
            >
              View & Vote
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelevantElections; 