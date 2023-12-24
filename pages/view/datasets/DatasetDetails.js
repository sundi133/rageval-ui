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

const DatasetDetails = ({ datagen_id: datagen_id }) => {
    // Existing code...

    const [qaData, setQaData] = useState([]);
    const { session } = useClerk();
    const { isLoaded, userId, sessionId, getToken, orgId } = useAuth();
    const [datasetName, setDatasetName] = useState('');
    const [datasetTs, setDatasetTs] = useState('');
    const [expandedReference, setExpandedReference] = useState(false);
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);
    const [sampleSize, setSampleSize] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const tableHeaderCellStyle =
    'px-4 py-2 leading-5 text-center bg-gray-50 text-sm text-gray-900 tracking-wider';
  const tableBodyCellStyle =
    'px-6 py-4 leading-5 text-center bg-white text-sm text-gray-900 tracking-wider whitespace-no-wrap leading-5';

    useEffect(() => {
        fetchDatasetDetails();
        fetchChatData();
    }, [session]);

    if (!session) {
        return null;
    }

    if(!datagen_id) {
        return null;
    }
    const fetchChatData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/qa-data', {
            params: {
                dataset_id: datagen_id,
                org_id: session.lastActiveOrganizationId,
                skip: 0,  // Your desired skip value
                limit: 20,  // Your desired limit value
            },
            });

            const data = response.data;
            console.log(data);  // Handle the retrieved data as needed
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
            const response = await axios.get('/api/dataset', {
                params: {
                    dataset_id: datagen_id,
                    org_id: session.lastActiveOrganizationId,
                },
            });
            const data = response.data;
            console.log(data); // Handle the retrieved data as needed
            setDatasetName(data.name);
            setDatasetTs(data.ts);
            setNumberOfQuestions(data.number_of_questions);
            setSampleSize(data.sample_size);

            
        } catch (error) {
            console.error('Error fetching dataset details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    
      
    
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">

            <div>
                {/* Existing code... */}
                {session && qaData.length > 0 ? (

                    <div>
                        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                            <h2 className="text-xl font-bold mb-4 items-center justify-center">QA Data</h2>
                            <div className="grid grid-cols-8 gap-4">
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Name:</div>
                                    <div className="text-gray-700">{datasetName}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Created At:</div>
                                    <div className="text-gray-700">{datasetTs}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Number of Questions:</div>
                                    <div className="text-gray-700">{numberOfQuestions}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Sample Percentage:</div>
                                    <div className="text-gray-700">{sampleSize} %</div>
                                </div>
                            </div>
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
                                {qaData.map((data) => (
                                    <Fragment key={data.id}>
                                        <tr className="border-b">
                                            <td className={tableBodyCellStyle}>{data.ts}</td>
                                            <td className={tableBodyCellStyle}>
                                                <ul className="text-left space-y-4">
                                                    {JSON.parse(data.chat_messages).question_answer && (
                                                        <li className='mb-2'> 
                                                            <strong>Question:</strong> {JSON.parse(data.chat_messages).question_answer.question}
                                                            <br/>
                                                            <strong>Answer:</strong> {JSON.parse(data.chat_messages).question_answer.answer}
                                                        </li>
                                                    )}
                                                    {JSON.parse(data.chat_messages).question_answer &&
                                                        [...Array(3).keys()].map((index) => (
                                                            JSON.parse(data.chat_messages).question_answer[`follow_up_question_${index + 1}`] && (
                                                                <li key={index + 1}>
                                                                    <strong>Follow-up Question {index + 1}: </strong>
                                                                    {JSON.parse(data.chat_messages).question_answer[`follow_up_question_${index + 1}`]},{' '}
                                                                    <br/>
                                                                    <strong>Follow-up Answer {index + 1}: </strong>{' '}
                                                                    {JSON.parse(data.chat_messages).question_answer[`follow_up_answer_${index + 1}`]}
                                                                </li>
                                                            )
                                                        ))}
                                                </ul>
                                            </td>
                                            <td className={tableBodyCellStyle}>
                                                <button
                                                    className="text-blue-500 underline cursor-pointer"
                                                    onClick={() => setExpandedReference(expandedReference === data.id ? null : data.id)}
                                                >
                                                    {expandedReference === data.id ? 'Collapse Reference' : 'Expand Reference'}
                                                </button>
                                                {expandedReference === data.id && (
                                                    <div className="mt-2">
                                                        {data.reference_chunk}
                                                    </div>
                                                )}
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
                            <p>Chat QA data generation is in progress </p>
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
}

export default DatasetDetails;
