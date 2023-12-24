'use client'

import { sql } from '@vercel/postgres';
import { Card, Title, Text, Button, Grid } from '@tremor/react';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { use, useEffect, useState } from 'react';
import '../globals.css';

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  
  const { session } = useClerk();
  const [searchTerm, setSearchTerm] = useState('');

  // Check if there is an active session
  if (!session) {
    // Handle the case where there is no active session
    return null;
  }

  const handleSearch = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setSearchTerm(event.currentTarget.value);
    }
  };

  return (
    <div>
      {session ? (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
          
          <div className="flex justify-between items-center">
            {' '}
            <div className="relative flex items-center w-full">
              {' '}
              <input
                disabled={!session}
                type="text"
                placeholder="Search evaluations... press enter to submit"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onKeyDown={handleSearch}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
          </div>
        </main>
      ) : (
        <></>
      )}
    </div>
  );
}