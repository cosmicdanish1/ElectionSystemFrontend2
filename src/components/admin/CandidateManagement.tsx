import React, { useState, useEffect } from 'react';
import CandidateForm from './CandidateForm';

const CandidateManagement = () => {
  const [elections, setElections] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await fetch('/api/elections');
        const data = await res.json();
        setElections(data);
        if (data.length > 0) {
          setActiveTab(data[0].electionid);
        }
      } catch (error) {
        console.error("Failed to fetch elections:", error);
      }
    };
    fetchElections();
  }, []);

  const fetchCandidates = async (electionId) => {
    if (electionId === null) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/candidates/by-election/${electionId}`);
      const data = await res.json();
      setCandidates(data);
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      setCandidates([]); // Clear candidates on error
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCandidates(activeTab);
  }, [activeTab]);

  const handleAddCandidate = () => {
    setEditingCandidate(null);
    setIsFormOpen(true);
  };

  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate);
    setIsFormOpen(true);
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await fetch(`/api/candidates/${candidateId}`, { method: 'DELETE' });
        fetchCandidates(activeTab); // Refresh candidates list
      } catch (error) {
        console.error("Failed to delete candidate:", error);
      }
    }
  };

  const handleSaveCandidate = async (candidateData) => {
    const url = editingCandidate ? `/api/candidates/${editingCandidate.cid}` : '/api/candidates';
    const method = editingCandidate ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        body: candidateData,
      });
      setIsFormOpen(false);
      fetchCandidates(activeTab); // Refresh candidates list
    } catch (error) {
      console.error("Failed to save candidate:", error);
    }
  };

  return (
    <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        {/* Main Tabs */}
        <div className="flex space-x-2">
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium">Committee</button>
            <button className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">Candidates</button>
        </div>
      </div>
      
      {/* Sub Tabs for Elections */}
      <div className="flex justify-between items-center bg-gray-100 p-2 rounded-t-lg border-b border-gray-200">
        <div className="flex space-x-2">
            {elections.map((election) => (
                <button
                key={election.electionid}
                onClick={() => setActiveTab(election.electionid)}
                className={`px-4 py-1 text-sm rounded-md ${
                    activeTab === election.electionid
                    ? 'bg-gray-300 text-gray-900 font-semibold'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                >
                {election.title}
                </button>
            ))}
        </div>
        <button onClick={handleAddCandidate} className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-1 text-sm rounded-md border border-gray-300">
            Add Candidate
        </button>
      </div>

      {/* Candidate Table */}
      <div className="overflow-x-auto bg-white">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">Sr</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Party</th>
              <th scope="col" className="px-6 py-3">Place</th>
              <th scope="col" className="px-6 py-3">Options</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center p-4">Loading candidates...</td></tr>
            ) : candidates.length > 0 ? (
              candidates.map((candidate, index) => (
                <tr key={candidate.cid} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{candidate.name}</td>
                  <td className="px-6 py-4">{candidate.partyname || 'Independent'}</td>
                  <td className="px-6 py-4">{candidate.place}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button onClick={() => handleEditCandidate(candidate)} className="font-medium text-blue-600 hover:underline">Edit</button>
                    <span>/</span>
                    <button onClick={() => handleDeleteCandidate(candidate.cid)} className="font-medium text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
                <tr><td colSpan="5" className="text-center p-4">No candidates found for this election.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <CandidateForm
          candidate={editingCandidate}
          electionId={activeTab}
          onSave={handleSaveCandidate}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default CandidateManagement; 