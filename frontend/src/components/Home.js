import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Github, Linkedin, Mail } from 'lucide-react';
import { gsap } from 'gsap';
import { usePortfolio } from '../context/PortfolioContext';

const Home = () => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const ctaRef = useRef(null);
  const imageRef = useRef(null);
  const socialRef = useRef(null);

  // Use PortfolioContext for real-time profile data
  const { profile } = usePortfolio();

  useEffect(() => {
    // Optimized GSAP animations for better performance
    const tl = gsap.timeline();

    // Simple entrance animations
    tl.fromTo(heroRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    tl.fromTo(textRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

    tl.fromTo(ctaRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );

    tl.fromTo(imageRef.current, 
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    );

    tl.fromTo(socialRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.2"
    );

    // Simple parallax effect - optimized
    gsap.to('.parallax-bg', {
      y: -20,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });

  }, []);

  const scrollToContact = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Elements - simplified */}
      <div className="absolute inset-0 parallax-bg">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full opacity-15 blur-lg"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">{profile.name || 'Kapil Dev'}</span>
            </motion.h1>
            
            <motion.h2
              ref={textRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl md:text-3xl text-gray-700 dark:text-gray-200 mb-6"
            >
              {profile.title || 'Full Stack Developer'}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0"
            >
              {profile.bio || 'Passionate Full Stack Developer with expertise in modern web technologies. I create innovative solutions that make a difference.'}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              ref={ctaRef}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6"
            >
              <motion.button
                onClick={scrollToContact}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-blue-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                View My Work
              </motion.button>
              
              <motion.a
                href="/resume.pdf"
                download
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 font-semibold rounded-lg hover:bg-primary-600 hover:text-white dark:hover:bg-primary-400 dark:hover:text-gray-900 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download CV
              </motion.a>
            </motion.div>

            {/* Social Media Icons */}
            <motion.div
              ref={socialRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex justify-center lg:justify-start gap-4"
            >
              <motion.a
                href="https://github.com/kapildev3006"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <Github size={24} />
              </motion.a>

              <motion.a
                href="https://linkedin.com/in/kapildev"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <Linkedin size={24} />
              </motion.a>

              <motion.a
                href={`mailto:${profile.email || 'kapildev@example.com'}`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <Mail size={24} />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="w-80 h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
                <img
                  src={profile.avatar || '/Profile.jpg'}
                  alt={profile.name || 'Kapil Dev'}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-primary-400 to-blue-400 rounded-full opacity-80 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-80 animate-pulse delay-1000"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
