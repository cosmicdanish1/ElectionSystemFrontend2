import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [votes, setVotes] = useState<any[]>([]);
  const [loadingVotes, setLoadingVotes] = useState(false);
  const [errorVotes, setErrorVotes] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [elections, setElections] = useState<any[]>([]);
  const [loadingElections, setLoadingElections] = useState(false);

  useEffect(() => {
    if (!user?.vid) return;
    setLoadingVotes(true);
    fetch('/api/votes')
      .then(res => res.json())
      .then(data => {
        // Filter votes for this user
        setVotes(data.filter((v: any) => v.voterid === user.vid));
        setLoadingVotes(false);
      })
      .catch(() => {
        setErrorVotes('Failed to fetch voting history');
        setLoadingVotes(false);
      });
  }, [user]);

  useEffect(() => {
    setLoadingCandidates(true);
    fetch('/api/candidates')
      .then(res => res.json())
      .then(data => {
        setCandidates(data);
        setLoadingCandidates(false);
      })
      .catch(() => setLoadingCandidates(false));
  }, []);

  useEffect(() => {
    setLoadingElections(true);
    fetch('/api/elections')
      .then(res => res.json())
      .then(data => {
        setElections(data);
        setLoadingElections(false);
      })
      .catch(() => setLoadingElections(false));
  }, []);

  // Helper to get candidate name by ID
  const getCandidateName = (cid: number) => {
    const candidate = candidates.find((c: any) => c.cid === cid);
    return candidate ? candidate.name : 'Unknown';
  };

  // Helper to get election name by ID
  const getElectionName = (eid: number) => {
    const election = elections.find((e: any) => e.electionid === eid);
    return election ? election.title : 'Unknown';
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {user ? (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {user.vid && (
              <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg" role="alert">
                <p className="font-bold">Successfully Registered!</p>
                <p>You are eligible to vote in elections.</p>
              </div>
            )}
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            {user.gender && <p><strong>Gender:</strong> {user.gender}</p>}
            {user.date_of_birth && <p><strong>Date of Birth:</strong> {user.date_of_birth}</p>}
          </div>
          {/* Voting History Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-2 text-blue-700">Voting History</h2>
            {loadingVotes || loadingCandidates || loadingElections ? (
              <div>Loading voting history...</div>
            ) : errorVotes ? (
              <div className="text-red-600">{errorVotes}</div>
            ) : votes.length === 0 ? (
              <div className="text-gray-500">No voting history found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-center mt-2">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Election ID</th>
                      <th className="px-4 py-2">Election Name</th>
                      <th className="px-4 py-2">Candidate ID</th>
                      <th className="px-4 py-2">Candidate Name</th>
                      <th className="px-4 py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {votes.map((vote, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2">{vote.electionid}</td>
                        <td className="px-4 py-2">{getElectionName(vote.electionid)}</td>
                        <td className="px-4 py-2">{vote.candidateid}</td>
                        <td className="px-4 py-2">{getCandidateName(vote.candidateid)}</td>
                        <td className="px-4 py-2">{vote.timestamp ? new Date(vote.timestamp).toLocaleString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
};

export default ProfilePage; 