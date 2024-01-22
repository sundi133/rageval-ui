import React, { useState, useEffect } from 'react';
import axios from 'axios'; // You need to install axios if not already installed
import '../app/globals.css';
import Link from 'next/link';
import { faChevronRight, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@clerk/nextjs';
import { useClerk } from '@clerk/nextjs';
import {
  faCheckCircle,
  faSpinner,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

function DatasetList({ searchTerm }: { searchTerm: string }) {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const tableHeaderCellStyle =
    'px-4 py-2 leading-5 text-center bg-gray-50 text-sm text-gray-900 tracking-wider whitespace-no-wrap';
  const tableBodyCellStyle =
    'text-sm px-6 py-4 leading-5 text-center bg-white text-sm text-gray-900 tracking-wider whitespace-no-wrap leading-5';

  const [datasets, setDatasets] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [userMessage, setUserMessage] =
    useState(`No dataset found. Why not create a new dataset? Click the button
  above to get started!`); // Message to display to the user
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(0); // Message to display to the user
  const { session } = useClerk();
  const [orgId, setOrgId] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        setOrgId(session?.lastActiveOrganizationId ?? '');
        setSuccessMessage(1);
        if (session?.lastActiveOrganizationId) {
          setUserMessage(
            `No dataset found. Why not create a new dataset? Click the button
            above to get started!`
          );
        } else {
          setSuccessMessage(0);
          setUserMessage(
            'No organization found. Please create an organization first.'
          );
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchUserData();
    }
  }, [session]);

  useEffect(() => {
    // Fetch interviews using Prisma
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (searchTerm.trim() !== '') {
          const searchResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/dataset/search`,
            {
              params: {
                org_id: session?.lastActiveOrganizationId,
                user_id: userId,
                search: searchTerm
              }
            }
          );
          const searchResults = searchResponse.data;
          setDatasets(searchResults);
        } else {
          // If search term is empty, use the default API route
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/dataset/list`,
            {
              params: {
                org_id: session?.lastActiveOrganizationId,
                user_id: userId
              }
            }
          );
          const fetchedInterviews = response.data;
          setDatasets(fetchedInterviews);
        }
        setIsLoading(false); // Data has been fetched
        setSuccessMessage(1);
      } catch (error: any) {
        setSuccessMessage(0);
        console.error('Error fetching:', error);
        setIsLoading(false); // Data fetching failed
      }
    };
    if (session && session?.lastActiveOrganizationId) {
      fetchData();
    }
  }, [searchTerm]);

  if (!session) {
    return null;
  }

  const handleRowClick = (interview: any) => {
    setSelectedInterview((prevSelectedInterview: any) => {
      if (prevSelectedInterview && prevSelectedInterview.id === interview.id) {
        return null; // Hide details if the same row is clicked again
      } else {
        return interview; // Show details for the clicked row
      }
    });
  };

  if (isLoading || !isLoaded || !userId || !session) {
    // Render loading message
    return (
      <div
        className="container min-w-full text-sm"
        style={{ marginTop: '16px' }}
      >
        Loading...
      </div>
    );
  }
  return (
    <div className="container min-w-full" style={{ marginTop: '16px' }}>
      {datasets.length === 0 ? (
        <div>
          <div className="text-sm">
            <p>
              {successMessage === 1 ? (
                <>{userMessage}</>
              ) : (
                <div>
                  {userMessage}
                  <Link href={'/create-organization'} className="text-blue-500">
                    {' '}
                    Click here to get started
                  </Link>
                </div>
              )}
            </p>
          </div>
          <div className="text-center mt-10" style={{ marginTop: '32px' }}>
            <Link href="/add/dataset">
              <button
                className="bg-gray-900 mt-5 text-white px-8 py-4 text-lg font-semibold rounded hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50"
                disabled={!session}
              >
                <span className="relative inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  &nbsp; Create Dataset
                </span>
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <table
          className="container min-w-full border-collapse border table-auto"
          style={{ marginTop: '16px' }}
        >
          <thead>
            <tr>
              <th className={tableHeaderCellStyle}>Timestamp</th>
              <th className={tableHeaderCellStyle}>Name</th>
              {/* <th className={tableHeaderCellStyle}>NumberOfQA</th>
                            <th className={tableHeaderCellStyle}>Sample%</th> */}
              <th className={tableHeaderCellStyle}>DataType</th>
              <th className={tableHeaderCellStyle}>ChatType</th>
              <th className={tableHeaderCellStyle}>ModelUsed</th>
              <th className={tableHeaderCellStyle}>ChunkSize</th>
              <th className={tableHeaderCellStyle}>Status</th>
              <th className={tableHeaderCellStyle}>View</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {datasets.map((dataset: any) => (
              <React.Fragment key={dataset.id}>
                <tr key={dataset.id} onClick={() => handleRowClick(dataset)}>
                  <td className={tableBodyCellStyle}>
                    {new Date(dataset.ts).toLocaleString()}
                  </td>
                  <td className={tableBodyCellStyle}>{dataset.name}</td>
                  <td className={tableBodyCellStyle}>{dataset.dataset_type}</td>
                  <td className={tableBodyCellStyle}>
                    {dataset.qa_type ?? ''}
                  </td>
                  <td className={tableBodyCellStyle}>{dataset.model_name}</td>
                  <td className={tableBodyCellStyle}>
                    {dataset.chunk_size ?? 2000}
                  </td>
                  <td className={tableBodyCellStyle}>
                    {dataset.status === 'completed' && (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        style={{ color: 'green' }}
                      />
                    )}
                    {dataset.status === 'in_progress' && (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        style={{ color: 'blue' }}
                      />
                    )}
                    {dataset.status === 'error' && (
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        style={{ color: 'red' }}
                      />
                    )}
                    {(!dataset.status || dataset.status === '') && ''}
                  </td>
                  <td className={tableBodyCellStyle}>
                    <Link
                      href={`/view/datasets/${dataset.id}`}
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-sm text-gray-900 hover:text-blue-500"
                      />
                    </Link>
                  </td>
                </tr>
                {/* Details row */}
                {selectedInterview && selectedInterview.id === dataset.id && (
                  <tr>
                    <td colSpan={9} className="px-4 py-2">
                      <div className="text-sm">
                        <p>
                          <strong>Persona:</strong> {dataset.persona}
                        </p>
                        <p>
                          <strong>Demographic Group:</strong>{' '}
                          {dataset.demographic}
                        </p>
                        <p>
                          <strong>Sentiment</strong> {dataset.sentiment}
                        </p>
                        <p>
                          <strong>Behavior:</strong> {dataset.behavior}
                        </p>
                        <p>
                          <strong>Resdient:</strong> {dataset.resident_type}
                        </p>
                        <p>
                          <strong>Family Status:</strong>{' '}
                          {dataset.family_status}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DatasetList;
