import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase/config';
import { usePortfolio } from './context/PortfolioContext';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Admin from './components/Admin';
import AdminLogin from './components/AdminLogin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { profile, loading: contextLoading } = usePortfolio();
  
  // Refs for sections
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  // Check route on mount and route changes
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      setShowAdmin(path === '/admin');
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAdminAuthenticated(!!user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Optimized GSAP animations - only run when not in admin mode
  useEffect(() => {
    if (showAdmin || contextLoading) return;

    // Kill any existing ScrollTrigger instances to prevent memory leaks
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Optimized animations with reduced complexity
    const tl = gsap.timeline({
      defaults: { ease: "power2.out", duration: 0.8 }
    });

    // Home section animation
    if (homeRef.current) {
      gsap.fromTo(homeRef.current.querySelectorAll('.animate-on-scroll'), 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: homeRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // About section animation
    if (aboutRef.current) {
      gsap.fromTo(aboutRef.current.querySelectorAll('.skill-item'), 
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.5,
          stagger: 0.05,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Projects section animation
    if (projectsRef.current) {
      gsap.fromTo(projectsRef.current.querySelectorAll('.project-card'), 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: projectsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Contact section animation
    if (contactRef.current) {
      gsap.fromTo(contactRef.current.querySelectorAll('.contact-info-item'), 
        { opacity: 0, x: -30 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [showAdmin, contextLoading]);

  const handleAdminLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAdminAuthenticated(true);
      setShowAdmin(true);
      window.history.pushState({}, '', '/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      throw error;
    }
  };

  const handleAdminLogout = async () => {
    try {
      await auth.signOut();
      setIsAdminAuthenticated(false);
      setShowAdmin(false);
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleBackToPortfolio = () => {
    setShowAdmin(false);
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handlePasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show admin login if not authenticated
  if (showAdmin && !isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminLogin 
          onLogin={handleAdminLogin}
          onPasswordReset={handlePasswordReset}
          onBackToPortfolio={handleBackToPortfolio}
        />
      </div>
    );
  }

  // Show admin panel if authenticated
  if (showAdmin && isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Admin 
          onLogout={handleAdminLogout}
          onBackToPortfolio={handleBackToPortfolio}
        />
      </div>
    );
  }

  // Show main portfolio
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="relative">
        {/* Home Section */}
        <section ref={homeRef} id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <Home />
        </section>

        {/* About Section */}
        <section ref={aboutRef} id="about" className="min-h-screen py-20 relative">
          <About />
        </section>

        {/* Projects Section */}
        <section ref={projectsRef} id="projects" className="min-h-screen py-20 relative">
          <Projects />
        </section>

        {/* Contact Section */}
        <section ref={contactRef} id="contact" className="min-h-screen py-20 relative">
          <Contact />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
