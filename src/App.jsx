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

  if (path === '/portfolio') return <AuthProvider><PortfolioPage /></AuthProvider>;
  if (path === '/testimonials') return <AuthProvider><TestimonialsPage /></AuthProvider>;
  if (path === '/admin') return <AuthProvider><AdminPanel /></AuthProvider>;

  return (
    <AuthProvider>
      <AnimatedCursor />
      <ParticleBackground />
      <div className="relative z-10 bg-[#0a0a0a]/80 text-white min-h-screen">
        <Navbar />
        <Hero />
        <BentoServices />
        <ProcessSticky />
        <ClientsSection />
        <Pricing />
        <EnvelopeTestimonials />
        <Footer />
      </div>
    </AuthProvider>
  );
}
export default App;
