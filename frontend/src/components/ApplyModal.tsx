'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

interface ApplyModalProps {
  jobId: number;
  onClose: () => void; // Function to close the modal
}

export default function ApplyModal({ jobId, onClose }: ApplyModalProps) {
  const { token } = useAuth();
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      setMessage('Please upload your resume.');
      return;
    }
    setIsSubmitting(true);
    setMessage('Submitting your application...');

    const formData = new FormData();
    formData.append('jobId', String(jobId));
    formData.append('coverLetter', coverLetter);
    formData.append('resume', resumeFile);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/applications`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Application failed.');

      setMessage('Application sent successfully!');
      setTimeout(() => onClose(), 2000); // Close modal after 2 seconds
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Apply for this Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-black">Cover Letter (Optional)</label>
              <textarea id="coverLetter" rows={5} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"/>
            </div>
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-black">Upload CV/Resume</label>
              <input type="file" id="resume" required onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 ">
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
          {message && <p className="mt-4 text-center">{message}</p>}
        </form>
      </div>
    </div>
  );
}