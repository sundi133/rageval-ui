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
            
            <Link href="/add/dataset">
              <Button className="bg-gray-900 text-white hover:bg-gray-700 border-white hover:border-white pl-4">
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
                  &nbsp; Setup CICD
                </span>
              </Button>
            </Link>
          </div>
        </main>
      ) : (
        <></>
      )}
    </div>
  );
}