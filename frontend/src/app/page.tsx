'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiMapPin } from 'react-icons/fi';

export default function HomePage() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (keyword) queryParams.append('q', keyword);
    if (location) queryParams.append('location', location);
    router.push(`/jobs?${queryParams.toString()}`);
  };

  return (
    <div className="bg-white text-black">
      <main>
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-24 md:py-32 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black leading-tight">
              Find Your Next <span className="text-blue-600">Dream Job</span> Today
            </h1>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-600">
               Your career journey starts here. Explore thousands of job opportunities from top companies to find the role that&apos;s right for you.
            </p>

            {/* --- Search Form --- */}
            <div className="mt-10 max-w-3xl mx-auto">
              {/* The form's onSubmit event is now handled by our function */}
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                <div className="flex items-center flex-grow w-full">
                  <FiSearch className="text-gray-400 mx-3" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    className="w-full py-2 focus:outline-none text-black bg-transparent"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div className="flex items-center flex-grow w-full md:border-l md:pl-3">
                  <FiMapPin className="text-gray-400 mx-3" />
                  <input
                    type="text"
                    placeholder="City or location"
                    className="w-full py-2 focus:outline-none text-black bg-transparent"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* --- Key Metrics / Trust Builders Section --- */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-4xl font-bold text-blue-600">24k+</h3>
                <p className="mt-1 text-gray-600">Live Jobs</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-blue-600">8k+</h3>
                <p className="mt-1 text-gray-600">Companies</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-blue-600">12k+</h3>
                <p className="mt-1 text-gray-600">Candidates</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-blue-600">1k+</h3>
                <p className="mt-1 text-gray-600">New Jobs</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}