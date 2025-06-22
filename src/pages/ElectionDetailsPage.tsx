import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ElectionDetails from '../components/elections/ElectionDetails';

const ElectionDetailsPage: React.FC = () => {
  const { electionid } = useParams<{ electionid: string }>();
  const [election, setElection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElection = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/elections/${electionid}`);
        if (!res.ok) throw new Error('Failed to fetch election');
        const data = await res.json();
        setElection(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching election');
      } finally {
        setLoading(false);
      }
    };
    if (electionid) fetchElection();
  }, [electionid]);

  if (loading) return <div>Loading election details...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!election) return <div>Election not found.</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <button
        className="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>
      <ElectionDetails election={election} candidates={election.candidates} onClose={() => navigate(-1)} />
    </div>
  );
};

export default ElectionDetailsPage;
