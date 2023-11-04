'use client'
import React from 'react';
import { sql } from '@vercel/postgres';
import { Card, Title, Text, Button, Grid } from '@tremor/react';
import Search from '../app/search';
import UsersTable from '../app/table';
import Link from 'next/link';
import { useState } from 'react';
import InterviewForm from '../components/job-form';
import { Suspense } from 'react';
import Navbar from '../app/navbar';
import { auth } from '../app/auth';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

  
export default  function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  

  return (
    <main>
      <Navbar user="" />
      <InterviewForm />        
    </main>
  );
}

