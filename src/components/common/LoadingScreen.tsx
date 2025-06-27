import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100]">
      <div className="relative h-24 w-24">
        {/* This is the track */}
        <div className="absolute h-full w-full rounded-full border-4 border-gray-800"></div>
        {/* This is the spinning part with the gradient */}
        <div className="absolute h-full w-full animate-spin rounded-full border-4 border-t-transparent border-b-transparent border-l-pink-500 border-r-purple-500"></div>
      </div>
      <div className="text-white text-2xl mt-4 font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
        Loading...
      </div>
    </div>
  );
};

export default LoadingScreen; 