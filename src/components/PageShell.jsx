import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar from './Navbar';
import Footer from './Footer';
import VelocitySkewProvider from './VelocitySkewProvider';

// Kerangka untuk halaman biasa (Sponsor, Dokumentasi): provider yang sama dengan
// homepage, navbar di atas, footer di bawah, dan judul tab browser sendiri.
export default function PageShell({ title, children }) {
  useEffect(() => {
    if (!title) return undefined;
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <MotionConfig reducedMotion="user">
          <VelocitySkewProvider>
            <div className="relative bg-[#0a0a0a] text-white min-h-screen overflow-x-clip w-full max-w-full">
              <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none z-0" />
              <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[900px] max-w-full h-[400px] bg-cyan-400/5 rounded-full blur-[120px] pointer-events-none z-0" />
              <Navbar />
              <main className="relative z-10">{children}</main>
              <Footer />
            </div>
          </VelocitySkewProvider>
        </MotionConfig>
      </AuthProvider>
    </ThemeProvider>
  );
}
