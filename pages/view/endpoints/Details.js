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

const DatasetDetails = ({ llm_endpoint_id: llm_endpoint_id }) => {
    // Existing code...

    const [qaData, setQaData] = useState([]);
    const { session } = useClerk();
    const { isLoaded, userId, sessionId, getToken, orgId } = useAuth();
    const [endpointName, setEndpointName] = useState('');
    const [endpointURL, setEndpointURL] = useState('');
    const [ts, setTs] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [payloadFormat, setPayloadFormat] = useState('');
    const [payloadUserKey, setPayloadUserKey] = useState('');
    const [payloadMessageKey, setPayloadMessageKey] = useState('');
    const [payloadResponseKey, setPayloadResponseKey] = useState('');
    const [httpMethod, setHttpMethod] = useState('');
    const [request_per_minute, setRequestPerMinute] = useState('');

    const tableHeaderCellStyle =
    'px-4 py-2 leading-5 text-center bg-gray-50 text-sm text-gray-900 tracking-wider';
  const tableBodyCellStyle =
    'px-6 py-4 leading-5 text-center bg-white text-sm text-gray-900 tracking-wider whitespace-no-wrap leading-5';

    useEffect(() => {
        fetchDatasetDetails();
    }, [session]);

    if (!session) {
        return null;
    }

    if(!llm_endpoint_id) {
        return null;
    }
    

    const fetchDatasetDetails = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/llm-endpoint`, {
                params: {
                    llm_endpoint_id: llm_endpoint_id,
                    org_id: session.lastActiveOrganizationId,
                },
            });
            const data = response.data;
            console.log(data); // Handle the retrieved data as needed
            setEndpointName(data.name);
            setEndpointURL(data.endpoint_url);
            setTs(data.ts);
            setAccessToken(data.access_token);
            setPayloadFormat(data.payload_format);
            setPayloadUserKey(data.payload_user_key);
            setPayloadMessageKey(data.payload_message_key);
            setHttpMethod(data.http_method);
            setRequestPerMinute(data.requests_per_minute);
            setPayloadResponseKey(data.payload_response_key);
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
                {session && !isLoading ? (

                    <div>
                        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                            <h2 className="text-xl font-bold mb-4 items-center justify-center">{endpointName}</h2>
                            <div className="grid grid-cols-12 gap-2 text-sm">
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Created At:</div>
                                    <div className="text-gray-700">{new Date(ts).toLocaleString()}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Name:</div>
                                    <div className="text-gray-700">{endpointName}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Endpoint URL:</div>
                                    <div className="text-gray-700">{endpointURL}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Access Token:</div>
                                    <div className="text-gray-700">{accessToken}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-2 text-sm mt-4">
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Payload Format:</div>
                                    <div className="text-gray-700">{payloadFormat}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Payload User Key:</div>
                                    <div className="text-gray-700">{payloadUserKey}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Payload Message Key:</div>
                                    <div className="text-gray-700">{payloadMessageKey}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Payload Response Key:</div>
                                    <div className="text-gray-700">{payloadResponseKey}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">HTTP Method:</div>
                                    <div className="text-gray-700">{httpMethod}</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="font-bold mb-2">Requests / Minute:</div>
                                    <div className="text-gray-700">{request_per_minute}</div>   
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                ) : (
                    <div>
                    {isLoading ? (
                        <div>
                            <p>
                                Endpoint Details <span className="font-bold">{endpointName}</span>
                            </p>
                            <button
                                className="bg-gray-700 text-sm text-white px-4 py-2 rounded-md mt-4"
                                onClick={() => {
                                    fetchDatasetDetails();
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
