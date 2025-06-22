import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import RelevantElections from '../components/elections/RelevantElections';

const VoterDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Voter Dashboard</h1>
        <p className="text-lg text-gray-600">
          Welcome, {user ? user.name : 'Voter'}!
        </p>
      </div>
      <RelevantElections />

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
