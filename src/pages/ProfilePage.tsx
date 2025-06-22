import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {user ? (
        <div className="bg-white rounded-lg shadow-md p-6">
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
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
};

export default ProfilePage; 