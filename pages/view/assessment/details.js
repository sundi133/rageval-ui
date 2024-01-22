import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton
} from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useClerk } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import '../../../app/globals.css';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Dashboard } from './dashboard';
import Link from 'next/link';

const DatasetDetails = ({ evaluation_id: evaluation_id }) => {
  const [qaData, setQaData] = useState([]);
  const { session } = useClerk();
  const { isLoaded, userId, sessionId, getToken, orgId } = useAuth();
  const [errorType, setErrorType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [average_score, setAverageScore] = useState(0);
  const [dataset_name, setDatasetName] = useState('');
  const [endpoint_name, setEndpointName] = useState('');
  const [last_updated, setLastUpdated] = useState('');
  const [number_of_evaluations, setNumberOfEvaluations] = useState(0);
  const [simulation_id, setSimulationId] = useState('');
  const [simulation_name, setSimulationName] = useState('');
  const [expandedReference, setExpandedReference] = useState(false);
  const [distinct_users, setDistinctUsers] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [evaluationRunsScoreData, setEvaluationRunsScoreData] = useState([]);
  const [run_id, setRunId] = useState(null);
  const [run_ids, setRunIds] = useState([]);
  const tableHeaderCellStyle =
    'px-4 py-2 leading-5 text-center bg-gray-50 text-sm text-gray-900 tracking-wider';

  const tableBodyCellStyle =
    'px-6 py-4 leading-5 text-center bg-white text-sm text-gray-900 tracking-wider whitespace-no-wrap leading-5';

  const tableBodyExpandedCellStyle =
    'px-6 py-4 leading-5 bg-white text-sm text-gray-900 tracking-wider whitespace-no-wrap leading-5';

  const [sortOrder, setSortOrder] = useState('asc');
  const [scoreFilter, setScoreFilter] = useState(0);

  const handleSimulationRunIdChange = (event) => {
    setRunId(event.target.value);
  };

  // Function to toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    const sortedData = qaData.slice().sort((a, b) => {
      const averageScoreA = calculateAverageScore(a);
      const averageScoreB = calculateAverageScore(b);

      if (sortOrder === 'asc') {
        return averageScoreA - averageScoreB;
      } else {
        return averageScoreB - averageScoreA;
      }
    });
    setQaData(sortedData);
  };

  const fetchChatData = async () => {
    try {
      if (!run_id) return;
      setFormSubmitted(true);
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/evaluation/chat`,
        {
          params: {
            org_id: session.lastActiveOrganizationId,
            user_id: userId,
            skip: 0, // Your desired skip value
            limit: 100, // Your desired limit value
            filter_score: scoreFilter,
            run_id: parseInt(run_id)
          }
        }
      );

      const data = response.data;
      console.log(data); // Handle the retrieved data as needed
      setQaData(data);
    } catch (error) {
      console.error('Error fetching QA data:', error);
    } finally {
      setIsLoading(false);
      setFormSubmitted(false);
    }
  };

  const fetchEvaluationDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/evaluation/id`,
        {
          params: {
            user_id: userId,
            org_id: session.lastActiveOrganizationId,
            evaluation_profile_id: evaluation_id
          }
        }
      );
      const data = response.data[0];
      setSimulationName(data.simulation_name);
      setSimulationId(data.evaluation_profile_id);
      setLastUpdated(data.last_updated);
      setNumberOfEvaluations(data.number_of_evaluations);
      setAverageScore(data.average_score);
      setDatasetName(data.dataset_name);
      setEndpointName(data.endpoint_name);
      setDistinctUsers(data.distinct_users);
      setEvaluationRunsScoreData(response.data);
      setRunIds(response.data.map((data) => data.run_id));
      console.log(response.data);
      if (!run_id) {
        setRunId(response.data[0].run_id);
      }
    } catch (error) {
      console.error('Error fetching dataset details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScoreFilterChange = (event) => {
    setScoreFilter(event.target.value);
  };

  const applyScoreFilter = () => {
    fetchChatData();
  };

  const calculateAverageScore = (data) => {
    // Use the scores available in the loop to calculate the average
    // For example, assuming scores are available in an array called 'scores'
    const scores = [data.score.toFixed(4)]; // Add more scores if available
    const averageScore =
      scores.reduce((sum, score) => sum + parseFloat(score), 0) / scores.length;

    return isNaN(averageScore) ? 'N/A' : averageScore.toFixed(4);
  };

  useEffect(() => {
    fetchEvaluationDetails();
    fetchChatData();
    console.log(run_id);
    setRunId(run_id);
  }, [session, run_id, scoreFilter]);

  if (!session) {
    return null;
  }

  if (!evaluation_id || !simulation_id) {
    return null;
  }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div>
        {session ? (
          <div>
            <div className="mb-6 flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
              {run_ids.length > 0 && (
                <Dashboard
                  number_of_evaluations={number_of_evaluations}
                  mean_score={average_score.toFixed(4)}
                  distinct_users_simulated={distinct_users}
                  evaluations={evaluationRunsScoreData}
                  total_simulations={run_ids.length}
                />
              )}
            </div>

            <div className="mb-6 flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
              <div className="font-bold">
                Total Chat QA Data:{' '}
                <span className="text-gray-700 font-normal">
                  {qaData.length}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <label htmlFor="simulationRunIdSelect" className="font-bold">
                  Select Evaluation Run ID:
                </label>
                <select
                  id="simulationRunIdSelect"
                  onChange={handleSimulationRunIdChange}
                  value={run_id}
                  className="border border-gray-300 rounded-md w-36 py-1 text-sm text-gray-700 bg-white hover:border-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Run ID</option>
                  {run_ids.map((runId) => (
                    <option key={runId} value={runId}>
                      {runId}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={applyScoreFilter}
                className="bg-gray-900 hover:bg-gray-500 text-white px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Filter Scores above Threshold'}
              </button>

              <input
                type="text"
                value={scoreFilter}
                placeholder="Score Threshold"
                onChange={handleScoreFilterChange}
                className="border border-gray-300 rounded-md w-24 px-2 py-1 text-sm text-gray-700 focus:border-blue-500"
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <div className="grid grid-cols-10 gap-2 text-sm">
                <div className="col-span-2">
                  <div className="font-bold mb-2">Last evaluation run at:</div>
                  <div className="text-gray-700">
                    {new Date(last_updated).toLocaleString()}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="font-bold mb-2">Dataset:</div>
                  <div className="text-gray-700">{dataset_name}</div>
                </div>
                <div className="col-span-2">
                  <div className="font-bold mb-2">LLM Endpoint:</div>
                  <div className="text-gray-700">{endpoint_name}</div>
                </div>
                <div className="col-span-2">
                  <div className="font-bold mb-2">Evaluation Name:</div>
                  <div className="text-blue-500">
                    <Link href={`/view/simulation/${simulation_id}`}>
                      {simulation_name}
                    </Link>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="font-bold mb-2">Selected Sim Run Id:</div>
                  <div className="text-gray-700">{run_id}</div>
                </div>
              </div>
            </div>

            <table className="w-full mt-2 border-collapse border table-auto">
              <thead>
                <tr>
                  <th className={tableHeaderCellStyle}>Timestamp</th>
                  <th className={tableHeaderCellStyle}>Chat Messages</th>
                  <th
                    className={tableHeaderCellStyle}
                    onClick={toggleSortOrder}
                    style={{ cursor: 'pointer' }}
                  >
                    Mean Score
                    {sortOrder === 'asc' ? ' ▲' : ' ▼'}
                  </th>
                  <th className={tableHeaderCellStyle}>Reference Chunk</th>
                </tr>
              </thead>
              <tbody>
                {qaData.map((data) => (
                  <Fragment key={data.id}>
                    {expandedReference === data.id && (
                      <tr className="border-b">
                        <td colSpan={4} className={tableBodyExpandedCellStyle}>
                          <div className="text-sm">
                            <p>
                              <strong>Reference Chunk:</strong>
                            </p>
                            <p>{data.reference_chunk}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                    <tr className="border-b">
                      <td
                        className={tableBodyCellStyle}
                        style={{ 'vertical-align': 'top' }}
                      >
                        {new Date(data.timestamp).toLocaleString()}
                      </td>
                      <td className={tableBodyCellStyle}>
                        <ul className="text-left space-y-4">
                          {JSON.parse(data.chat_messages).question_answer && (
                            <li className="mb-2">
                              <strong>Question:</strong>{' '}
                              {
                                JSON.parse(data.chat_messages).question_answer
                                  .question
                              }
                              <br />
                              <strong>Answer:</strong>{' '}
                              {
                                JSON.parse(data.chat_messages).question_answer
                                  .answer
                              }
                              <br />
                              <strong>App Response:</strong>{' '}
                              {data.endpoint_response}
                              <br />
                              <strong>Score: </strong> {data.score.toFixed(4)}
                              <br />
                              <strong>Score Reason:</strong>{' '}
                              {data.score_reason ?? ''}
                            </li>
                          )}
                          {JSON.parse(data.chat_messages).question_answer &&
                            [...Array(3).keys()].map(
                              (index) =>
                                JSON.parse(data.chat_messages).question_answer[
                                  `follow_up_question_${index + 1}`
                                ] && (
                                  <li key={index + 1}>
                                    <strong>
                                      Follow-up Question {index + 1}:{' '}
                                    </strong>
                                    {
                                      JSON.parse(data.chat_messages)
                                        .question_answer[
                                        `follow_up_question_${index + 1}`
                                      ]
                                    }
                                    , <br />
                                    <strong>
                                      Follow-up Answer {index + 1}:{' '}
                                    </strong>{' '}
                                    {
                                      JSON.parse(data.chat_messages)
                                        .question_answer[
                                        `follow_up_answer_${index + 1}`
                                      ]
                                    }
                                    <br />
                                    <strong>
                                      App Response Follow-up Answer {index + 1}:{' '}
                                    </strong>{' '}
                                    {data.endpoint_response}
                                    <br />
                                    <strong>Score: </strong>{' '}
                                    {data.score.toFixed(4)}
                                    <br />
                                    <strong>Score Reason:</strong>{' '}
                                    {data.score_reason ?? ''}
                                  </li>
                                )
                            )}
                        </ul>
                      </td>
                      <td
                        className={tableBodyCellStyle}
                        style={{ 'vertical-align': 'top' }}
                      >
                        {calculateAverageScore(data)}
                      </td>
                      <td
                        className={tableBodyCellStyle}
                        style={{ 'vertical-align': 'top' }}
                      >
                        <button
                          className="text-blue-500 underline cursor-pointer"
                          onClick={() =>
                            setExpandedReference(
                              expandedReference === data.id ? null : data.id
                            )
                          }
                        >
                          {expandedReference === data.id
                            ? 'Collapse Reference'
                            : 'Expand Reference'}
                        </button>
                      </td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            {!isLoading && !formSubmitted ? (
              <div>
                <p>
                  Chat QA data evaluation is in progress for evaluation id -{' '}
                  <span className="font-bold">{evaluation_id}</span>
                </p>
                <button
                  className="bg-gray-700 text-sm text-white px-4 py-2 rounded-md mt-4"
                  onClick={() => {
                    fetchEvaluationDetails();
                    fetchChatData();
                  }}
                  disabled={isLoading}
                >
                  Refresh
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
        {/* Existing code... */}
      </div>
    </main>
  );
};

export default DatasetDetails;
