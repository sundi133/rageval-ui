import React, { useState, ChangeEvent, useEffect, use } from 'react';
import '../app/globals.css';
import axios from 'axios';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@tremor/react';
import Details from '../pages/view/datasets/Details';

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
  return `Test Dataset ${randomNoun}`;
};

export default function DatasetForm() {
  const [name, setName] = useState(generateRandomName());
  const [dataSource, setDataSource] = useState('');
  const [webLink, setWebLink] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [crawlDepth, setCrawlDepth] = useState(1);
  const [maxCrawlLinks, setMaxCrawlLinks] = useState(1);
  const [datasetType, setDatasetType] = useState('TXT');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [files, setFiles] = useState<File[]>([]); // Use File[] for multiple files
  const [sampleSize, setSampleSize] = useState<number | 5>(5);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number | 5>(5);
  const [dataTypeExtension, setDataTypeExtension] = useState<string>('');
  const [csvOptions, setCsvOptions] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [generatedDatasetId, setGeneratedDatasetId] = useState<string>('');
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { session } = useClerk();
  const [orgId, setOrgId] = useState<string>('');
  const [modelName, setModelName] = useState<string>('gpt-3.5-turbo');
  const [chunkSize, setChunkSize] = useState<number | 2000>(2000);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [datasetGenerationType, setDatasetGenerationType] = useState('simple');
  const [personaFlag, setPersonaFlag] = useState<string>('casual');
  const [behaviorFlag, setBehaviorFlag] = useState<string>('Friendly');
  const [demoFlag, setDemoFlag] = useState<string>('adults (age 25-34)');
  const [sentimentFlag, setSentimentFlag] = useState<string>('positive');
  const [errorFlag, setErrorFlag] = useState<string>('normal');
  const [residentType, setResidentType] = useState<string>('Urban');
  const [familyStatus, setFamilyStatus] = useState<string>('Single');
  const [persona, setPersona] = useState<string>('');
  const [placeholder, setPlaceholder] = useState<string>('');
  const [tags, setTags] = useState<string>('');

  const personaSentences = [
    'Users who are always ahead in tech trends, this coder spends nights crafting innovative software and exploring new programming languages.',
    'Users with a passion for creativity, this artist blends traditional techniques with modern expressions to create captivating artworks.',
    'Users who are always on the go, this traveler is constantly exploring new places and cultures, and is always looking for the next adventure.',
    'Eager to disrupt markets, they blend academic insights from commerce classes with cutting-edge marketing trends.',
    'User who are casual and friendly, they are always looking for new ways to connect with their friends and family.',
    'Users who are friendly and outgoing, they are always looking for new ways to buy and sell products.',
    "Users who are exploring commerce's complexities, they aspire to master the art of successful business management.",
    'Users who are tech savvy and software engineers, they are always looking for new ways to build and deploy software.'
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setOrgId(session?.lastActiveOrganizationId ?? '');
        const randomIndex = Math.floor(Math.random() * personaSentences.length);
        //setPersona(personaSentences[randomIndex]);
        setPlaceholder(personaSentences[randomIndex]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (session) {
      fetchUserData();
    }
  }, [session]);

  useEffect(() => {}, [generatedDatasetId]);

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
        // Show an error message or perform other actions as needed
        setErrorMsg('Name is required');
        return;
      }
      if (datasetType.trim() === '') {
        // Show an error message or perform other actions as needed
        setErrorMsg('Dataset Type is required');
        return;
      }
      if (dataSource.trim() === '') {
        // Show an error message or perform other actions as needed
        setErrorMsg('Data Source is required');
        return;
      }

      if (
        (files.length === 0 && datasetType === 'TXT') ||
        (files.length === 0 && datasetType === 'CSV') ||
        (files.length === 0 && datasetType === 'PDF') ||
        (files.length === 0 && datasetType === 'JSON')
      ) {
        setErrorMsg('File is required');
        return;
      }

      if (persona.trim() === '') {
        // Show an error message or perform other actions as needed
        setErrorMsg('User Persona is required');
        return;
      }

      const formData = new FormData();

      // For multiple files
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      formData.append('number_of_questions', numberOfQuestions.toString());
      formData.append('sample_size', sampleSize.toString());
      formData.append(
        'prompt_key',
        `prompt_key_${datasetType.toLowerCase()}_${datasetGenerationType.toLowerCase()}`
      );
      formData.append('name', name);
      formData.append('data_source', dataSource);
      formData.append('userId', userId ?? '');
      formData.append('orgId', orgId ?? '');
      formData.append('model_name', modelName);
      formData.append('dataset_type', datasetType);
      formData.append('chunk_size', chunkSize.toString());
      formData.append('persona', persona);
      formData.append('tags', tags);
      if (apiKey.trim() !== '') {
        formData.append('openai_api_key', apiKey);
      }

      if (datasetType === 'WEB_LINK') {
        formData.append('data_path', webLink);
        formData.append('crawl_depth', crawlDepth.toString());
        formData.append('max_crawl_links', maxCrawlLinks.toString());
        formData.append(
          'prompt_key',
          `prompt_key_txt_${datasetGenerationType.toLowerCase()}`
        );
        formData.append('llm_type', '.html');
      } else {
        formData.append('llm_type', '.' + datasetType.toLowerCase());
      }

      // Send POST request to the API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/generate`,
        formData
      );

      if (response.status === 200) {
        // Handle success
        console.log('Success:', response.data.message);
        setSuccessMessage(
          'Great, Your dataset creation is in process! Watch the progress'
        );
        if (response.data.dataset_id) {
          setGeneratedDatasetId(response.data.dataset_id);
        } else {
          setGeneratedDatasetId('');
          setSuccessMessage('');
          setError('Oops, please try again once more!');
        }
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
            <div className="mb-4 flex flex-wrap">
              <div className="w-1/2 pr-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded p-2 text-sm font-medium text-gray-700"
                  required
                />
              </div>

              <div className="w-1/2 pr-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Data Source:
                </label>
                <input
                  type="text"
                  value={dataSource}
                  onChange={(e) => setDataSource(e.target.value)}
                  placeholder="Enter your own data source name"
                  className="w-full border rounded p-2 text-sm font-medium text-gray-700"
                  required
                />
              </div>
            </div>

            <div className="mb-4 flex flex-wrap">
              <div className="w-1/2 pr-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Dataset Type:
                </label>
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
              <div className="w-1/2 pr-2">
                <div className="pr-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Select Question Answer Type:
                  </label>
                  <select
                    value={datasetGenerationType}
                    onChange={(e) => setDatasetGenerationType(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-base"
                    required
                  >
                    <option value="">Select a QA Generation type</option>
                    <option value="simple">Single Q&A</option>
                    <option value="stateful_contextual_multilevel">
                      Multi-level Q&A with Contextual Follow-up
                    </option>
                    <option value="stateful_context_change_multilevel_multichunk">
                      Multi-level Q&A Context Change Questions
                    </option>
                    <option value="stateful_contextual_multi_chunk_reference">
                      Multi-level Q&A with Cross Chunk Reference[Coming Soon]
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap">
              <div className="w-1/2 pr-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Model Type:
                </label>
                <select
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-base"
                  required
                >
                  <option value="">Select a Model type</option>
                  <option value="gpt-3.5-turbo">gpt-3.5-turbo [openai]</option>
                  <option value="gpt-3.5-turbo-1106">
                    gpt-3.5-turbo-1106-16k [openai]
                  </option>
                  <option value="gpt-4">gpt-4 [openai]</option>
                  <option value="llama-2">llama-2 [Coming Soon]</option>
                  <option value="mistral">mistral [Coming Soon]</option>
                  <option value="gemini">gemini [Coming Soon]</option>
                </select>
              </div>

              <div className="w-1/2 pr-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Your OpenAI API Key: (
                  <Link
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                  >
                    &nbsp;
                    <span className="underline text-sm font-normal">
                      Where do I find my API key?
                    </span>
                  </Link>
                  )
                </label>

                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your own API key"
                  className="w-full border rounded p-2 text-sm font-medium text-gray-700"
                  required
                />
              </div>
            </div>

            {(datasetType === 'CSV' ||
              datasetType === 'PDF' ||
              datasetType === 'TXT' ||
              datasetType === 'JSON') && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Data:
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-50 sm:text-base"
                  multiple // Allow multiple file selection
                  required
                />
              </div>
            )}

            {(datasetType === 'CSV' ||
              datasetType === 'PDF' ||
              datasetType === 'TXT' ||
              datasetType === 'JSON') &&
              files.length > 0 && (
                <div className="mb-4">
                  <p className="text-gray-700 font-bold mb-2">
                    Selected Files:
                  </p>
                  <ul>
                    {files.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}

            {datasetType === 'WEB_LINK' && (
              <div className="mb-4 flex flex-wrap mt-2">
                <div className="w-1/2 pr-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Web Link:
                  </label>
                  <input
                    type="text"
                    value={webLink}
                    onChange={(e) => setWebLink(e.target.value)}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div className="w-1/4 pr-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Web Crawl Depth:
                  </label>
                  <input
                    type="number"
                    value={crawlDepth}
                    onChange={(e) => setCrawlDepth(Number(e.target.value))}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div className="w-1/3 pr-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Max Links to Crawl:
                  </label>
                  <input
                    type="number"
                    value={maxCrawlLinks}
                    onChange={(e) => setMaxCrawlLinks(Number(e.target.value))}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
              </div>
            )}

            {datasetType === 'API' && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  API Endpoint:
                </label>
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
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  API Endpoint:
                </label>
                <input
                  type="link"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
            )}

            {/* 
          <div className="mb-4 flex flex-wrap">
            <div className="w-1/2 pr-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Persona Profile:</label>
              <select
                value={personaFlag}
                onChange={(e) => setPersonaFlag(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-base"
              >
                <option value="Curious User">Select a Persona Profile</option>
                <option value="curious">Curious User</option>
                <option value="casual">Casual User</option>
                <option value="enthusiast">Enthusiast User</option>
                <option value="tech-savvy">Tech-Savvy User</option>
                <option value="creative">Creative User</option>
                <option value="adventurous">Adventurous User</option>
                <option value="serious">Skeptical User</option>
                <option value="humorous">Humorous User</option>
                <option value="risk-taker">Risk-Taker User</option>
              </select>
            </div>

            <div className="w-1/2 pr-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Behavioral Profile:</label>
              <select
                value={behaviorFlag}
                onChange={(e) => setBehaviorFlag(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-base"
              >
                <option value="Friendly Behavior">Select a Behavioral Profile</option>
                <option value="Friendly">Friendly</option>
                <option value="Impatient">Impatient</option>
                <option value="Task-Oriented">Task-Oriented</option>
              </select>
            </div>
            
          </div>
          <div className="mb-4 flex flex-wrap">

            <div className="w-1/2 pr-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Select Tone:</label>
              <select
                value={sentimentFlag}
                onChange={(e) => setSentimentFlag(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-base"
              >
                <option value="Positive">Select a Tone</option>
                <option value="positive">Positive</option>
                <option value="aggressive">Aggressive</option>
                <option value="negative">Negative</option>
              </select>
            </div>
            <div className="w-1/2 pr-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Demographic Profile:</label>
              <select
                value={demoFlag}
                onChange={(e) => setDemoFlag(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-base"
              >
                <option value="Adults (age 25-34)">Select a Demographic Profile</option>
                <option value="teenager (age 13-17)">Teenagers (13-17)</option>
                <option value="young adults (age 18-24)">Young Adults (18-24)</option>
                <option value="adults (age 25-34)">Adults (25-34)</option>
                <option value="middle-aged (age 35-54)">Middle-Aged (35-54)</option>
                <option value="seniors (age 55+)">Seniors (55+)</option>
              </select>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap">

            <div className="w-1/2 pr-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Resident Type:</label>
              <select
                value={residentType}
                onChange={(e) => setResidentType(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-base"
              >
                <option value="Urban Residents">Select Resident Type:</option>
                <option value="Anywhere">None</option>
                <option value="Urban">Urban Residents</option>
                <option value="Suburban">Suburban Residents</option>
                <option value="Rural">Rural Residents</option>
              </select>
            </div>
            <div className="w-1/2 pr-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Family Status:</label>
              <select
                value={familyStatus}
                onChange={(e) => setFamilyStatus(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-base"
              >
                <option value="Single Status">Select Family Status:</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Parents">Parents</option>
              </select>
            </div>
          </div> */}

            <div className="mb-4 flex flex-wrap">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Chat User Persona:
              </label>
              <textarea
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="w-full border rounded p-2"
                placeholder={placeholder}
                rows={4}
                required
              ></textarea>
            </div>

            <div className="mb-4 flex flex-wrap">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tags:
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            <div className="mb-4 flex flex-wrap">
              <div className="w-1/3 pr-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Sample Size (%):
                </label>
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

              <div className="w-1/3 pr-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Number of Questions:
                </label>
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

              <div className="w-1/3 pr-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Split Chunk Size:
                </label>
                <input
                  type="number"
                  value={chunkSize}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    if (newValue >= 1 && newValue <= 8000) {
                      setChunkSize(newValue);
                    } else {
                    }
                  }}
                  className="w-full border rounded p-2"
                  min={1}
                  max={8000}
                  required
                />
              </div>
            </div>
          </form>

          {successMessage && (
            <p className="text-blue-500 text-sm mt-2">
              {successMessage}
              <Link href={`/view/datasets/${generatedDatasetId}`}>
                <span className="font-bold"> here</span>
              </Link>
            </p>
          )}

          {formSubmitted && errorMsg && (
            <p className="text-red-500 text-sm mt-2">{errorMsg}</p>
          )}

          <Button
            className="mt-2 fixed text-white text-sm bottom-4 transform bg-gray-900 text-white hover:bg-gray-700 border-white hover:border-white py-2 px-4 rounded"
            style={{ zIndex: 1000 }} // Optional: Use zIndex to ensure the button is on top
            disabled={isLoading}
            onClick={handleSubmit}
            type="button"
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
          {generatedDatasetId && (
            <div
              className="bg-white-100 rounded-md px-8 pt-6 pb-8 mb-4"
              style={{
                maxHeight: '80vh',
                overflowY: 'auto',
                display: 'flex', // Enable flexbox
                flexDirection: 'column', // Stack children vertically
                justifyContent: 'space-between' // Center vertically
              }}
            >
              <Details datagen_id={generatedDatasetId} size="8xl" />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
