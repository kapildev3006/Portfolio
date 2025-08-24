import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolio } from '../context/PortfolioContext';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);

  // Use PortfolioContext for profile data and message submission
  const { profile, addMessage } = usePortfolio();

  useEffect(() => {
    // GSAP animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Section header animation
    tl.fromTo('.contact-header', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    // Contact info animation
    tl.fromTo('.contact-info-item', 
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 },
      "-=0.4"
    );

    // Form animation
    tl.fromTo('.contact-form', 
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );

    // Floating animation for icons
    gsap.to('.floating-contact-icon', {
      y: -5,
      duration: 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.3
    });

  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Use PortfolioContext to add message
      const result = await addMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        time: 'Just now'
      });
      
      if (result.success) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
      });

      setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: profile.email || 'kapildev@example.com',
      link: `mailto:${profile.email || 'kapildev@example.com'}`,
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: profile.phone || '+91 1234567890',
      link: `tel:${profile.phone || '+91 1234567890'}`,
      color: 'from-green-500 to-green-600'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: profile.location || 'San Francisco, CA',
      link: '#',
      color: 'from-blue-500 to-blue-600'
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      name: 'GitHub',
      url: 'https://github.com/kapildev3006',
      color: 'from-gray-600 to-gray-800'
    },
    {
      icon: Linkedin,
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/kapildev',
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: Twitter,
      name: 'Twitter',
      url: 'https://twitter.com/kapildev',
      color: 'from-blue-400 to-blue-500'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" ref={sectionRef}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full opacity-15 blur-lg"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contact Information */}
          <motion.div
            ref={infoRef}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center lg:text-left">
              <motion.h2
                className="contact-header text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">Connect</span>
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600 dark:text-gray-400 mb-8"
              >
                Ready to bring your ideas to life? I'm here to help you create something amazing. Let's discuss your project and make it happen.
              </motion.p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.title}
                  href={info.link}
                  className="contact-info-item block p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-lg flex items-center justify-center`}>
                      <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{info.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{info.value}</p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center lg:text-left">
                Follow Me
              </h3>
              <div className="flex justify-center lg:justify-start space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 bg-gradient-to-r ${social.color} rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 floating-contact-icon`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  >
                    <social.icon size={24} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="contact-form"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Send Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="+91 1234567890"
                    />
                  </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                      required
                    value={formData.subject}
                    onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Project inquiry, collaboration, etc."
                  />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 resize-none"
                    placeholder="Tell me about your project, requirements, timeline, or any questions you have..."
                  />
                </div>

                {/* Submit Status Messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
                  >
                    <p className="text-sm text-green-800 dark:text-green-200">
                      ✅ Message sent successfully! I'll get back to you soon.
                    </p>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                  >
                    <p className="text-sm text-red-800 dark:text-red-200">
                      ❌ Failed to send message. Please try again or contact me directly.
                    </p>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-primary-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-700 hover:to-blue-700 focus:ring-4 focus:ring-primary-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner w-5 h-5"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
