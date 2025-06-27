import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative  w-screen h-screen overflow-hidden bg-black">
      {/* Fullscreen background video */}
      <video
        src="/404/28 Cleverly Funny & Creative 404 Error Pages Inzone Design.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0  w-full h-180 object-cover z-0"
      />
      {/* Overlay for 404 message and button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <h1 className="text-7xl opacity-10 font-extrabold text-white drop-shadow-lg mb-4">404</h1>
       
        <button
          onClick={() => navigate('/')}
          className=" absolute px-17 py-13 bottom-20 right-60  "
        >
          
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage; 