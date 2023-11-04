import React, { useState } from 'react';
import '../app/globals.css';

export default function InterviewJob() {
  const [interviewerId, setInterviewerId] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [jobRoleName, setJobRoleName] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState('');
  const [durationInMinutes, setDurationInMinutes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Interviewer ID:', interviewerId);
    console.log('Candidate Name:', candidateName);
    console.log('Candidate Email:', candidateEmail);
    console.log('Job Role Name:', jobRoleName);
    console.log("Interview Question's:", interviewQuestions);
    console.log('Duration in Minutes:', durationInMinutes);
  };

  return (
    <div className="container mx-auto p-4 h-screen flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 rounded-md p-4 max-w-md w-full"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Interviewer ID:
          </label>
          <input
            type="text"
            value={interviewerId}
            onChange={(e) => setInterviewerId(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Candidate Name:
          </label>
          <input
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Candidate Email:
          </label>
          <input
            type="text"
            value={candidateEmail}
            onChange={(e) => setCandidateEmail(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Job Role Name:
          </label>
          <input
            type="text"
            value={jobRoleName}
            onChange={(e) => setJobRoleName(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Interview Question's:
          </label>
          <textarea
            value={interviewQuestions}
            onChange={(e) => setInterviewQuestions(e.target.value)}
            className="w-full border rounded p-2"
            rows="4"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Duration in Minutes:
          </label>
          <input
            type="number"
            value={durationInMinutes}
            onChange={(e) => setDurationInMinutes(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
}
