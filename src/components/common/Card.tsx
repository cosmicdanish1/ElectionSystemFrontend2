import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-800 bg-opacity-70 p-6 rounded-lg shadow-xl ${className}`}>
      {children}
    </div>
  );
};

export default Card; 