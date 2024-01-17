import React, { useState, ChangeEvent, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@tremor/react';
import axios from 'axios';
import { useClerk } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import '../app/globals.css';
import { verify } from 'crypto';
import { request } from 'http';

const generateRandomName = () => {
    const nouns = [
        'Explorer',
        'Adventurer',
        'Pioneer',
        'Dreamer',
        'Voyager',
        'Traveler',
        'Nomad',
        'Seeker',
        'Wanderer',
        'Discoverer',
    ];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `RAG Endpoint ${randomNoun}`;
};

export default function DatasetForm() {
    const [name, setName] = useState(generateRandomName());
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [generatedDatasetId, setGeneratedDatasetId] = useState<string>('');
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const { session } = useClerk();
    const [orgId, setOrgId] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [isEndpointValid, setIsEndpointValid] = useState<boolean>(true);
    const [payloadFormat, setPayloadFormat] = useState<string>('json'); // Default format is JSON
    const [payloadUserKey, setPayloadUserKey] = useState<string>(''); // User-provided payload keys   
    const [payloadMessageKey, setPayloadMessageKey] = useState<string>(''); // User-provided payload keys
    const [payloadResponseKey, setPayloadResponseKey] = useState<string>(''); // User-provided payload keys
    const [httpMethod, setHttpMethod] = useState<string>('post'); // User-provided payload keys
    const [accessToken, setAccessToken] = useState<string>(''); // User-provided payload keys
    const [payloadSample, setPayloadSample] = useState<string>(''); // User-provided payload sample
    const [requestsPerMinute, setRequestsPerMinute] = useState<number>(10); // User-provided payload sample
    const [responsePayloadSample, setResponsePayloadSample] = useState<string>(''); // User-provided payload sample
    
    function validateEndpoint(endpoint: string) {
        return endpoint.startsWith("http://") || endpoint.startsWith("https://");
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setOrgId(session?.lastActiveOrganizationId ?? '');
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (session) {
            fetchUserData();
        }
    }, [session]);

    if (!session) {
        return null;
    }

    const generateSamplePayload = (payloadUserKey: string, payloadMessageKey: string): string => {
        // Example for JSON payload
        const samplePayload = {
            [payloadUserKey]: 'user_id_here',
            [payloadMessageKey]: 'user message here',
        };

        return JSON.stringify(samplePayload);
    };

    const verifyPayload = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setErrorMsg('');
            setIsLoading(true);
            setFormSubmitted(true);
            setSuccessMessage('');
            if (name.trim() === '') {
                setErrorMsg('Name is required');
                return;
            }
            if (!isEndpointValid) {
                setErrorMsg('Endpoint must start with https:// or http://');
                return;
            }
            const samplePayload = generateSamplePayload(payloadUserKey, payloadMessageKey);
            
            const curlCommand = `curl -X POST ${apiEndpoint}\n
-H "Content-Type: application/json"\n
${accessToken ? `-H "Authorization: Bearer ${accessToken}"\n\n-d '${samplePayload}'` : `-d ${samplePayload}`}
`;          

            const responseSamplePayload = {
                [payloadResponseKey]: 'response message here',
            };
            
            
            setPayloadSample(curlCommand);
            if (payloadFormat === 'json') {
                setResponsePayloadSample(JSON.stringify(responseSamplePayload, null, 2));
            } else {
                setResponsePayloadSample('response message here');
            }

        } catch (error) {
            console.error('Unexpected error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setErrorMsg('');
            setIsLoading(true);
            setFormSubmitted(true);
            setSuccessMessage('');
            if (name.trim() === '') {
                setErrorMsg('Name is required');
                return;
            }
            if (!isEndpointValid) {
                setErrorMsg('Endpoint must start with https://');
                return;
            }
            const formData = new FormData();
            formData.append('name', name);
            formData.append('userId', userId ?? '');
            formData.append('orgId', orgId ?? '');
            formData.append('endpoint_url', apiEndpoint);
            formData.append('access_token', accessToken);
            formData.append('payload_format', payloadFormat);
            formData.append('payload_user_key', payloadUserKey);
            formData.append('payload_message_key', payloadMessageKey);
            formData.append('payload_response_key', payloadResponseKey);
            formData.append('http_method', httpMethod);
            formData.append('requests_per_minute', requestsPerMinute.toString());
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/endpoint/add`,
                formData
            );

            if (response.status === 200) {
                console.log('Success:', response.data.message);
                setSuccessMessage(
                    "Great, Your endpoint has been created"
                );
                setGeneratedDatasetId(response.data.endpoint_id);
            } else {
                console.error('Error submitting form:', response.statusText);
                setError(response.statusText);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={`p-4 md:p-10 mx-auto max-w-7xl`}>

        <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white-100 rounded-md px-8 pt-6 pb-8 mb-4"
                    style={{
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        display: 'flex', // Enable flexbox
                        flexDirection: 'column', // Stack children vertically
                        justifyContent: 'space-between', // Center vertically
                    }}
                >
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Name:
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            API Endpoint:
                        </label>
                        <input
                            type="text"
                            value={apiEndpoint}
                            onChange={(e) => {
                                const newEndpoint = e.target.value;
                                const isValid = validateEndpoint(newEndpoint);
                                setApiEndpoint(newEndpoint);
                                setIsEndpointValid(isValid); // Assuming you have an errorMsg state variable
                            }}
                            className={`w-full border rounded p-2 ${isEndpointValid ? 'border-red-500' : ''}`}
                            required
                        />
                        {formSubmitted && errorMsg && (
                            <p className="text-red-500 text-sm mt-1">{errorMsg}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Access Token:
                        </label>
                        <input
                            type="text"
                            value={accessToken}
                            onChange={(e) => setAccessToken(e.target.value)}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>

                    <div className="mb-4 flex flex-wrap">
                        <div className="w-1/2 pr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Request Payload User Key:
                            </label>
                            <input
                                type="text"
                                value={payloadUserKey}
                                onChange={(e) => setPayloadUserKey(e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>

                        <div className="w-1/2 pr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Request Payload Message Key:
                            </label>
                            <input
                                type="text"
                                value={payloadMessageKey}
                                onChange={(e) => setPayloadMessageKey(e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>
                    </div>

                    <div className="mb-4 flex flex-wrap">
                        <div className="w-1/2 pr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Response Payload Message Key:
                            </label>
                            <input
                                type="text"
                                value={payloadResponseKey}
                                onChange={(e) => setPayloadResponseKey(e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>

                        <div className="w-1/2 pr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Response Payload Format:
                            </label>
                            <select
                                value={payloadFormat}
                                onChange={(e) => setPayloadFormat(e.target.value)}
                                className="w-full border rounded p-2"
                            >
                                <option value="json">JSON</option>
                                <option value="text">TEXT</option>
                            </select>
                        </div>
                        
                    </div>

                    <div className="mb-4 flex flex-wrap">
                        <div className="w-1/2 pr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                            HTTP Method:
                            </label>
                            <select
                                value={httpMethod}
                                onChange={(e) => setHttpMethod(e.target.value)}
                                className="w-full border rounded p-2"
                            >
                                <option value="post">POST</option>
                                {/* Add more options based on your supported formats */}
                            </select>
                        </div>

                        <div className="w-1/2 pr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Requests Per Minute:
                            </label>
                            <input
                                type="number"
                                value={requestsPerMinute}
                                onChange={(e) => {
                                    const newValue = Number(e.target.value);
                                    if (newValue >= 1 && newValue <= 100) {
                                    setRequestsPerMinute(newValue);
                                    } else {
                                    }
                                }}
                                className="w-full border rounded p-2"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">

                        <Button
                            className="mt-2 fixed text-white text-sm bottom-4 transform bg-gray-900 text-white hover:bg-gray-700 border-white hover:border-white py-2 px-4 rounded"
                            style={{ zIndex: 1000 }}
                            disabled={isLoading}
                            onClick={verifyPayload}
                            type="button"
                        >
                            Check Payload
                        </Button>


                    </div>
                    
                    {payloadSample && responsePayloadSample && (
                        <div className="mb-4">
                            <span className='mt-2 font-semibold'>Request:</span>
                            <pre className="mt-2 text-xs text-gray-900" style={{ whiteSpace: 'pre-wrap' }}>
                                {payloadSample}
                            </pre>
                            <br />
                            <span className='mt-2 font-semibold'>Response:</span>
                            <pre className="mt-2 text-xs text-gray-900" style={{ whiteSpace: 'pre-wrap' }}>
                                {responsePayloadSample}
                            </pre>
                        </div>
                        
                    )}
                    
                </form>

                {successMessage && (
                    <p className="text-blue-500 text-sm mt-4">{successMessage}</p>
                )}
                <Button
                    className="mt-2 fixed text-white text-sm bottom-4 transform bg-gray-900 text-white hover:bg-gray-700 border-white hover:border-white py-2 px-4 rounded"
                    style={{ zIndex: 1000 }}
                    disabled={isLoading}
                    onClick={handleSubmit}
                    type="button"
                >
                    {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
            </div>
        </div>
        </main>
    );
}
