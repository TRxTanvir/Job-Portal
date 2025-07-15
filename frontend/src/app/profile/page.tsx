'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Defines the shape of our form data, including the optional resumeUrl
interface ProfileFormData {
  name: string;
  education: string;
  job: string;
  experience: string;
  extraCareer: string;
  resumeUrl?: string; 
}

export default function ProfilePage() {
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  
  // A single, complete state object for all form data
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    education: '',
    job: '',
    experience: '',
    extraCareer: '',
    resumeUrl: '',
  });

  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Effect to protect the route
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  // Effect to fetch the profile data when the page loads
  useEffect(() => {
    if (user && token) {
      const fetchProfile = async () => {
        setIsLoading(true);
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const res = await fetch(`${apiUrl}/user/profile`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!res.ok) throw new Error('Failed to fetch profile data.');
          const profileData = await res.json();
          // Populate the form state with all fields, including resumeUrl
          setFormData({
            name: profileData.name || '',
            education: profileData.education || '',
            job: profileData.job || '',
            experience: profileData.experience || '',
            extraCareer: profileData.extraCareer || '',
            resumeUrl: profileData.resumeUrl || '',
          });
        } catch (error) {
          console.error(error);
          setMessage('Could not load profile data.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('Updating...');
    const submissionData = new FormData();
    
    // We only need to send the fields that can be edited in this form
    submissionData.append('name', formData.name);
    submissionData.append('education', formData.education);
    submissionData.append('job', formData.job);
    submissionData.append('experience', formData.experience);
    submissionData.append('extraCareer', formData.extraCareer);

    if (profilePicFile) {
      submissionData.append('profilePic', profilePicFile);
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/user/profile`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: submissionData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile.');
      }
      setMessage('Profile updated successfully!');
      // Update state with the new data from the server's response
      setFormData({
        name: data.user.name || '',
        education: data.user.education || '',
        job: data.user.job || '',
        experience: data.user.experience || '',
        extraCareer: data.user.extraCareer || '',
        resumeUrl: data.user.resumeUrl || '', // Make sure to update resumeUrl as well
      });
      setProfilePicFile(null);
      const fileInput = document.getElementById('profilePic') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'An error occurred while updating.';
      setMessage(message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isAuthLoading || isLoading) {
    return <div className="text-center p-10 font-semibold text-lg text-black">Loading Profile...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* SECTION 1: EDITING FORM (will be hidden on print) */}
      <div className="no-print">
        <h1 className="text-4xl font-bold mb-8 text-black">Edit Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black">Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"/>
          </div>
          <div>
            <label htmlFor="education" className="block text-sm font-medium text-black">Education</label>
            <input type="text" name="education" id="education" value={formData.education} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"/>
          </div>
          <div>
            <label htmlFor="job" className="block text-sm font-medium text-black">Current Job / Role</label>
            <input type="text" name="job" id="job" value={formData.job} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"/>
          </div>
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-black">Experience</label>
            <textarea name="experience" id="experience" value={formData.experience} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"/>
          </div>
          <div>
            <label htmlFor="extraCareer" className="block text-sm font-medium text-black">Extra Curricular Activities</label>
            <input type="text" name="extraCareer" id="extraCareer" value={formData.extraCareer} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"/>
          </div>
          <div>
            <label htmlFor="profilePic" className="block text-sm font-medium text-black">Profile Picture</label>
            <input type="file" name="profilePic" id="profilePic" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>
          <div className="flex items-center space-x-4">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Save Changes
            </button>
            {message && <p className="mt-4 text-sm font-medium text-green-600">{message}</p>}
          </div>
        </form>
      </div>

      {/* SECTION 2: PRINTABLE PROFILE DISPLAY */}
      <div className="mt-16 printable-area">
        <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-3">
          <h2 className="text-3xl font-bold text-black">Current Profile Details</h2>
          <button onClick={handlePrint} className="px-5 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-black transition-colors no-print">
            Print Profile
          </button>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Name</h3>
            <p className="text-lg text-black">{formData.name || 'Not provided'}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Education</h3>
            <p className="text-lg text-black">{formData.education || 'Not provided'}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Current Job / Role</h3>
            <p className="text-lg text-black">{formData.job || 'Not provided'}</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Experience</h3>
            <p className="text-lg text-black whitespace-pre-wrap">{formData.experience || 'Not provided'}</p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Extra Curricular Activities</h3>
            <p className="text-lg text-black">{formData.extraCareer || 'Not provided'}</p>
          </div>
          {/* --- This is the conditional CV link --- */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">CV / Resume</h3>
            {formData.resumeUrl ? (
              <a href={`http://localhost:4000/uploads/resumes/${formData.resumeUrl}`} target="_blank" rel="noreferrer" className="text-lg text-blue-600 hover:underline font-medium">
                View My CV
              </a>
            ) : (
              <Link href="/profile/upload-cv" className="text-lg text-blue-600 hover:underline font-medium">
                Upload CV Now
              </Link>
              
            )}
              <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Update/Edit</h3>
            {formData.resumeUrl ? (
              <a href={`http://localhost:3000/profile/upload-cv`} target="_blank" rel="noreferrer" className="text-lg text-blue-600 hover:underline font-medium" >
                Edit/Update My CV
              </a>
            ) : (
              <Link href="/profile/upload-cv" className="text-lg text-red-600 hover:underline font-medium">
                Update/Edit CV Now
              </Link>)}:
               </div>
          </div>
        </div>
      </div>
    </div>
  );
}