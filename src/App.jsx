import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AuthProvider } from './context/AuthContext';
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
    const handleLinkClick = (e) => {
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
    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  const Layout = ({ children }) => (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );

  if (path === '/portfolio') return <AuthProvider><Layout><PortfolioPage /></Layout></AuthProvider>;
  if (path === '/testimonials') return <AuthProvider><Layout><TestimonialsPage /></Layout></AuthProvider>;
  if (path === '/admin') return <AuthProvider><Layout><AdminPanel /></Layout></AuthProvider>;

  return (
    <AuthProvider>
      <AnimatedCursor />
      <ParticleBackground />
      <div className="relative z-10 min-h-screen overflow-x-hidden">
        <Hero />
        <WaveDivider bgColor="#ffffff" />
        <BentoServices />
        <WaveDivider bgColor="#ffffff" />
        <ProcessSticky />
        <WaveDivider bgColor="#ffffff" />
        <ClientsSection />
        <WaveDivider bgColor="#0a0a0a" />
        <Pricing />
        <WaveDivider bgColor="#ffffff" />
        <div className="bg-white">
          <EnvelopeTestimonials />
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}
export default App;
