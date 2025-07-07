'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// A wrapper component to ensure useSearchParams is used within Suspense
function VerificationComponent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your account...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification token not found.');
      return;
    }

    const verifyToken = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        // NOTE: Make sure your backend endpoint is correct.
        // I am assuming '/auth/verify' here.
        const res = await fetch(`${apiUrl}/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Verification failed');
        }

        setStatus('success');
        setMessage('Your account has been successfully verified!');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'An error occurred during verification.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{
        status === 'verifying' ? 'Verifying...' :
        status === 'success' ? 'Verification Successful!' : 'Verification Failed'
      }</h1>
      <p className={`text-lg ${status === 'error' ? 'text-red-500' : 'text-gray-700'}`}>
        {message}
      </p>
      {status === 'success' && (
        <Link href="/login" className="inline-block px-6 py-3 mt-6 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Proceed to Login
        </Link>
      )}
    </div>
  );
}

  

// The main page component must wrap the component using useSearchParams in a <Suspense>
export default function VerifyEmailPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <Suspense fallback={<div>Loading...</div>}>
                    <VerificationComponent />
                </Suspense> {/* <-- This is the corrected closing tag */}
            </div>
        </div>
    )
}