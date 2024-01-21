'use client';

import { UserButton } from '@clerk/nextjs';
import { Session } from 'inspector';
import { useAuth } from '@clerk/nextjs';
import { sql } from '@vercel/postgres';
import { Card, Title, Text, Button, Grid } from '@tremor/react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import SignInButtons from '../sign-in-buttons';
import { useClerk } from '@clerk/nextjs';
import { use, useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const { session } = useClerk();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [keys, setKeys] = useState([]);
  const [error, setError] = useState('');
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [name , setName] = useState('');

  useEffect( ()  => {
    const fetchData = async () => {
      if (session) {
        const tokens = await axios.get(
          `${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/tokens`,{
              params: {
                  org_id: session?.lastActiveOrganizationId,
                  user_id: userId,
              },
          });
        setKeys(tokens.data);
      }
    };
    fetchData();
  }, [session]);

  if (!session) {
    return null;
  }

  const submitKey = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('org_id', session?.lastActiveOrganizationId ?? '');
    formData.append('user_id', userId ?? '');
    formData.append('name', name ?? '');
    const response = await axios.post(`${process.env.NEXT_PUBLIC_RAGEVAL_BACKEND_URL}/api/token/add`, formData);

    if (response.status === 200) {
      setSuccessMessage(response.data.message);

    } else {
      setError(response.data.message);
    }
    setIsLoading(false);
  };

  return (
    <div>
      {session ? (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
          <h2 className="text-xl font-bold mt-4">Your Token Keys</h2>

          <form
            className="rounded mt-4 text-sm"
            style={{
              maxHeight: '80vh',
              overflowY: 'auto',
              display: 'flex', // Enable flexbox
              flexDirection: 'column', // Stack children vertically
              justifyContent: 'space-between' // Center vertically
            }}
          >
            <div className="container mb-4 flex">

              <div className="w-1/2 pr-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded p-2 text-sm font-medium text-gray-700"
                  required
                />
              </div>

            </div>
            {successMessage && (
              <div className="container mb-4 flex text-sm text-gray-500">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="container mb-4 flex text-sm text-red-500">
                {error}
              </div>
            )}

          </form>
          <Button
            className="bg-gray-900 hover:bg-gray-700 text-white text-sm py-2 border border-gray-900 rounded focus:outline-none focus:shadow-outline"
            onClick={submitKey}
            type="button"
            disabled={isLoading}
          >
            Generate Token
          </Button>
          <div className="container min-w-full mt-4">
            <table className="container min-w-full border-collapse border table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token
                  </th>
                  
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {keys.map((keyData: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(keyData.ts).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {keyData.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {keyData.token}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      ) : (
        <SignInButtons />
      )}
    </div>
  );
}
