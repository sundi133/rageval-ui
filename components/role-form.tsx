import React, { useState } from 'react';
import '../app/globals.css';

export default function InterviewRole() {
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleJobLink, setRoleJobLink] = useState('');
  
  const handleSubmit = (e:any) => {
    e.preventDefault();
    // Handle form submission here
    console.log('roleName:', roleName);
    console.log('roleDescription:', roleDescription);
    console.log('roleJobLink:', roleJobLink);
  };

  return (
    
    <div className="container mx-auto p-4 h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-gray-100 rounded-md p-4 max-w-md w-full">
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Role Name:</label>
            <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full border rounded p-2"
            />
        </div>

        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Role Description:</label>
            <textarea
            value={roleDescription}
            onChange={(e) => setRoleDescription(e.target.value)}
            rows="4"  // Set the desired number of rows for the textarea
            className="w-full border rounded p-2"
            ></textarea>
        </div>

        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Role Job Link:</label>
            <input
            type="text"
            value={roleJobLink}
            onChange={(e) => setRoleJobLink(e.target.value)}
            className="w-full border rounded p-2"
            />
        </div>

        {/* ... (other form fields) */}
        <button type="submit" className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Submit
        </button>
        </form>
    </div>

  );
}
