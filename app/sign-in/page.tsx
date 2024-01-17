import { SignIn } from '@clerk/nextjs';
import '../../app/globals.css';
import Head from 'next/head';

export default function Page() {
  return (
    <div>
      <span className="container flex justify-center items-center text-gray-900 text-lg font-semibold mt-4">
        LLM / RAG Agent Evaluation Framework
      </span>
      <div className="container flex justify-center items-center mt-16">
        <SignIn afterSignInUrl={"/add/dataset"} afterSignUpUrl={"/add/dataset"} redirectUrl={"/add/dataset"} />
      </div>
    </div>
  );
}
