'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // You need to install axios if not already installed
import '../app/globals.css';
import Link from 'next/link';
import { faChevronRight, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@clerk/nextjs';
import { useClerk } from '@clerk/nextjs';
import { faCheckCircle, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

function SimulationList({ searchTerm }: { searchTerm: string }) {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const tableHeaderCellStyle =
    'px-4 py-2 leading-5 text-center bg-gray-50 text-sm text-gray-900 tracking-wider';
  const tableBodyCellStyle =
    'px-6 py-4 leading-5 text-center bg-white text-sm text-gray-900 tracking-wider whitespace-no-wrap leading-5';

  const [simulations, setSimulations] = useState([]);
  const [selectedSimulation, setSelectedSimulation] = useState<any>(null);
  const [userMessage, setUserMessage] =
    useState(`No dataset found. Why not create a new dataset? Click the button
  above to get started!`); // Message to display to the user
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(0); // Message to display to the user
  const { session } = useClerk();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        setSuccessMessage(1);
        if (session?.lastActiveOrganizationId) {
          setUserMessage(
            `No evaluations found. Why not create a new one ? Add a evaluation to get started in above button`
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
            `${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/simulation/search`,{
                params: {
                    org_id: session?.lastActiveOrganizationId,
                    user_id: userId,
                    search: searchTerm,
                    skip: 0,
                    limit: 100,
                },
            });
          setSimulations(searchResponse.data);
        } else {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/simulation/list`, {
            params: {
                user_id: userId,
                org_id: session?.lastActiveOrganizationId,
                skip: 0,
                limit: 100,
            },
          });
          setSimulations(response.data);
        }
        setIsLoading(false); // Data has been fetched
        setSuccessMessage(1);
      } catch (error: any) {
        
        setSuccessMessage(0);
        console.error('Error fetching:', error);
        setIsLoading(false); // Data fetching failed
      }
    };
    if(session && session?.lastActiveOrganizationId) {
        fetchData();
    }
  }, [searchTerm]);

  if (!session) {
    return null;
  }


  const handleRowClick = (interview: any) => {
    setSelectedSimulation((prevSelectedInterview: any) => {
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
      {simulations.length === 0 ? (
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
                <Link href="/add/simulator">
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
                            &nbsp; Create Evaluation
                        </span>
                    </button>
                </Link>
            </div>
        </div>


      ) : (
        <table className="container min-w-full border-collapse border table-auto" style={{ marginTop: '16px' }}>
            <thead>
                <tr>
                    <th className={tableHeaderCellStyle}>Timestamp</th>
                    <th className={tableHeaderCellStyle}>Evaluation Id</th>
                    <th className={tableHeaderCellStyle}>Evaluation Name</th>
                    <th className={tableHeaderCellStyle}>Number of Users</th>
                    <th className={tableHeaderCellStyle}>Dataset</th>
                    <th className={tableHeaderCellStyle}>Endpoint</th>
                    <th className={tableHeaderCellStyle}>Status</th>
                    <th className={tableHeaderCellStyle}>View</th>
                </tr>
            </thead>
            <tbody className="bg-white">
                {simulations.map((simulation:any) => (
                <React.Fragment key={`${simulation.ts}-${simulation.simulation_id}`}>
                    <tr key={`${simulation.ts}-${simulation.simulation_id}`} onClick={() => handleRowClick(simulation)}>

                        <td className={tableBodyCellStyle}>{new Date(simulation.ts).toLocaleString()}</td>
                        <td className={tableBodyCellStyle}>{simulation.id}</td>
                        <td className={tableBodyCellStyle}>{simulation.name}</td>
                        <td className={tableBodyCellStyle}>{simulation.num_users}</td>
                        <td className={tableBodyCellStyle}>
                            <Link href={`/view/datasets/${simulation.dataset_id}`} rel="noopener noreferrer">
                                <span className="relative text-blue-500 inline-flex items-center">
                                    {simulation.dataset_id}
                                </span>
                            </Link>
                        </td>
                        <td className={tableBodyCellStyle}>
                            <Link href={`/view/endpoints/${simulation.endpoint_url_id}`} rel="noopener noreferrer">
                                <span className="relative text-blue-500 inline-flex items-center">
                                    {simulation.endpoint_url_id}
                                </span>
                            </Link>
                        </td>
                        <td className={tableBodyCellStyle}>
                            {simulation.status === 'completed' && <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} />}
                            {simulation.status === 'in_progress' && <FontAwesomeIcon icon={faSpinner} spin style={{ color: 'blue' }} />}
                            {simulation.status === 'error' && <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red' }} />}
                            {(!simulation.status || simulation.status === "") && ""}
                        </td>
                        <td className={tableBodyCellStyle}>
                            <Link href={`/view/simulation/${simulation.id}`} rel="noopener noreferrer">
                            <FontAwesomeIcon
                                icon={faChevronRight}
                                className="text-sm text-gray-900 hover:text-blue-500"
                            />
                            </Link>
                        </td>
                    </tr>
                    {/* Details row */}
                    {selectedSimulation &&
                    selectedSimulation.id === simulation.id && (
                      <tr>
                        <td colSpan={6} className={tableBodyCellStyle}>
                          {/* Display additional details based on the selected interview */}
                          <div>
                            <strong>Evaluation ID:</strong> {simulation.simulation_id}
                          </div>
                          <div>
                            <strong>Average Score:</strong> {simulation.average_score}
                          </div>
                          <div>
                            <strong>Dataset Name:</strong> {simulation.dataset_name}
                          </div>
                          <div>
                            <strong>Endpoint Name:</strong> {simulation.endpoint_name}
                          </div>
                          <div>
                            <strong>Evaluation Name:</strong> {simulation.simulation_name}
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

export default SimulationList;
