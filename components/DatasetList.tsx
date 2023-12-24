import React, { useState, useEffect } from 'react';
import axios from 'axios'; // You need to install axios if not already installed
import '../app/globals.css';
import Link from 'next/link';
import { faChevronRight, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@clerk/nextjs';
import { useClerk } from '@clerk/nextjs';

function DatasetList({ searchTerm }: { searchTerm: string }) {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const tableHeaderCellStyle =
    'px-4 py-2 leading-5 text-center bg-gray-50 text-sm text-gray-900 tracking-wider';
  const tableBodyCellStyle =
    'px-6 py-4 leading-5 text-center bg-white text-sm text-gray-900 tracking-wider whitespace-no-wrap leading-5';

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

        const response = await fetch(`/api/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const data = await response.json();
        setOrgId(data.orgId);
        setSuccessMessage(1);
        if (data.orgId) {
          setUserMessage(
            `No dataset found. Why not create a new dataset? Click the button
            above to get started!`
          );
          setOrgId(data.orgId);
        } else {
            setSuccessMessage(0);
            setUserMessage(
                'No organization found. Please create an organization first.'
            );
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setSuccessMessage(0);
        setUserMessage(
            'No organization found. Please create an organization first.'
          );
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
            `/rageval/search/dataset/`,{
                params: {
                    org_id: session?.lastActiveOrganizationId,
                    search: searchTerm,
                },
            });
          const searchResults = searchResponse.data;
          setDatasets(searchResults);
        } else {
          // If search term is empty, use the default API route
          const response = await axios.get(`/rageval/list/dataset/`, {
            params: {
                org_id: session?.lastActiveOrganizationId,
            },
          });
          const fetchedInterviews = response.data;
          setDatasets(fetchedInterviews);
        }
        setIsLoading(false); // Data has been fetched
        setSuccessMessage(1);
      } catch (error: any) {
        const code = error.response.data.code;
        
        setSuccessMessage(0);
        console.error('Error fetching interviews:', error);
        setIsLoading(false); // Data fetching failed
      }
    };
    fetchData();
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
      ) : (
        <table className="container min-w-full border-collapse border table-auto" style={{ marginTop: '16px' }}>
            <thead>
                <tr>
                <th className={tableHeaderCellStyle}>Timestamp</th>
                <th className={tableHeaderCellStyle}>Name</th>
                <th className={tableHeaderCellStyle}>Generation</th>
                <th className={tableHeaderCellStyle}>Number Chat QA</th>
                <th className={tableHeaderCellStyle}>Sample %</th>
                <th className={tableHeaderCellStyle}>Chat Type</th>
                <th className={tableHeaderCellStyle}>Model Used</th>
                <th className={tableHeaderCellStyle}>View</th>
                </tr>
            </thead>
            <tbody className="bg-white">
                {datasets.map((dataset:any) => (
                <React.Fragment key={dataset.id}>
                    <tr key={dataset.id} onClick={() => handleRowClick(dataset)}>
                    <td className={tableBodyCellStyle}>
                        {new Date(dataset.ts).toLocaleString()}
                    </td>
                    <td className={tableBodyCellStyle}>{dataset.name}</td>
                    <td className={tableBodyCellStyle}>{dataset.gen_id}</td>
                    <td className={tableBodyCellStyle}>{dataset.number_of_questions}</td>
                    <td className={tableBodyCellStyle}>{dataset.sample_size}</td>
                    <td className={tableBodyCellStyle}>{dataset.dataset_type}</td>
                    <td className={tableBodyCellStyle}>{dataset.model_name}</td>
                    <td className={tableBodyCellStyle}>
                        <Link href={`/view/datasets/${dataset.id}`} rel="noopener noreferrer">
                        <FontAwesomeIcon
                            icon={faChevronRight}
                            className="text-sm text-gray-900 hover:text-blue-500"
                        />
                        </Link>
                    </td>
                    </tr>
                    {/* Details row */}
                    {selectedInterview &&
                    selectedInterview.id === dataset.id && (
                    <tr>
                        
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
