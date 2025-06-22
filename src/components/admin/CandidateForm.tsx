import React, { useState, useEffect } from 'react';

const CandidateForm = ({ candidate, electionId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    dob: '',
    aadharid: '',
    email: '',
    contact_number: '',
    partyname: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [parties, setParties] = useState([]);

  useEffect(() => {
    // Reset file input when form is re-initialized
    setPhotoFile(null);
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        gender: candidate.gender || 'Male',
        dob: candidate.dob ? new Date(candidate.dob).toISOString().split('T')[0] : '',
        aadharid: candidate.aadharid || '',
        email: candidate.email || '',
        contact_number: candidate.contact_number || '',
        partyname: candidate.partyname || '',
        // profile_photo_url is handled by the image tag below, not direct form state
      });
    } else {
      setFormData({
        name: '', gender: 'Male', dob: '', aadharid: '', email: '', contact_number: '', partyname: '',
      });
    }
  }, [candidate]);

  useEffect(() => {
    // Fetch parties for the dropdown
    const fetchParties = async () => {
      try {
        const res = await fetch('/api/parties');
        const data = await res.json();
        setParties(data);
      } catch (error) {
        console.error("Failed to fetch parties:", error);
      }
    };
    fetchParties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = new FormData();

    // Append all text-based form data
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }

    // Append the file if one has been selected
    if (photoFile) {
      submissionData.append('profile_photo', photoFile);
    }
    
    onSave(submissionData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{candidate ? 'Edit Candidate' : 'Add New Candidate'}</h3>
        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="md:col-span-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required />
          </div>
          {/* Gender */}
          <div className="md:col-span-1">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          {/* DOB */}
          <div className="md:col-span-1">
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required />
          </div>
          {/* Aadhar ID */}
          <div className="md:col-span-1">
            <label htmlFor="aadharid" className="block text-sm font-medium text-gray-700">Aadhar ID</label>
            <input type="text" name="aadharid" id="aadharid" value={formData.aadharid} onChange={handleChange} pattern="\d{12}" title="Aadhar ID must be 12 digits" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required />
          </div>
          {/* Email */}
          <div className="md:col-span-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
          </div>
          {/* Contact Number */}
          <div className="md:col-span-1">
            <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input type="tel" name="contact_number" id="contact_number" value={formData.contact_number} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
          </div>
          {/* Profile Photo Upload */}
          <div className="md:col-span-2">
            <label htmlFor="profile_photo" className="block text-sm font-medium text-gray-700">Profile Photo</label>
            <input 
              type="file" 
              name="profile_photo" 
              id="profile_photo" 
              onChange={handleFileChange} 
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" 
            />
            {candidate && candidate.profile_photo_url && !photoFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Current photo:</p>
                <img src={candidate.profile_photo_url} alt="Current profile" className="h-20 w-20 rounded-full object-cover" />
              </div>
            )}
            {photoFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">New photo preview:</p>
                <img src={URL.createObjectURL(photoFile)} alt="New profile preview" className="h-20 w-20 rounded-full object-cover" />
              </div>
            )}
          </div>
          {/* Party */}
          <div className="md:col-span-2">
            <label htmlFor="partyname" className="block text-sm font-medium text-gray-700">Party</label>
            <input type="text" name="partyname" id="partyname" value={formData.partyname} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" placeholder="Enter party name or leave blank for Independent" />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex items-center justify-end space-x-4 mt-4">
            <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Save Candidate</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm; 