'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UploadCvPage() {
  const { token } = useAuth(); // We need the auth token to make a secure request
  const router = useRouter();
  
  // State to hold the file selected by the user
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  // State for user feedback messages and loading status
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      setMessage('Please select a file to upload.');
      setIsError(true);
      return;
    }

    setIsSubmitting(true);
    setMessage('Uploading...');
    setIsError(false);

     const formData = new FormData();
     formData.append('resume', resumeFile);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/user/resume`, {
        method: 'PATCH',
        headers: {
           
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        // If the backend returns an error, we throw it
        throw new Error(data.message || 'Upload failed.');
      }

      // On success:
      setMessage('CV uploaded successfully! Redirecting you back to your profile...');
      
      // Wait 2 seconds, then redirect the user back to their main profile page
      setTimeout(() => {
        router.push('/profile');
      }, 2000);

    } catch (error: any) {
      setIsError(true);
      setMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2 text-black">Upload Your CV / Resume</h1>
      <p className="text-gray-600 mb-8">Upload a new CV here. This will replace any existing CV you have on file.</p>
      
      <div className="max-w-lg bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-black">CV / Resume File</label>
            <p className="text-sm text-gray-500 mb-2">Allowed formats: PDF, DOC, DOCX. Max size: 5MB.</p>
            <input 
              type="file" 
              name="resume" 
              id="resume" 
              required
              accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange} 
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {isSubmitting ? 'Uploading...' : 'Upload File'}
            </button>
            <Link href="/profile" className="text-sm text-gray-600 hover:underline">
              Cancel
            </Link>
          </div>

          {/* This div will show feedback messages to the user */}
          {message && (
            <p className={`mt-4 text-sm font-medium ${isError ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}