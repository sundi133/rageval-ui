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
import { Button } from '@tremor/react';
import Link from 'next/link';

const DatasetDetails = ({ simulation_id: simulation_id }) => {

    const [ qaData, setQaData] = useState([]);
    const { session } = useClerk();
    const { isLoaded, userId, sessionId, getToken, orgId } = useAuth();
    const [ errorType, setErrorType] = useState('');
    const [ isLoading, setIsLoading] = useState(false);
    const [ expandedReference, setExpandedReference] = useState(false);
    const [ formSubmitted, setFormSubmitted ] = useState(false);

  
    const [ datasetId, setDatasetId ] = useState('');
    const [ endpointUrlId, setEndpointUrlId ] = useState('');
    const [ name, setName ] = useState('');
    const [ numUsers, setNumUsers ] = useState('');
    const [ orderOfQuestions, setOrderOfQuestions ] = useState('');
    const [ percentageOfQuestions, setPercentageOfQuestions ] = useState('');
    const [ ts, setTs ] = useState('');
    const [ successMessage, setSuccessMessage ] = useState('');
    const tableHeaderCellStyle =
    'px-4 py-2 leading-5 text-center bg-gray-50 text-sm text-gray-900 tracking-wider';
  const tableBodyCellStyle =
    'px-6 py-4 leading-5 text-center bg-white text-sm text-gray-900 tracking-wider whitespace-no-wrap leading-5';

   
    
    
    useEffect(() => {

        const fetchSimulationDetails = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/simulation/id`, {
                    params: {
                        user_id: userId,
                        org_id: session.lastActiveOrganizationId,
                        simulation_id: `${simulation_id}`,
                    },
                });
                const data = response.data;
                setDatasetId(data.dataset_id);
                setEndpointUrlId(data.endpoint_url_id);
                setName(data.name);
                setNumUsers(data.num_users);
                setOrderOfQuestions(data.order_of_questions);
                setPercentageOfQuestions(data.percentage_of_questions);
                setTs(data.ts);
    
            } catch (error) {
                console.error('Error fetching dataset details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        
        fetchSimulationDetails();
    }, [session, simulation_id, userId]);

    if (!session) {
        return null;
    }

    const triggerSimulation = async () => {
        console.log("Triggering simulation");

        try {
            setIsLoading(true);
            const formData = new FormData();

            formData.append('user_id', userId);
            formData.append('org_id', session.lastActiveOrganizationId);
            formData.append('simulation_id', simulation_id);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/simulation/trigger`, formData);

            if (response.status === 200) {
                // Handle success
                const data = response.data;
                setSuccessMessage(`Simulation id ${data.simulation_id} triggered successfully.`);

            } else {
                // Handle error
                setErrorType('Oops! failed to trigger simulation, please try again.');
            }
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
                {session ? (

                    <div>
                        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                            <h2 className="text-xl font-bold mb-4 items-center justify-center">Simulation {name}</h2>
                            <div className="grid grid-cols-8 gap-2 text-sm">
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Created At:</div>
                                    <div className="text-gray-700">{new Date(ts).toLocaleString()}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Dataset:</div>
                                    <div className="text-blue-500">
                                        <Link href={`/view/datasets/${datasetId}`} rel="noopener noreferrer">
                                            {datasetId}
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">LLM Endpoint:</div>
                                    <div className="text-blue-500">
                                        <Link href={`/view/endpoints/${endpointUrlId}`} rel="noopener noreferrer">
                                            {endpointUrlId}
                                        </Link>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="mt-4 grid grid-cols-8 gap-2 text-sm">
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Number of Users:</div>
                                    <div className="text-gray-700">{numUsers}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Order of Questions:</div>
                                    <div className="text-gray-700">{orderOfQuestions}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Percentage of Questions:</div>
                                    <div className="text-gray-700">{percentageOfQuestions}</div>
                                </div>
                              
                                
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                            <Button
                                className="bg-gray-900 border border-white hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                onClick={triggerSimulation}
                                disabled={isLoading}
                            >
                                
                                {isLoading ? 'Submitting retrigger...' : 'Retrigger Simulation'}

                            </Button>
                        </div>

                        {successMessage ? (
                            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                                <div className="text-xl font-bold mb-4 items-center justify-center">Simulation Triggered Successfully</div>
                                <div className="text-gray-700">{successMessage}</div>
                            </div>
                        ) : (
                            <></>
                        )}

                        {errorType ? (
                            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                                <div className="text-xl font-bold mb-4 items-center justify-center">Error Triggering Simulation</div>
                                <div className="text-gray-700">{errorType}</div>
                            </div>
                        ) : (
                            <></>
                        )}

                    </div>
                ) : (
                    <div>
                    {!isLoading && !formSubmitted ? (
                        <div>
                           
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
