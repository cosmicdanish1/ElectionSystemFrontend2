import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Election {
  electionid: number;
  title: string;
  type: string;
  date: string;
  location_region: string;
  status: string;
}

interface Candidate {
  cid: number;
  name: string;
  partyid?: number;
  partyname?: string;
  symbol_url?: string;
}

interface Props {
  election: Election;
  candidates: Candidate[];
  onClose: () => void;
}

const ElectionDetails: React.FC<Props> = ({ election, candidates, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voteStatus, setVoteStatus] = useState<{ voted: boolean; vote?: any } | null>(null);
  const [voting, setVoting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null);
  const [isOver, setIsOver] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  console.log('ElectionDetails component received election prop:', election);

  useEffect(() => {
    const fetchVoteStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        if (user && user.vid && election.electionid) {
          const statusRes = await fetch(`/api/elections/${election.electionid}/vote-status/${user.vid}`);
          const statusData = await statusRes.json();
          setVoteStatus(statusData);
        } else {
          setVoteStatus(null);
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching vote status');
      } finally {
        setLoading(false);
      }
    };
    if (election) fetchVoteStatus();
  }, [election, user]);

  const handleVote = async (candidateid: number) => {
    if (!user) return;
    setVoting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voterid: user.vid || user.voterid || user.id || user.userid,
          electionid: election.electionid,
          candidateid
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to vote');
      setSuccess('Vote cast successfully!');
      setVoteStatus({ voted: true, vote: { candidateid } });
      setTimeout(() => setShowReceipt(true), 600); // Show receipt after animation
    } catch (err: any) {
      setError(err.message || 'Error casting vote');
    } finally {
      setVoting(false);
    }
  };

  // Drag and Drop handlers
  const onDragStart = (candidate: Candidate) => {
    if (voteStatus?.voted) return;
    setDraggedCandidate(candidate);
  };
  const onDragEnd = () => {
    setDraggedCandidate(null);
    setIsOver(false);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!voteStatus?.voted) setIsOver(true);
  };
  const onDragLeave = () => {
    setIsOver(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    if (draggedCandidate && !voteStatus?.voted) {
      handleVote(draggedCandidate.cid);
      setDraggedCandidate(null);
    }
  };

  const votedCandidate = candidates.find(c => c.cid === voteStatus?.vote?.candidateid);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!user || !user.vid) {
    return <div className="text-red-600">You must complete voter registration to vote.</div>;
  }
  if (candidates.length === 0) {
    return <div className="text-center p-4">No candidates found for this election.</div>;
  }

  console.log('[ElectionDetails] Rendering with candidates:', candidates);

  return (
    <div className="bg-white rounded shadow p-6 mt-4">
      <button className="float-right text-gray-500 hover:text-black" onClick={onClose}>&times;</button>
      <h3 className="text-xl font-bold mb-2">{election.title}</h3>
      <div className="mb-4 text-sm text-gray-600">{election.type} | {election.location_region} | {election.date.slice(0, 10)}</div>
      <h4 className="font-semibold mb-2">Candidates</h4>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Candidate Cards */}
        <div className="flex flex-row gap-4 flex-1">
          {candidates.map(candidate => (
            <div
              key={candidate.cid}
              className={`w-32 h-48 bg-blue-100 rounded-lg shadow flex flex-col items-center justify-center cursor-move border-2 ${voteStatus?.voted ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500'} ${voteStatus?.vote?.candidateid === candidate.cid ? 'border-green-500' : ''}`}
              draggable={!voteStatus?.voted}
              onDragStart={() => onDragStart(candidate)}
              onDragEnd={onDragEnd}
            >
              {/* Optionally show symbol_url as image */}
              {candidate.symbol_url && (
                <img src={candidate.symbol_url} alt="symbol" className="w-12 h-12 mb-2 object-contain" />
              )}
              <div className="font-bold text-center">{candidate.name}</div>
              <div className="text-xs text-gray-600 text-center mt-1">{candidate.partyname || 'Independent'}</div>
              {voteStatus?.vote?.candidateid === candidate.cid && (
                <div className="mt-2 text-green-600 font-bold">Your Vote</div>
              )}
            </div>
          ))}
        </div>
        {/* Drop Area */}
        <div
          className={`w-56 h-48 flex items-center justify-center rounded-lg border-4 transition-colors duration-200 ${isOver ? 'bg-green-300 border-green-600' : 'bg-green-100 border-green-400'} ${voteStatus?.voted ? 'opacity-50' : ''}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <span className="text-lg font-semibold text-gray-700 select-none">{voteStatus?.voted ? 'Vote Registered' : 'Drag & Drop To Vote'}</span>
        </div>
      </div>
      {voteStatus?.voted && (
        <div className="text-green-700 font-semibold mb-2 mt-4">You have already voted in this election.</div>
      )}
      {error && <div className="text-red-600 font-semibold">{error}</div>}
      {success && <div className="text-green-600 font-semibold">{success}</div>}
      {showReceipt && (
        <div className="text-green-700 font-semibold mt-4">
          Receipt sent to your email. Thank you for voting!
        </div>
      )}
    </div>
  );
};

export default ElectionDetails; 