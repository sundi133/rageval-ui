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

function AssessmentList({ searchTerm }: { searchTerm: string }) {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const tableHeaderCellStyle =
    'px-4 py-2 leading-5 text-center bg-gray-50 text-sm text-gray-900 tracking-wider';
  const tableBodyCellStyle =
    'px-6 py-4 leading-5 text-center bg-white text-sm text-gray-900 tracking-wider whitespace-no-wrap leading-5';

  const [evaluations, setEvaluations] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
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
            `No llm/rag evaluations found. Why not create a new one ? Add a simiulation to get started in chat simulator`
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
            `${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/evaluation/search`,
            {
              params: {
                org_id: session?.lastActiveOrganizationId,
                user_id: userId,
                search: searchTerm
              }
            }
          );
          setEvaluations(searchResponse.data);
        } else {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/evaluation/list`,
            {
              params: {
                user_id: userId,
                org_id: session?.lastActiveOrganizationId
              }
            }
          );
          setEvaluations(response.data);
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
      {evaluations.length === 0 ? (
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
        <table
          className="container min-w-full border-collapse border table-auto"
          style={{ marginTop: '16px' }}
        >
          <thead>
            <tr>
              <th className={tableHeaderCellStyle}>Timestamp</th>
              <th className={tableHeaderCellStyle}>Id</th>
              <th className={tableHeaderCellStyle}>Score</th>
              <th className={tableHeaderCellStyle}>Evaluation</th>
              <th className={tableHeaderCellStyle}>Dataset</th>
              <th className={tableHeaderCellStyle}>Endpoint</th>
              <th className={tableHeaderCellStyle}>Status</th>
              <th className={tableHeaderCellStyle}>View</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {evaluations.map((evaluation: any) => (
              <React.Fragment
                key={`${evaluation.simulation_id}-${evaluation.last_updated}`}
              >
                <tr
                  key={`${evaluation.id}-${evaluation.last_updated}`}
                  onClick={() => handleRowClick(evaluation)}
                >
                  <td className={tableBodyCellStyle}>
                    {new Date(evaluation.last_updated).toLocaleString()}
                  </td>
                  <td className={tableBodyCellStyle}>
                    {evaluation.evaluation_id}
                  </td>
                  <td className={tableBodyCellStyle}>
                    {evaluation.average_score.toFixed(4)}
                  </td>
                  {/* <td className={tableBodyCellStyle}>
                            {dataset.status === 'completed' && <FontAwesomeIcon icon={faCheckCircle} />}
                            {dataset.status === 'in_progress' && <FontAwesomeIcon icon={faSpinner} spin />}
                            {dataset.status === 'error' && <FontAwesomeIcon icon={faTimesCircle} />}
                            {(!dataset.status || dataset.status === "") && ""}
                        </td> */}
                  <td className={tableBodyCellStyle}>
                    {evaluation.simulation_name}
                  </td>
                  <td className={tableBodyCellStyle}>
                    {evaluation.dataset_name}
                  </td>
                  <td className={tableBodyCellStyle}>
                    {evaluation.endpoint_name}
                  </td>
                  <td className={tableBodyCellStyle}>
                    {evaluation.status === 'completed' && (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        style={{ color: 'green' }}
                      />
                    )}
                    {evaluation.status === 'in_progress' && (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        style={{ color: 'blue' }}
                      />
                    )}
                    {evaluation.status === 'error' && (
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        style={{ color: 'red' }}
                      />
                    )}
                    {(!evaluation.status || evaluation.status === '') && ''}
                  </td>
                  <td className={tableBodyCellStyle}>
                    <Link
                      href={`/view/assessment/${evaluation.evaluation_profile_id}`}
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
                {selectedInterview &&
                  selectedInterview.id === evaluation.id && (
                    <tr>
                      <td colSpan={6} className={tableBodyCellStyle}>
                        {/* Display additional details based on the selected interview */}
                        <div>
                          <strong>Simulation ID:</strong>{' '}
                          {evaluation.evaluation_profile_id}
                        </div>
                        <div>
                          <strong>Average Score:</strong>{' '}
                          {evaluation.average_score}
                        </div>
                        <div>
                          <strong>Dataset Name:</strong>{' '}
                          {evaluation.dataset_name}
                        </div>
                        <div>
                          <strong>Endpoint Name:</strong>{' '}
                          {evaluation.endpoint_name}
                        </div>
                        <div>
                          <strong>Simulation Name:</strong>{' '}
                          {evaluation.simulation_name}
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

export default AssessmentList;
