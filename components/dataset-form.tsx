import React, { useState } from 'react';
import '../app/globals.css';

export default function DatasetForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [crawlDepth, setCrawlDepth] = useState('');

  const [file, setFile] = useState(null);
  const [datasetType, setDatasetType] = useState('');

  const handleSubmit = (e:any) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Name:', name);
    console.log('Description:', description);
    console.log('File:', file); // You can handle the file upload here
    console.log('Dataset Type:', datasetType);
  };

  return (
    <div className="container mx-auto p-4 h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white-100 rounded-md p-4 max-w-md w-full border">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Upload File:</label>
          <input
            type="file"
            onChange={(e:any) => setFile(e.target.files[0])}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Web Link:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2"
          />
          
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Web Crawl Depth:</label>
          <input
            type="number"
            value={crawlDepth}
            onChange={(e) => setCrawlDepth(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Dataset Type:</label>
          <select
            value={datasetType}
            onChange={(e) => setDatasetType(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">Select a dataset type</option>
            <option value="Type 1">Csv</option>
            <option value="Type 2">Pdf</option>
            <option value="Type 3">Txt</option>
            <option value="Type 4">Json</option>
            <option value="Type 5">Readme</option>
            <option value="Type 6">Web Link</option>
            {/* Add more dataset types as needed */}
          </select>
        </div>

        <button type="submit" className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
