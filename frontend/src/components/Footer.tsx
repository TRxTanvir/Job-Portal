'use client';

import Link from 'next/link';
import { BsBriefcaseFill, BsArrowRightShort } from 'react-icons/bs';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const quickLinks = [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact', icon: <BsArrowRightShort /> },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
  ];

  const candidateLinks = [
    { href: '/jobs', label: 'Browse Jobs' },
    { href: '/employers', label: 'Browse Employers' },
    { href: '/dashboard', label: 'Candidate Dashboard' },
    { href: '/saved-jobs', label: 'Saved Jobs' },
  ];

  const employersLinks = [
    { href: '/jobs/post', label: 'Post a Job' },
    { href: '/candidates', label: 'Browse Candidates' },
    { href: '/dashboard', label: 'Employers Dashboard' },
    { href: '/applications', label: 'Applications' },
  ];

  const supportLinks = [
    { href: '/faq', label: 'Faqs' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms & Conditions' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
              <BsBriefcaseFill className="text-blue-500"/>
              JobPortal
            </Link>
            <p className="font-semibold">Call now: <span className="text-white">+880 1609522922</span></p>
            <p className="mt-2 text-sm">1292 TrxTech, Dhaka</p>
          </div>

          {/* Column 2: Quick Link */}
          <div>
            <h4 className="font-bold text-white text-lg mb-4">Quick Link</h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center hover:text-white transition-colors">
                    {link.icon}{link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Candidate */}
          <div>
            <h4 className="font-bold text-white text-lg mb-4">Candidate</h4>
            <ul className="space-y-3">
              {candidateLinks.map(link => (
                <li key={link.href}><Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Column 4: Employers */}
          <div>
            <h4 className="font-bold text-white text-lg mb-4">Employers</h4>
            <ul className="space-y-3">
              {employersLinks.map(link => (
                <li key={link.href}><Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Column 5: Support */}
          <div>
            <h4 className="font-bold text-white text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map(link => (
                <li key={link.href}><Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Sub-Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>&copy; 2025 Jobportal - Job Portal. All rights Reserved</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-white"><FaFacebookF /></Link>
            <Link href="#" className="hover:text-white"><FaTwitter /></Link>
            <Link href="#" className="hover:text-white"><FaInstagram /></Link>
            <Link href="#" className="hover:text-white"><FaYoutube /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}