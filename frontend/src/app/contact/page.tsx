'use client';

import { useState, FormEvent } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({
    isSubmitting: false,
    message: '',
    isError: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ isSubmitting: true, message: 'Sending...', isError: false });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/support/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send message.');
      }

      setStatus({ isSubmitting: false, message: 'Message sent successfully! Thank you.', isError: false });
      // Clear the form on success
      setFormData({ name: '', email: '', subject: '', message: '' });

    } catch (error: any) {
      setStatus({ isSubmitting: false, message: error.message || 'An error occurred.', isError: true });
    }
  };

  return (
    <div className="bg-white text-black py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-600">Have a question or feedback? We'd love to hear from you.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
              <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
              <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium">Subject</label>
            <input type="text" name="subject" id="subject" required value={formData.subject} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium">Message</label>
            <textarea name="message" id="message" required minLength={10} rows={5} value={formData.message} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
          </div>
          <div>
            <button type="submit" disabled={status.isSubmitting} className="w-full px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
              {status.isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>

          {status.message && (
            <p className={`text-center font-medium ${status.isError ? 'text-red-600' : 'text-green-600'}`}>
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}