import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CandidateForm from './CandidateForm';

const TABS = ['Nagar', 'Lok Sabha', 'Vidhan Sabha'];

const CandidateManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('Nagar');
  const [elections, setElections] = useState<any[]>([]);
  const [selectedElection, setSelectedElection] = useState<any | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loadingElections, setLoadingElections] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  // Fetch elections when tab changes
  useEffect(() => {
    setSelectedElection(null);
    setCandidates([]);
    setLoadingElections(true);
    setError(null);
    fetch(`/api/elections`)
      .then(res => res.json())
      .then(data => {
        setElections(data.filter((e: any) => e.type === selectedTab));
        setLoadingElections(false);
      })
      .catch(err => {
        setError('Failed to fetch elections');
        setLoadingElections(false);
      });
  }, [selectedTab]);

  // Fetch candidates when election changes
  useEffect(() => {
    if (!selectedElection) return;
    setLoadingCandidates(true);
    setError(null);
    fetch(`/api/candidates?electionid=${selectedElection.electionid}`)
      .then(res => res.json())
      .then(data => {
        setCandidates(data);
        setLoadingCandidates(false);
      })
      .catch(err => {
        setError('Failed to fetch candidates');
        setLoadingCandidates(false);
      });
  }, [selectedElection]);

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
        fetchCandidates(selectedElection.electionid); // Refresh candidates list
      } catch (error) {
        console.error("Failed to delete candidate:", error);
      }
    }
  };

  const handleSaveCandidate = async (candidateData) => {
    // Append electionid for new candidates
    if (!editingCandidate && selectedElection) {
      candidateData.append('electionid', selectedElection.electionid);
    }
    const url = editingCandidate ? `/api/candidates/${editingCandidate.cid}` : '/api/candidates';
    const method = editingCandidate ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        body: candidateData,
      });
      setIsFormOpen(false);
      fetchCandidates(selectedElection.electionid); // Refresh candidates list
    } catch (error) {
      console.error("Failed to save candidate:", error);
    }
  };

  return (
    <div className="mt-12">
      <div className="flex space-x-4 mb-6 relative">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-t-lg font-bold border-b-2 transition-colors ${selectedTab === tab ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 bg-gray-100 hover:bg-blue-100'}`}
            onClick={() => setSelectedTab(tab)}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {tab}
            {selectedTab === tab && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute left-0 right-0 bottom-0 h-1 bg-blue-600 rounded"
                style={{ zIndex: 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          {loadingElections ? (
            <div>Loading elections...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div>
              <h3 className="font-semibold mb-2">Select an Election:</h3>
              <div className="space-y-2 mb-6">
                {elections.length === 0 && <div className="text-gray-500">No elections found for this type.</div>}
                <AnimatePresence mode="wait">
                  {elections.map(election => (
                    <motion.button
                      key={election.electionid}
                      className={`block w-full text-left px-4 py-2 rounded border ${selectedElection?.electionid === election.electionid ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:bg-blue-50'}`}
                      onClick={() => setSelectedElection(election)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.25 }}
                    >
                      {election.title} ({election.date?.slice(0, 10)})
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {selectedElection && (
          <motion.div
            key={selectedElection.electionid}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <h3 className="font-semibold mb-2">Candidates for: <span className="text-blue-700">{selectedElection.title}</span></h3>
            <button
              className="mb-4 px-4 py-2 rounded bg-green-600 text-white font-bold shadow hover:bg-green-700 transition"
              onClick={handleAddCandidate}
            >
              Add Candidate
            </button>
            {loadingCandidates ? (
              <div>Loading candidates...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : candidates.length === 0 ? (
              <div className="text-gray-500">No candidates found for this election.</div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="overflow-x-auto bg-white rounded shadow"
              >
                <table className="min-w-full text-sm text-left text-gray-600">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                      <th scope="col" className="px-6 py-3">Sr</th>
                      <th scope="col" className="px-6 py-3">Name</th>
                      <th scope="col" className="px-6 py-3">Party</th>
                      <th scope="col" className="px-6 py-3">Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((c: any, idx: number) => (
                      <tr key={c.candidateid} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4">{idx + 1}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{c.name}</td>
                        <td className="px-6 py-4">{c.partyname || 'Independent'}</td>
                        <td className="px-6 py-4 flex space-x-2">
                          <button onClick={() => handleEditCandidate(c)} className="font-medium text-blue-600 hover:underline">Edit</button>
                          <span>/</span>
                          <button onClick={() => handleDeleteCandidate(c.candidateid)} className="font-medium text-red-600 hover:underline">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {isFormOpen && (
        <CandidateForm
          candidate={editingCandidate}
          electionId={selectedElection?.electionid}
          onSave={handleSaveCandidate}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default CandidateManagement; 