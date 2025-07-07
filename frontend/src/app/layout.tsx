import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; //

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Job Portal',
  description: 'Find your next job!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Set the base text color to pure black */}
      <body className={`${inter.className} bg-gray-50 text-black`}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer /> { }
        </AuthProvider>
      </body>
    </html>
  );
}