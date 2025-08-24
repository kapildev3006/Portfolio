import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code, Database, Globe, Smartphone, Server, Zap } from 'lucide-react';
import { gsap } from 'gsap';
import { usePortfolio } from '../context/PortfolioContext';

const About = () => {
  const sectionRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Use PortfolioContext for real-time data
  const { profile, skills } = usePortfolio();

  useEffect(() => {
    if (isInView) {
      // Optimized GSAP animations for better performance
      const tl = gsap.timeline();

      // Simple section header animation
      tl.fromTo('.about-header', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );

      // Simple skills animation
      tl.fromTo('.skill-item', 
        { opacity: 0, x: -30 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.5, 
          ease: "power2.out", 
          stagger: 0.1
        },
        "-=0.4"
      );

      // Simple experience animation
      tl.fromTo('.experience-item', 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          ease: "power2.out", 
          stagger: 0.1 
        },
        "-=0.3"
      );

      // Simple background elements animation
      gsap.fromTo('.about-bg-element', 
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

  // Default skills if none from context
  const defaultSkills = [
    { name: 'Frontend Development', icon: Code, description: 'React, Next.js, TypeScript, Tailwind CSS', color: 'from-blue-500 to-blue-600' },
    { name: 'Backend Development', icon: Server, description: 'Node.js, Express, Python, Flask', color: 'from-green-500 to-green-600' },
    { name: 'Database Management', icon: Database, description: 'MySQL, MongoDB, Firebase, PostgreSQL', color: 'from-purple-500 to-purple-600' },
    { name: 'Mobile Development', icon: Smartphone, description: 'React Native, Flutter, Progressive Web Apps', color: 'from-orange-500 to-orange-600' },
    { name: 'DevOps & Cloud', icon: Globe, description: 'AWS, Docker, CI/CD, Git, GitHub Actions', color: 'from-red-500 to-red-600' },
    { name: 'Performance & SEO', icon: Zap, description: 'Web Vitals, Lighthouse, Core Web Vitals', color: 'from-yellow-500 to-yellow-600' }
  ];

  // Use skills from context or fallback to defaults
  const displaySkills = skills.length > 0 ? skills : defaultSkills;

  const experiences = [
    {
      year: '2023 - Present',
      title: 'Full Stack Developer',
      company: 'Freelance',
      description: 'Building scalable web applications and providing technical solutions for clients across various industries.',
      icon: '🚀'
    },
    {
      year: '2022 - 2023',
      title: 'Web Developer',
      company: 'Personal Projects',
      description: 'Developed multiple full-stack applications including voting systems, healthcare platforms, and e-commerce solutions.',
      icon: '💻'
    },
    {
      year: '2021 - 2022',
      title: 'Student Developer',
      company: 'Academic Projects',
      description: 'Created innovative solutions for real-world problems through academic projects and hackathons.',
      icon: '🎓'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" ref={sectionRef}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="about-bg-element absolute top-20 left-20 w-32 h-32 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20 blur-xl"></div>
        <div className="about-bg-element absolute bottom-20 right-20 w-40 h-40 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-xl"></div>
        <div className="about-bg-element absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full opacity-15 blur-lg"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            className="about-header text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">Me</span>
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            {profile.bio || 'Passionate Full Stack Developer with expertise in modern web technologies. I create innovative solutions that make a difference.'}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Skills Section */}
          <motion.div
            ref={skillsRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-8"
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">Skills</span>
            </h3>
            
            <div className="grid gap-6">
              {displaySkills.map((skill, index) => (
                <motion.div
                  key={skill.id || index}
                  className="skill-item bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${skill.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <skill.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {skill.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {skill.description}
                      </p>
                      {skill.level && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Level:</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            skill.level === 'Expert' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            skill.level === 'Advanced' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            skill.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}>
                            {skill.level}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Experience Section */}
          <motion.div
            ref={experienceRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-8"
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">Journey</span>
            </h3>
            
            <div className="space-y-6">
              {experiences.map((experience, index) => (
                <motion.div
                  key={index}
                  className="experience-item bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{experience.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {experience.title}
                        </h4>
                        <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                          {experience.year}
                        </span>
                      </div>
                      <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                        {experience.company}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {experience.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Info */}
            <motion.div
              className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-primary-100 dark:border-primary-800"
              variants={itemVariants}
            >
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                What I Bring to the Table
              </h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  <span>Problem-solving mindset with analytical thinking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  <span>Strong communication and collaboration skills</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  <span>Continuous learning and adaptation to new technologies</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  <span>Attention to detail and code quality</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
