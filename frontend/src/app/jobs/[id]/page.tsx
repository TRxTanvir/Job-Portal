'use client';

import { useState, useEffect } from 'react';
import ApplyModal from '../../../components/ApplyModal';
import { useAuth } from '../../../context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { BsCurrencyDollar, BsCalendarCheck, BsCalendarX, BsBarChart, BsBriefcase } from 'react-icons/bs';

// Define the shape of the Job object
type Job = {
  id: number;
  title: string;
  description: string;
  company: string;
  location?: string;
};

export default function JobDetailPage() {
  // All state and hooks must be at the top level of the component
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Effect to protect the route
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  // Effect to fetch the job details
  useEffect(() => {
    if (user) {
      const getJobDetails = async () => {
        setIsLoading(true);
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const res = await fetch(`${apiUrl}/jobs/${id}`, { cache: 'no-store' });
          if (!res.ok) throw new Error('Job not found');
          const data = await res.json();
          setJob(data);
        } catch (error) {
          console.error(error);
          setJob(null);
        } finally {
          setIsLoading(false);
        }
      };
      getJobDetails();
    }
  }, [id, user]);

  const handleApplyClick = () => {
    if (user) {
      setIsModalOpen(true);
    } else {
      router.push('/login');
    }
  };

  if (isAuthLoading || isLoading) {
    return <div className="text-center p-10 font-bold text-lg text-black">Loading...</div>;
  }

  if (!job) {
    return <div className="text-center p-10 font-bold text-lg text-black">Job Not Found.</div>;
  }
  
  const jobOverview = {
      posted: '14 Jun, 2025',
      expires: '14 Aug, 2025',
      level: 'Entry Level',
      experience: '1-2 Years'
  };

  return (
    <>
      <div className="bg-white text-black">
        <div className="container mx-auto py-12 px-4">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl font-bold text-blue-600">
                {job.company.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-black">{job.title}</h1>
                <div className="flex items-center flex-wrap gap-4 mt-2 text-black">
                  <span>at {job.company}</span>
                  <span className="px-3 py-1 text-xs font-bold text-green-800 bg-green-100 rounded-full">FULL-TIME</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleApplyClick} className="px-6 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                Apply Now &rarr;
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-black">Job Description</h2>
              <div className="mt-4 prose prose-lg max-w-none text-black">
                  <p>{job.description}</p>
              </div>
            </div>
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                  <BsCurrencyDollar className="text-3xl text-green-500" />
                  <div>
                    <p className="font-bold text-xl text-black">$1000 - $2000</p>
                    <p className="text-sm text-black">Monthly Salary</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-black mb-4">Job Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm">
                  <div className="flex items-center gap-3"><BsCalendarCheck className="text-black" /><div><p className="font-bold text-black">Job Posted:</p><p>{jobOverview.posted}</p></div></div>
                  <div className="flex items-center gap-3"><BsCalendarX className="text-black" /><div><p className="font-bold text-black">Job Expire in:</p><p>{jobOverview.expires}</p></div></div>
                  <div className="flex items-center gap-3"><BsBarChart className="text-black" /><div><p className="font-bold text-black">Job Level:</p><p>{jobOverview.level}</p></div></div>
                  <div className="flex items-center gap-3"><BsBriefcase className="text-black" /><div><p className="font-bold text-black">Experience:</p><p>{jobOverview.experience}</p></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {job && isModalOpen && (
        <ApplyModal jobId={job.id} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}