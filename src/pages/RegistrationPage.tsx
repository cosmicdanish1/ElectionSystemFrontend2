import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Puducherry', 'Chandigarh', 'Andaman and Nicobar Islands',
  'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep'
];

function calculateAge(dateString?: string): number | null {
  if (!dateString) return null;
  const birthDate = new Date(dateString);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const RegistrationPage = () => {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    aadharid: '',
    address: '',
    nationality: '',
    voter_card_id: '',
    state: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <div className="container mx-auto p-8">User not found.</div>;
  }

  // Check if user is already a registered voter
  if (user.vid) {
    return (
      <div className="container mx-auto p-8 max-w-lg text-center">
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-lg shadow-md" role="alert">
          <h1 className="text-2xl font-bold mb-2">You Are Already Registered!</h1>
          <p className="text-lg">You are eligible to vote in elections.</p>
        </div>
      </div>
    );
  }

  const age = calculateAge(user.date_of_birth);
  const isUnderage = age !== null && age < 18;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!/^\d{12}$/.test(form.aadharid)) {
      setError('Aadhar ID must be exactly 12 digits.');
      return false;
    }
    if (!/^\w{10}$/.test(form.voter_card_id)) {
      setError('Voter Card ID must be exactly 10 characters (letters or digits).');
      return false;
    }
    if (!form.address.trim()) {
      setError('Address is required.');
      return false;
    }
    if (!form.nationality) {
      setError('Nationality is required.');
      return false;
    }
    if (!form.state) {
      setError('State is required.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const payload = {
        userid: user.id,
        aadharid: form.aadharid,
        address: form.address,
        nationality: form.nationality,
        voter_card_id: form.voter_card_id,
        state: form.state,
      };

      const res = await fetch('/api/voter-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess('Registration submitted successfully!');
      // Fetch voter info and update user context
      const voterRes = await fetch(`/api/voters/by-user/${user.id}`);
      if (voterRes.ok) {
        const voterData = await voterRes.json();
        login({ ...user, vid: voterData.vid });
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Voter Registration</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block font-medium">Name</label>
          <input type="text" value={user.name} readOnly className="w-full bg-gray-100 rounded p-2 mt-1" />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input type="email" value={user.email} readOnly className="w-full bg-gray-100 rounded p-2 mt-1" />
        </div>
        <div>
          <label className="block font-medium">Date of Birth</label>
          <input type="text" value={user.date_of_birth ? user.date_of_birth.slice(0, 10) : 'N/A'} readOnly className="w-full bg-gray-100 rounded p-2 mt-1" />
        </div>
        <div>
          <label className="block font-medium">Gender</label>
          <input type="text" value={user.gender || 'N/A'} readOnly className="w-full bg-gray-100 rounded p-2 mt-1" />
        </div>
        <div>
          <label className="block font-medium">Age</label>
          <input type="text" value={age !== null ? age : 'N/A'} readOnly className="w-full bg-gray-100 rounded p-2 mt-1" />
        </div>
        {age !== null && isUnderage && (
          <div className="text-red-600 font-semibold">You cannot be a voter (must be 18 or older).</div>
        )}
        {age !== null && !isUnderage && (
          <>
            <div>
              <label className="block font-medium">Aadhar ID</label>
              <input
                type="text"
                name="aadharid"
                value={form.aadharid}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                maxLength={12}
                pattern="\d{12}"
                required
                inputMode="numeric"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block font-medium">Voter Card ID</label>
              <input
                type="text"
                name="voter_card_id"
                value={form.voter_card_id}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                maxLength={10}
                pattern="\w{10}"
                required
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                required
              />
            </div>
            <div>
              <label className="block font-medium">State</label>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                required
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium">Nationality</label>
              <select
                name="nationality"
                value={form.nationality}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
                required
              >
                <option value="">Select Nationality</option>
                <option value="Indian">Indian</option>
                <option value="NRI (Non-Resident Indian)">NRI (Non-Resident Indian)</option>
                <option value="Non-Indian">Non-Indian</option>
              </select>
            </div>
            {error && <div className="text-red-600 font-semibold">{error}</div>}
            {success && <div className="text-green-600 font-semibold">{success}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </>
        )}
        {age === null && (
          <div className="text-red-600 font-semibold">Date of birth is missing or invalid. Cannot determine age.</div>
        )}
      </form>
    </div>
  );
};

export default RegistrationPage;
