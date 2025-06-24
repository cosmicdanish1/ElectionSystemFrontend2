import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CandidateManagement from '../components/admin/CandidateManagement';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const TABS = [
  { key: 'election', label: 'Election Management' },
  { key: 'leaderboard', label: 'Candidate Leaderboard' },
  { key: 'candidates', label: 'Candidate Management' },
  { key: 'allcandidates', label: 'All Candidates' },
];

const CommitteeDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('election');

  // Leaderboard state
  const [elections, setElections] = useState<any[]>([]);
  const [selectedElection, setSelectedElection] = useState<any | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loadingElections, setLoadingElections] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // All candidates state
  const [allCandidates, setAllCandidates] = useState<any[]>([]);
  const [loadingAllCandidates, setLoadingAllCandidates] = useState(false);
  const [errorAllCandidates, setErrorAllCandidates] = useState<string | null>(null);

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

  // Fetch all candidates for the All Candidates tab
  useEffect(() => {
    if (activeTab !== 'allcandidates') return;
    setLoadingAllCandidates(true);
    fetch('/api/candidates')
      .then(res => res.json())
      .then(data => {
        setAllCandidates(data);
        setLoadingAllCandidates(false);
      })
      .catch(() => {
        setErrorAllCandidates('Failed to fetch candidates');
        setLoadingAllCandidates(false);
      });
  }, [activeTab]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Committee Dashboard</h1>
      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg shadow overflow-hidden border border-blue-200">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`px-6 py-2 font-semibold focus:outline-none transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-700 hover:bg-blue-50'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="min-h-[350px]">
        <AnimatePresence mode="wait">
          {activeTab === 'election' && (
            <motion.div
              key="election"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 80 }}
              className="flex justify-center"
            >
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
            </motion.div>
          )}
          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 80 }}
              className="flex justify-center"
            >
              <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mx-auto">
                {/* Bar Graph Card */}
                <div className="flex-1 bg-white rounded-lg shadow-2xl p-6 mb-8 md:mb-0">
                  <h2 className="text-xl font-bold mb-4 text-blue-700">Votes Bar Graph & Pie Chart</h2>
                  {Array.isArray(leaderboard) && leaderboard.length > 0 && (
                    <div className="flex flex-row gap-8 w-full items-center justify-center">
                      <div className="flex-1">
                        <BarGraph leaderboard={leaderboard} />
                      </div>
                      <div className="flex-1">
                        <PieGraph leaderboard={leaderboard} />
                      </div>
                    </div>
                  )}
                </div>
                {/* Leaderboard Table Card */}
                <div className="flex-1 bg-white rounded-lg shadow-2xl p-6 overflow-x-auto">
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
                                  className={idx === 0 ? 'bg-green-100 font-bold animate-pulse' : ''}
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
            </motion.div>
          )}
          {activeTab === 'candidates' && (
            <motion.div
              key="candidates"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 80 }}
              className="flex justify-center"
            >
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl border border-blue-100">
                <h2 className="text-2xl font-bold text-blue-700 mb-4">Candidate Management</h2>
                <CandidateManagement />
              </div>
            </motion.div>
          )}
          {activeTab === 'allcandidates' && (
            <motion.div
              key="allcandidates"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 80 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-2xl font-bold text-blue-700 mb-6">All Candidates</h2>
              {loadingAllCandidates ? (
                <div>Loading candidates...</div>
              ) : errorAllCandidates ? (
                <div className="text-red-600">{errorAllCandidates}</div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 w-full max-w-6xl">
                  {allCandidates
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((c) => (
                      <div key={c.cid} className="bg-white rounded-lg shadow p-2 flex flex-col items-center justify-center aspect-square">
                        <img
                          src={c.symbol_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(c.name)}
                          alt={c.name}
                          className="w-12 h-12 object-cover rounded-full mb-2 border border-blue-200 shadow"
                        />
                        <div className="font-semibold text-xs text-center text-blue-800 truncate w-full">{c.name}</div>
                        <div className="text-[10px] text-gray-600 text-center mt-1 truncate w-full">{c.partyname || 'Independent'}</div>
                      </div>
                    ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// BarGraph component for animated, gradient bar chart
const BarGraph = ({ leaderboard }: { leaderboard: any[] }) => {
  const chartRef = useRef<any>(null);
  const labels = leaderboard.map(c => c.name);
  const data = leaderboard.map(c => c.votes);

  // Create gradient for bars
  const getGradient = (ctx: CanvasRenderingContext2D, chartArea: any) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, '#4f2eec'); // purple
    gradient.addColorStop(1, '#0a1a4f'); // dark blue
    return gradient;
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Votes',
        data,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return '#4f2eec';
          return getGradient(ctx, chartArea);
        },
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: true },
    },
    animation: {
      duration: 1200,
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#4f2eec', font: { weight: 700 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#e0e7ff' },
        ticks: { color: '#0a1a4f', font: { weight: 700 } },
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Bar ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

// PieGraph component for vote distribution
const PieGraph = ({ leaderboard }: { leaderboard: any[] }) => {
  const labels = leaderboard.map(c => c.name);
  const data = leaderboard.map(c => c.votes);
  const backgroundColors = [
    '#7c3aed', '#6366f1', '#0ea5e9', '#06b6d4', '#10b981', '#f59e42', '#f43f5e', '#a21caf', '#1e293b', '#fbbf24'
  ];
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: labels.map((_, i) => backgroundColors[i % backgroundColors.length]),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
      title: { display: false },
      tooltip: { enabled: true },
    },
    animation: {
      duration: 1200,
    },
  };
  return (
    <div className="w-full h-full flex flex-col items-center">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default CommitteeDashboard; 