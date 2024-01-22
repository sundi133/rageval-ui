import React, { useState, useEffect } from 'react';
import axios from 'axios'; // You need to install axios if not already installed
import '../app/globals.css';
import Link from 'next/link';
import { faChevronRight, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@clerk/nextjs';
import { useClerk } from '@clerk/nextjs';

function EndpointList({ searchTerm }: { searchTerm: string }) {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const tableHeaderCellStyle =
    'px-4 py-2 leading-5 text-center bg-gray-50 text-sm text-gray-900 tracking-wider';
  const tableBodyCellStyle =
    'px-6 py-4 leading-5 text-center bg-white text-sm text-gray-900 tracking-wider whitespace-no-wrap leading-5';

  const [endpoints, setDatasets] = useState([]);
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
            `No llm endpoint found. Why not create a new one ? Click the button
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
            `${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/llm-endpoints/search`,
            {
              params: {
                org_id: session?.lastActiveOrganizationId,
                search: searchTerm
              }
            }
          );
          const searchResults = searchResponse.data;
          setDatasets(searchResults);
        } else {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/llm-endpoints/list`,
            {
              params: {
                org_id: session?.lastActiveOrganizationId
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
      {endpoints.length === 0 ? (
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
            <Link href="/add/endpoint">
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
                  &nbsp; Create Endpoint
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
              <th className={tableHeaderCellStyle}>API Endpoint</th>
              <th className={tableHeaderCellStyle}>Requests / Minute</th>
              <th className={tableHeaderCellStyle}>Requests Payload</th>
              <th className={tableHeaderCellStyle}>View</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {endpoints.map((endpoint: any) => (
              <React.Fragment key={endpoint.id}>
                <tr key={endpoint.id} onClick={() => handleRowClick(endpoint)}>
                  <td className={tableBodyCellStyle}>
                    {new Date(endpoint.ts).toLocaleString()}
                  </td>
                  <td className={tableBodyCellStyle}>{endpoint.name}</td>
                  <td className={tableBodyCellStyle}>
                    {endpoint.endpoint_url}
                  </td>
                  <td className={tableBodyCellStyle}>
                    {endpoint.requests_per_minute}
                  </td>
                  <td className={tableBodyCellStyle}>
                    {JSON.stringify({
                      [endpoint.payload_user_key]: 'user_id',
                      [endpoint.payload_message_key]: 'user_chat'
                    })}
                  </td>

                  <td className={tableBodyCellStyle}>
                    <Link
                      href={`/view/endpoints/${endpoint.id}`}
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-sm text-gray-900 hover:text-blue-500"
                      />
                    </Link>
                  </td>
                </tr>
                {selectedInterview && selectedInterview.id === endpoint.id && (
                  <tr></tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EndpointList;
