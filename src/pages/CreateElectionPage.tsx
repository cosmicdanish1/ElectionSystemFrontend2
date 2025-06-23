import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry',
  'Chandigarh', 'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep'
];

const CreateElectionPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    let location_region = '';
    if (type === 'Nagar') location_region = city;
    else if (type === 'Vidhan Sabha') location_region = state;
    else if (type === 'Lok Sabha') location_region = 'India';
    try {
      const res = await fetch('/api/elections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, date, location_region }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create election');
      }
      setSuccess('Election created successfully!');
      setTimeout(() => navigate('/committee-dashboard'), 1200);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Create New Election</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Type</label>
          <select
            className="w-full border rounded p-2"
            value={type}
            onChange={e => { setType(e.target.value); setCity(''); setState(''); }}
            required
          >
            <option value="" disabled>Select type</option>
            <option value="Nagar">Nagar</option>
            <option value="Lok Sabha">Lok Sabha</option>
            <option value="Vidhan Sabha">Vidhan Sabha</option>
          </select>
        </div>
        {/* Conditional location/region input */}
        {type === 'Nagar' && (
          <div>
            <label className="block font-medium mb-1">City</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={city}
              onChange={e => setCity(e.target.value)}
              required
            />
          </div>
        )}
        {type === 'Vidhan Sabha' && (
          <div>
            <label className="block font-medium mb-1">State</label>
            <select
              className="w-full border rounded p-2"
              value={state}
              onChange={e => setState(e.target.value)}
              required
            >
              <option value="" disabled>Select state</option>
              {INDIAN_STATES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}
        {type === 'Lok Sabha' && (
          <div>
            <label className="block font-medium mb-1">State</label>
            <select className="w-full border rounded p-2 bg-gray-100" value="India" disabled>
              <option value="India">India</option>
            </select>
          </div>
        )}
        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            className="w-full border rounded p-2"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        {success && <div className="text-green-600 font-semibold">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Election'}
        </button>
      </form>
    </div>
  );
};

export default CreateElectionPage; 