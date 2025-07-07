'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const body: any = { email, password };
      if (showOtpInput) {
        body.otp = otp;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      const verificationMessage = 'Your account is not verified.Please provide your otp to verify.';
      
      if (!res.ok) {
        if (data.message === verificationMessage) {
          setShowOtpInput(true);
          setMessage(verificationMessage);
          return;
        }
        throw new Error(data.message || 'Failed to log in');
      }

      // --- THIS IS THE CORRECTED LOGIC ---
      const userForContext = {
        id: data.userId,
        email: data.email,
      };

      // We now pass BOTH the user object and the token to the login function
      login(userForContext, data.accessToken);
      
      router.push('/jobs');
      // ------------------------------------

    } catch (err: unknown) { // FIXED: Changed 'any' to 'unknown'
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred.');
        }
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError('Please enter your email address above to resend the OTP.');
      return;
    }
    setError(null);
    setMessage('Sending a new OTP...');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }
      
      setMessage(data.message);
    } 
    catch (err: unknown) { // FIXED: Changed 'any' to 'unknown'
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred.');
        }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-blue-500 text-2xl font-bold text-center">Sign in to your account</h1>
        
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border-red-400 rounded-md">
            {error}
          </div>
        )}

        {message && (
            <div className="p-3 text-sm text-blue-700 bg-blue-100 border-blue-400 rounded-md">
                {message}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="text-gray-500 w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required value={password}  onChange={(e) => setPassword(e.target.value)}  className="text-gray-500 w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>

          {showOtpInput && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Verification Code (OTP)</label>
                <button type="button" onClick={handleResendOtp} className="text-gray-500 text-sm font-medium text-blue-600 hover:underline focus:outline-none">
                  Resend OTP
                </button>
              </div>
              <input id="otp" name="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="text-gray-500 w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500" placeholder="Check your email for the code"/>
            </div>
          )}
          
          <div>
            <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {showOtpInput ? 'Verify & Sign In' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}