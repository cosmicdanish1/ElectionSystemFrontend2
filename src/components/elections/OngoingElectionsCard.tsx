import React from 'react';

interface OngoingElectionsCardProps {
  children?: React.ReactNode;
}

const OngoingElectionsCard: React.FC<OngoingElectionsCardProps> = ({ children }) => (
  <div className="bg-blue-100 border border-blue-300 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
    <h2 className="text-2xl font-bold text-blue-700 mb-2">Ongoing Elections</h2>
    <p className="text-gray-700 mb-4">Stay updated with the elections currently in progress.</p>
    {children}
  </div>
);

export default OngoingElectionsCard; 