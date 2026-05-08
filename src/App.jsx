import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BentoServices from './components/BentoServices';
import ProcessSticky from './components/ProcessSticky';
import ClientsSection from './components/ClientsSection';
import Pricing from './components/Pricing';
import EnvelopeTestimonials from './components/EnvelopeTestimonials';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import PortfolioPage from './PortfolioPage';
import TestimonialsPage from './TestimonialsPage';
import AnimatedCursor from './components/AnimatedCursor';
import ParticleBackground from './components/ParticleBackground';
import WaveDivider from './components/WaveDivider';

function App() {
  // Handle navigation & smooth scroll
  const handleLinkClick = (e) => {
    const href = e.currentTarget?.getAttribute('href');
    if (!href) return;

    if (href.includes('#')) {
      e.preventDefault();
      const hash = href.split('#')[1];
      const el = document.getElementById(hash);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80; // offset navbar
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else if (href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault();
      window.history.pushState({}, '', href);
      window.scrollTo(0, 0);
    }
  };


  

  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('/') && !href.startsWith('//') && href !== '#') {
        e.preventDefault();
        window.history.pushState({}, '', href);
        setPath(href);
        window.scrollTo(0, 0);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const Layout = ({ children }) => (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );

  if (path === '/portfolio') return <ThemeProvider><AuthProvider><PortfolioPage /></AuthProvider></ThemeProvider>;
  if (path === '/testimonials') return <AuthProvider><Layout><TestimonialsPage /></Layout></AuthProvider>;
  if (path === '/admin') return <AuthProvider><AdminPanel /></AuthProvider>;

  return (
    <ThemeProvider>
    <AuthProvider>
      {/* AnimatedCursor */}
      {/* ParticleBackground */}
      <div className="relative z-10 bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden w-full max-w-full">
        <Navbar />
        <Hero />
        <WaveDivider fromColor="#0a0a0a" toColor="#ffffff" />
        <BentoServices />
        <ProcessSticky />
        <ClientsSection />
        <WaveDivider fromColor="#ffffff" toColor="#0a0a0a" />
        <Pricing />
        <WaveDivider fromColor="#0a0a0a" toColor="#ffffff" />
        <EnvelopeTestimonials />
        <Footer />
      </div>
    </AuthProvider>
    </ThemeProvider>
  );
}
export default App;
