import { Fragment } from 'react';
import { useEffect, useState } from 'react';
import { useClerk } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import '../../../app/globals.css';
import axios from 'axios';

const DatasetDetails = ({ datagen_id: datagen_id, size: size }) => {
  const [qaData, setQaData] = useState([]);
  const { session } = useClerk();
  const [datasetName, setDatasetName] = useState('');
  const [datasetTs, setDatasetTs] = useState('');
  const [expandedReference, setExpandedReference] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [chunkSize, setChunkSize] = useState(0);
  const [sampleSize, setSampleSize] = useState(0);
  const [persona, setPersona] = useState('');
  const [dataSource, setDataSource] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('');
  const [dsType, setDsType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const tableHeaderCellStyle =
    'px-4 py-2 leading-5 text-center bg-gray-50 text-sm text-gray-900 tracking-wider';
  const tableBodyCellStyle =
    'px-6 py-4 leading-5 text-center bg-white text-sm text-gray-900 tracking-wider whitespace-no-wrap leading-5';

  const tableBodyExpandedCellStyle =
    'px-6 py-4 leading-5 bg-white text-sm text-gray-900 whitespace-no-wrap leading-5';

  // useEffect(() => {
  //     fetchDatasetDetails();
  //     fetchChatData();
  // }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchDatasetDetails();
      await fetchChatData();
    };

    if (status === 'completed' || status === 'error') {
      setIsCompleted(true);
    } else {
      fetchData();

      const interval = setInterval(() => {
        fetchData();
      }, 5000); // Fetch data every 5 seconds

      return () => clearInterval(interval);
    }
  }, [session, status]); // Add status as a dependency

  if (!session) {
    return null;
  }

  if (!datagen_id) {
    return null;
  }
  const fetchChatData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/qa-data`,
        {
          params: {
            dataset_id: datagen_id,
            org_id: session.lastActiveOrganizationId,
            skip: 0, // Your desired skip value
            limit: 100 // Your desired limit value
          }
        }
      );

      const data = response.data;
      setQaData(data);
    } catch (error) {
      console.error('Error fetching QA data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDatasetDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/dataset`,
        {
          params: {
            dataset_id: datagen_id,
            org_id: session.lastActiveOrganizationId
          }
        }
      );
      const data = response.data;
      setDatasetName(data.name);
      setDatasetTs(data.ts);
      setNumberOfQuestions(data.number_of_questions);
      setSampleSize(data.sample_size);
      setChunkSize(data.chunk_size ?? 2000);
      setPersona(data.persona);
      setDsType(data.dataset_type);
      setStatus(data.status);
      setDataSource(data.data_source);
      setErrorMessage(data.error_msg);
      setTags(data.tags);
    } catch (error) {
      console.error('Error fetching dataset details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={`p-4 md:p-10 mx-auto max-w-${size}`}>
      <div>
        {/* Existing code... */}
        {session ? (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <h2 className="text-xl font-bold mb-4 items-center justify-center">
                {datasetName} (.{dsType.toLowerCase()})
              </h2>
              <div className="grid grid-cols-12 gap-2 text-sm">
                <div className="col-span-2">
                  <div className="font-bold mb-2">Created At:</div>
                  <div className="text-gray-700">
                    {new Date(datasetTs).toLocaleString()}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="font-bold mb-2">Questions Per Sample:</div>
                  <div className="text-gray-700">{numberOfQuestions}</div>
                </div>
                <div className="col-span-2">
                  <div className="font-bold mb-2">Sample Percentage:</div>
                  <div className="text-gray-700">{sampleSize} %</div>
                </div>
                <div className="col-span-2">
                  <div className="font-bold mb-2">Chunk Size:</div>
                  <div className="text-gray-700">{chunkSize}</div>
                </div>
                <div className="col-span-2">
                  <div className="font-bold mb-2">Status:</div>
                  <div
                    className={
                      status === 'completed' ? 'text-green-500' : 'text-red-500'
                    }
                  >
                    {status}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="font-bold mb-2">Data Source:</div>
                  <div className="text-gray-700">{dataSource}</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-8 text-sm">
                <div className="col-span-12">
                  <div className="font-bold mb-2">Persona:</div>
                  <div className="text-gray-700">{persona}</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-8 text-sm">
                <div className="col-span-12">
                  <div className="font-bold mb-2">Tags:</div>
                  <div className="text-gray-700">{tags}</div>
                </div>
              </div>
              {!isCompleted && (
                <div className="mt-4 grid grid-cols-12 text-sm">
                  <div className="flex justify-start items-justify-start">
                    <div className="loader"></div>
                  </div>
                </div>
              )}
            </div>
            <table className="w-full mt-2 border-collapse border table-auto">
              <thead>
                <tr>
                  <th className={tableHeaderCellStyle}>Timestamp</th>
                  <th className={tableHeaderCellStyle}>Chat Messages</th>
                  <th className={tableHeaderCellStyle}>Reference Chunk</th>
                </tr>
              </thead>
              <tbody>
                {qaData.length === 0 && (
                  <tr className="border-b">
                    <td colSpan={3} className={tableBodyCellStyle}>
                      <div className="text-sm">
                        <p>{errorMessage}</p>
                      </div>
                    </td>
                  </tr>
                )}
                {qaData.length > 0 &&
                  qaData.map((data) => (
                    <Fragment key={data.id}>
                      {expandedReference && expandedReference === data.id && (
                        <tr className="border-b">
                          <td
                            colSpan={3}
                            className={tableBodyExpandedCellStyle}
                          >
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
                          style={{ verticalAlign: 'top' }}
                        >
                          {data.ts}
                        </td>
                        <td
                          className={tableBodyCellStyle}
                          style={{ verticalAlign: 'top' }}
                        >
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
                              </li>
                            )}
                            {JSON.parse(data.chat_messages).question_answer &&
                              [...Array(3).keys()].map(
                                (index) =>
                                  JSON.parse(data.chat_messages)
                                    .question_answer[
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
                                    </li>
                                  )
                              )}
                          </ul>
                        </td>
                        <td
                          className={tableBodyCellStyle}
                          style={{ verticalAlign: 'top' }}
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
            {!isLoading ? (
              <div>
                <p>
                  Chat QA data generation is in progress for{' '}
                  <span className="font-bold">{datasetName}</span>
                </p>
                <button
                  className="bg-gray-700 text-sm text-white px-4 py-2 rounded-md mt-4"
                  onClick={() => {
                    fetchDatasetDetails();
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
