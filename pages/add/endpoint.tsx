'use client'
import React from 'react';
import { sql } from '@vercel/postgres';
import { Card, Title, Text, Button, Grid } from '@tremor/react';
import Search from '../../app/search';
import UsersTable from '../../app/table';
import Link from 'next/link';
import { useState } from 'react';
import EndpointForm from '../../components/endpoint-form';
import { Suspense } from 'react';
import Navbar from '../../app/navbar';
import { useClerk } from '@clerk/nextjs';

export default  function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  

  return (
    <main>
      <Navbar/>
      <EndpointForm />        
    </main>
  );
}

