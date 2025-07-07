'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

type Job = {
  id: number;
  title: string;
  description: string;
  company: string;
};

export default function JobsPage() {
  // ... (logic for state and hooks remains the same) ...
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchJobs = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const res = await fetch(`${apiUrl}/jobs`, { cache: 'no-store' });
          if (!res.ok) throw new Error('Failed to fetch jobs');
          const data = await res.json();
          setJobs(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchJobs();
    }
  }, [user]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-black">Loading Jobs...</p>
      </div>
    );
  }


  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-black">
            Find Your Next Opportunity
            </h1>
            <p className="mt-4 text-lg text-black">
                Search through thousands of open positions to find your perfect fit.
            </p>
        </div>

        {/* Search Bar Placeholder */}
        <div className="mt-10 max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-md border">
          {/* ... */}
        </div>
        
        <div className="max-w-4xl mx-auto mt-10 space-y-5">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Link href={`/jobs/${job.id}`} key={job.id} className="block group">
                <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm group-hover:shadow-lg group-hover:border-blue-500 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-black group-hover:text-blue-600">{job.title}</h2>
                      <p className="text-lg text-black mt-1">{job.company}</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-bold text-green-800 bg-green-100 rounded-full">
                        FULL-TIME
                    </span>
                  </div>
                  <p className="text-md text-black mt-4 line-clamp-3">{job.description}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center bg-white p-10 rounded-xl shadow-sm border">
              <h3 className="text-xl font-semibold text-black">No Job Positions Found</h3>
              <p className="text-black mt-2">
                There are no open positions at the moment. Please check back later.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}