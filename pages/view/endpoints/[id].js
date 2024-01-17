'use client'
import React from 'react';
import { sql } from '@vercel/postgres';
import { Card, Title, Text, Button, Grid } from '@tremor/react';
import Link from 'next/link';
import Details from './Details';
import { Suspense } from 'react';
import Navbar from '../../../app/navbar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useClerk } from '@clerk/nextjs';
import '../../../app/globals.css';

export default function IndexPage() {
  const router = useRouter();
  const { id } = router.query; // Get the interview ID from the route
  const { session } = useClerk();

  // Check if there is an active session
  if (!session) {
    // Handle the case where there is no active session
    return null;
  }

  if(!id) {
    return <div>Loading...</div>
  }

  return (
    <main>
      <Navbar/>
      <Details llm_endpoint_id={id} />        
    </main>
  );
}

