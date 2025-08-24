import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, ExternalLink, ArrowLeft, Lock } from 'lucide-react';
import { gsap } from 'gsap';
import { usePortfolio } from '../context/PortfolioContext';

const Projects = () => {
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sectionRef = useRef(null);
  const filtersRef = useRef(null);
  const projectsRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Use PortfolioContext for real-time project data
  const { projects, loading: contextLoading, error: contextError } = usePortfolio();

  const filters = [
    { id: 'all', name: 'All Projects', icon: '🌟' },
    { id: 'web', name: 'Web Apps', icon: '🌐' },
    { id: 'mobile', name: 'Mobile Apps', icon: '📱' },
    { id: 'fullstack', name: 'Full Stack', icon: '⚡' },
    { id: 'frontend', name: 'Frontend', icon: '🎨' }
  ];

  // Sample projects data (fallback when no projects from context)
  const sampleProjects = useMemo(() => [
    {
      id: 1,
      title: "Online Voting System",
      description: "A secure and user-friendly online voting application built with Flask and MySQL. It allows users to register, log in, cast their vote once, and view election results in real-time. Admins can manage candidates, view voting statistics, and remove users or candidates when necessary.",
      image: "/onlinevotingsystem.png",
      techStack: ['Flask', 'Python', 'MySQL', 'bcrypt', 'HTML/CSS'],
      category: "web",
      githubUrl: 'https://github.com/kapildev3006/OnlineVotingSystem',
      demoUrl: 'https://online-voting-system-demo.com',
      isPrivate: true,
      featured: false,
      status: 'published'
    },
    {
      id: 2,
      title: 'Eye Disease Detection & Management System',
      description: 'A full-stack Flask web application integrated with MySQL for managing eye-care services.',
      image: '/eyedisease.png',
      techStack: ['Flask', 'Python', 'MySQL', 'Flask-Mail', 'Werkzeug'],
      category: 'web',
      githubUrl: 'https://github.com/kapildev3006/eyedisease',
      demoUrl: 'https://eye-disease-detection-management-system-demo.com',
      isPrivate: true,
      featured: true,
      status: 'published'
    },
    {
      id: 3,
      title: 'FoodShare – Food Wastage Management Platform',
      description: 'A responsive web application that helps reduce food waste by allowing users to share, donate, or sell excess food they cannot consume.',
      image: '/foodshare.png',
      techStack: ['React', 'OpenWeather API', 'Chart.js', 'CSS3'],
      category: 'frontend',
      githubUrl: 'https://github.com/kapildev3006/FoodShare',
      demoUrl: 'https://foodshare-demo.com',
      isPrivate: true,
      featured: false,
      status: 'published'
    },
    {
      id: 4,
      title: 'Portfolio Website',
      description: 'A responsive portfolio website built with modern web technologies and featuring smooth animations and dark mode.',
      image: '/portfolio.png',
      techStack: ['Next.js','React','TypeScript','Tailwind CSS','Firebase (Auth, Firestore, Storage)','Cloudinary','Framer Motion','React Icons'],
      category: 'web',
      githubUrl: 'https://github.com/yourusername/portfolio',
      demoUrl: 'https://portfolio-demo.com',
      featured: false,
      status: 'published'
    },
  ], []);

  useEffect(() => {
    // Always use sample data for display
    const displayProjects = sampleProjects;
    
    // Filter projects based on active filter
    if (activeFilter === 'all') {
      setFilteredProjects(displayProjects.filter(project => project.status === 'published'));
    } else {
      setFilteredProjects(displayProjects.filter(project => 
        project.category === activeFilter && project.status === 'published'
      ));
    }
    
    setLoading(false);
  }, [projects, activeFilter, sampleProjects]);

  useEffect(() => {
    if (isInView) {
      // GSAP animations for projects section
      const tl = gsap.timeline();

      // Section header animation
      tl.fromTo('.projects-header', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );

      // Filters animation
      tl.fromTo('.filter-item', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.1 },
        "-=0.4"
      );

      // Projects grid animation
      tl.fromTo('.project-card', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 },
        "-=0.3"
      );

      // Background elements animation
      gsap.fromTo('.projects-bg-element', 
        { opacity: 0, scale: 0.9 },
        { 
          opacity: 0.1, 
          scale: 1, 
          duration: 1, 
          ease: "power2.out",
          stagger: 0.2
        }
      );
    }
  }, [isInView]);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  const scrollToContact = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading || contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error || contextError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Error loading projects</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" ref={sectionRef}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="projects-bg-element absolute top-20 left-20 w-32 h-32 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20 blur-xl"></div>
        <div className="projects-bg-element absolute bottom-20 right-20 w-40 h-40 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-xl"></div>
        <div className="projects-bg-element absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full opacity-15 blur-lg"></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="projects-header text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">Projects</span>
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            Here are some of the projects I've worked on. Each one represents a unique challenge and learning experience.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div
          ref={filtersRef}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => handleFilterChange(filter.id)}
              className={`filter-item px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
              No projects found for this category.
            </p>
            <button
              onClick={() => handleFilterChange('all')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              View All Projects
            </button>
          </motion.div>
        ) : (
          <motion.div
            ref={projectsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="project-card group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                whileHover={{ scale: 1.02 }}
              >
                {/* Project Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {project.isPrivate && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Lock size={12} />
                      Private
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-4 left-4 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      ⭐ Featured
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.slice(0, 4).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                          +{project.techStack.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Project Links */}
                  <div className="flex space-x-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gray-900 dark:bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
                      >
                        <Github size={16} />
                        Code
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
                      >
                        <ExternalLink size={16} />
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-4xl font-bold mb-6">
                Ready to Start a Project?
              </h3>
              <p className="text-primary-100 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                I'm always excited to take on new challenges and collaborate on interesting projects. 
                Let's discuss how we can bring your vision to life.
              </p>
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToContact}
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl text-lg"
              >
                Let's Talk
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;
