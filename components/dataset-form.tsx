import React, { useState, ChangeEvent, useEffect } from 'react';
import '../app/globals.css';
import axios from 'axios';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';

export default function DatasetForm() {
  const [name, setName] = useState('');
  const [webLink, setWebLink] = useState('');
  const [crawlDepth, setCrawlDepth] = useState('');
  const [datasetType, setDatasetType] = useState('');
  const [datasetGenerationType, setDatasetGenerationType] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [files, setFiles] = useState<File[]>([]); // Use File[] for multiple files
  const [sampleSize, setSampleSize] = useState<number | 10>(10);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number | 10>(10);
  const [dataTypeExtension, setDataTypeExtension] = useState<string>('');
  const [csvOptions, setCsvOptions] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [ successMessage, setSuccessMessage ] = useState('');
  const [generatedDatasetId, setGeneratedDatasetId] = useState<string>('');
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { session } = useClerk();
  const [orgId, setOrgId] = useState<string>('');
  const [modelName, setModelName] = useState<string>('gpt-3.5-turbo');
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setOrgId(session?.lastActiveOrganizationId ?? '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (session) {
      fetchUserData();
    }
  }, [session]);

  if (!session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      setIsLoading(true);
      setFormSubmitted(true);
      setSuccessMessage('');
      if (name.trim() === '') {
        // Show an error message or perform other actions as needed
        return;
      }
      // Create a FormData object
      const formData = new FormData();
      // Append form data
      formData.append('file', files[0]); // Assuming you are handling a single file, adjust as needed
      formData.append('number_of_questions', numberOfQuestions.toString());
      formData.append('sample_size', sampleSize.toString());
      formData.append('prompt_key', 'prompt_key_txt_stateful_contextual_multilevel');
      formData.append('llm_type', '.' + datasetType.toLowerCase());
      formData.append('name', name);
      formData.append('userId', userId ?? '');
      formData.append('orgId', orgId ?? '');
      formData.append('model_name', modelName);
      formData.append('dataset_type', datasetType);
      // Send POST request to the API
      const response = await axios.post('/api/generate/', formData);
  
      if (response.status === 200) {
        // Handle success
        console.log('Success:', response.data.message); 
        setSuccessMessage("Great, Your dataset creation is in process! Watch the progress");   
        setGeneratedDatasetId(response.data.dataset_id);    
      } else {

        console.error('Error submitting form:', response.statusText);
        setError(response.statusText);
        // Handle error (e.g., display error message to the user)
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files); // Convert FileList to array
      setFiles(fileList);
    }
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
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Dataset Type:</label>
          <select
            value={datasetType}
            onChange={(e) => setDatasetType(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-base"
            required
          >
            <option value="">Select a Dataset type</option>
            <option value="TXT">TXT</option>
            <option value="CSV">CSV</option>
            <option value="PDF">PDF</option>
            <option value="JSON">JSON</option>
            <option value="WEB_LINK">HTML LINK</option>
            <option value="PGSQL">PGSQL</option>
            <option value="MYSQL">MYSQL</option>
            <option value="API">API</option>

            {/* Add more dataset types as needed */}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Model Type:</label>
          <select
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-base"
            required
          >
            <option value="">Select a Dataset type</option>
            <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
            <option value="gpt-4">gpt-4</option>
            {/* <option value="PDF">llama</option>
            <option value="JSON">mistral(moe)</option>
            <option value="WEB_LINK">gemini</option>
             */}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Select Question Answer Type:</label>
          <select
          value={datasetGenerationType}
          onChange={(e) => setDatasetGenerationType(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-base"
          required
        >
          <option value="">Select a QA Generation type</option>
          <option value="Simple Q&A">Single Q&A</option>
          <option value="Multi-level Q&A with follow-up in same context">Multi-level Q&A with Contextual Follow-up</option>
          <option value="Multi-level multi-chunk reference Q&A">Multi-level Q&A with Cross Chunk Reference</option>
        </select>
        </div>

        

        {(datasetType === 'CSV' || datasetType === 'PDF' || datasetType === 'TXT' || datasetType === 'JSON') && (

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Select Files:</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-50 sm:text-base"
              multiple // Allow multiple file selection
              required
            />
          </div>
        )}


        {files.length > 0 && datasetType === 'WEB_LINK' && (
          <div className="mb-4">
            <p className="text-gray-700 font-bold mb-2">Selected Files:</p>
            <ul>
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        {datasetType === 'WEB_LINK' && (

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Web Link:</label>
            <input
              type="text"
              value={webLink}
              onChange={(e) => setWebLink(e.target.value)}
              className="w-full border rounded p-2"
              required
            />

          </div>
        )}

        {datasetType === 'WEB_LINK' && (

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Web Crawl Depth:</label>
            <input
              type="number"
              value={crawlDepth}
              onChange={(e) => setCrawlDepth(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
        )}

        {datasetType === 'API' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">API Endpoint:</label>
            <input
              type="link"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
        )}

        {datasetType === 'API' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">API Endpoint:</label>
            <input
              type="link"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Sample Size (%):</label>
          <input
            type="number"
            value={sampleSize}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              if (newValue >= 1 && newValue <= 100) {
                setSampleSize(newValue);
              } else {
              }
            }}
            className="w-full border rounded p-2"
            min={0}
            max={100}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Number of Questions:</label>
          <input
            type="number"
            value={numberOfQuestions}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              if (newValue >= 1 && newValue <= 100000) {
                setNumberOfQuestions(newValue);
              } else {
              }
            }}
            className="w-full border rounded p-2"
            min={1}
            max={100000}
            required
          />

        </div>

        {successMessage && (
          <p className="text-blue-500 text-sm mt-1">
            {successMessage}
            <Link href={`/view/datasets/${generatedDatasetId}`} >
              <span className='font-bold'> here</span>
            </Link>
          </p>
        )}

        <button type="button"
          className={`text-white text-sm p-2 mt-2 rounded ${isLoading ? 'bg-gray-500' : 'bg-gray-700'}`} 
          onClick={handleSubmit}
         >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
        
        {formSubmitted && name.trim() === '' && (
          <p className="text-red-500 text-sm mt-1">Name cannot be empty.</p>
        )}
      </form>
    </div>
  );
}
