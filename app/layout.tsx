import './globals.css';
import Nav from './nav';
import Toast from './toast';
import { Suspense } from 'react';
import AuthProvider from './authprovider';
import { ClerkProvider } from '@clerk/nextjs';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { useClerk } from '@clerk/nextjs';

export const metadata = {
  title: 'Rageval: An LLM Agent Evaluation Framework',
  description:
    'Rageval is an LLM agent evaluation framework that allows you to evaluate your agents in a variety of environments, personas and scenarios.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full bg-white">
        <body className="h-full">
          <Suspense>
            <Nav />
          </Suspense>
          <AuthProvider>{children}</AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
