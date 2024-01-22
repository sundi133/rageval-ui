import React, { useState, ChangeEvent, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@tremor/react';
import axios from 'axios';
import { useClerk } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import '../app/globals.css';

const generateRandomName = () => {
  const nouns = [
    'Explorer',
    'Adventurer',
    'Pioneer',
    'Dreamer',
    'Voyager',
    'Traveler',
    'Nomad',
    'Seeker',
    'Wanderer',
    'Discoverer'
  ];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `Chat Evaluation ${randomNoun}`;
};

export default function DatasetForm() {
  const [name, setName] = useState(generateRandomName());
  const [apiEndpoints, setApiEndpoints] = useState([]);
  const [selectedAPIEndpoint, setSelectedAPIEndpoint] = useState<string>(''); // State for selected dataset
  const [datasets, setDatasets] = useState([]); // New state to store datasets
  const [selectedDataset, setSelectedDataset] = useState<string>(''); // State for selected dataset
  const [numUsers, setNumUsers] = useState(2);
  const [percentageOfQuestions, setPercentageOfQuestions] = useState(100);
  const [orderOfQuestions, setOrderOfQuestions] = useState('ordered');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [generatedEndpointId, setGeneratedEndpointId] = useState<string>('');
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { session } = useClerk();
  const [orgId, setOrgId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isEndpointValid, setIsEndpointValid] = useState<boolean>(true);
  const [evaluationScore, setEvaluationScore] = useState<string>('rougeL');

  function validateEndpoint(endpoint: string) {
    return endpoint.startsWith('https://');
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setOrgId(session?.lastActiveOrganizationId ?? '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchDatasetList = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/dataset/list`,
          {
            params: {
              org_id: session?.lastActiveOrganizationId
            }
          }
        );
        setDatasets(response.data);
      } catch (error) {
        console.error('Error fetching dataset list:', error);
      }
    };

    const fetchEndpointList = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/llm-endpoints/list`,
          {
            params: {
              org_id: session?.lastActiveOrganizationId
            }
          }
        );
        setApiEndpoints(response.data);
      } catch (error) {
        console.error('Error fetching dataset list:', error);
      }
    };

    if (session) {
      fetchUserData();
      fetchDatasetList();
      fetchEndpointList();
    }
  }, [session]);

  if (!session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setErrorMsg('');
      setIsLoading(true);
      setFormSubmitted(true);
      setSuccessMessage('');

      if (name.trim() === '') {
        setErrorMsg('Name is required');
        return;
      }
      if (selectedAPIEndpoint.trim() === '') {
        setErrorMsg('API Endpoint is required');
        return;
      }
      if (selectedDataset.trim() === '') {
        setErrorMsg('Dataset is required');
        return;
      }
      if (!isEndpointValid) {
        setErrorMsg('Endpoint must start with https://');
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('user_id', userId ?? '');
      formData.append('org_id', orgId ?? '');
      formData.append('endpoint_url_id', selectedAPIEndpoint);
      formData.append('dataset_id', selectedDataset);
      formData.append('num_users', String(numUsers));
      formData.append('percentage_of_questions', String(percentageOfQuestions));
      formData.append('order_of_questions', orderOfQuestions);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/simulation/add`,
        formData
      );

      if (response.status === 200) {
        console.log('Success:', response.data.message);
        setSuccessMessage('Great, Your simulation is in progress');
        setGeneratedEndpointId(response.data.endpoint_id);
      } else {
        console.error('Error submitting form:', response.statusText);
        setError(response.statusText);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={`p-4 md:p-10 mx-auto max-w-7xl`}>
      <div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white-100 rounded-md px-8 pt-6 pb-8 mb-4"
            style={{
              maxHeight: '80vh',
              overflowY: 'auto',
              display: 'flex', // Enable flexbox
              flexDirection: 'column', // Stack children vertically
              justifyContent: 'space-between' // Center vertically
            }}
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Evaluation Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded p-2 text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                API Endpoint:
              </label>
              <select
                value={selectedAPIEndpoint}
                onChange={(e) => setSelectedAPIEndpoint(e.target.value)}
                className="w-full border rounded p-2 text-sm"
                required
              >
                <option value="">Select API Endpoint</option>
                {apiEndpoints.map((apiEndpoint: any) => (
                  <option key={apiEndpoint.id} value={apiEndpoint.id}>
                    {apiEndpoint.id} - {apiEndpoint.name} ({' '}
                    {apiEndpoint.endpoint_url} )
                  </option>
                ))}
              </select>
            </div>

            {/* Add other input fields for dataset, numUsers, percentageOfQuestions, orderOfQuestions, runtime */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Dataset:
              </label>
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                className="w-full border rounded p-2 text-sm"
                required
              >
                <option value="">Select Dataset</option>
                {datasets.map((dataset: any) => (
                  <option key={dataset.id} value={dataset.id}>
                    {dataset.id} ( {dataset.name} )
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Number of Users in Simulation:
              </label>
              <input
                type="number"
                value={numUsers}
                onChange={(e) => setNumUsers(Number(e.target.value))}
                className="w-full border rounded p-2 text-sm"
                min={1}
                max={100}
                required
              />
            </div>
            {/* Add other input fields for percentageOfQuestions, orderOfQuestions, runtime */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Sample% of QA Questions:
              </label>
              <input
                type="number"
                value={percentageOfQuestions}
                onChange={(e) =>
                  setPercentageOfQuestions(Number(e.target.value))
                }
                className="w-full border rounded p-2 text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Selection Order:
              </label>
              <select
                value={orderOfQuestions}
                onChange={(e) => setOrderOfQuestions(e.target.value)}
                className="w-full border rounded p-2 text-sm"
                required
              >
                <option value="ordered">Ordered</option>
                <option value="randomNoRepeat">Random with No Repeat</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Evaluation Score:
              </label>
              <select
                value={evaluationScore}
                onChange={(e) => setEvaluationScore(e.target.value)}
                className="w-full border rounded p-2 text-sm"
                required
              >
                <option value="rougeL">rougeL</option>
                <option value="bleu">bleu</option>
                <option value="bert">bert similarity</option>
                <option value="gpt-3.5-turbo">
                  let gpt-3.5-turbo evaluate
                </option>
                <option value="gpt-4">let gpt-4 evaluate</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Measure Groundedness:
              </label>
              <div>
                <input
                  type="radio"
                  id="groundedness_true"
                  name="groundedness"
                  value="groundedness_true"
                  className="mr-2"
                />
                <label htmlFor="groundedness" className="text-sm text-gray-700">
                  Yes
                </label>
                <span className="ml-4"></span>
                <input
                  type="radio"
                  id="groundedness_false"
                  name="groundedness"
                  value="groundedness_false"
                  className="mr-2"
                  checked={true}
                />
                <label htmlFor="relevance" className="text-sm text-gray-700">
                  No
                </label>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Measure Relevance:
              </label>
              <div>
                <input
                  type="radio"
                  id="relevance_true"
                  name="relevance"
                  value="relevance_true"
                  className="mr-2"
                  checked={true}
                />
                <label htmlFor="groundedness" className="text-sm text-gray-700">
                  Yes
                </label>
                <span className="ml-4"></span>
                <input
                  type="radio"
                  id="relevance_false"
                  name="relevance"
                  value="relevance_false"
                  className="mr-2"
                />
                <label htmlFor="relevance" className="text-sm text-gray-700">
                  No
                </label>
              </div>
            </div>
          </form>
          {successMessage && (
            <p className="text-blue-500 text-sm mt-4">{successMessage}</p>
          )}

          {errorMsg && <p className="text-red-500 text-sm mt-4">{errorMsg}</p>}
          <Button
            className="fixed justify-center text-white text-sm bottom-4 transform bg-gray-900 text-white hover:bg-gray-700 border-white hover:border-white rounded"
            style={{ zIndex: 1000 }}
            disabled={isLoading}
            onClick={handleSubmit}
            type="button"
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>
    </main>
  );
}
