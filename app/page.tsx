'use client'

import { sql } from '@vercel/postgres';
import { Card, Title, Text, Button, Grid } from '@tremor/react';
import Search from './search';
import UsersTable from './table';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Grid numItemsSm={1} numItemsLg={3} className="gap-12">
        <Search />
        
        <Link href="/add-dataset">
          <Button className="mt-5">
            Add Dataset
          </Button>
        </Link>
      </Grid>
    </main>
  );
}