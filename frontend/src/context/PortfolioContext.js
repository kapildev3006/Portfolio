import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    name: 'Kapil Dev',
    email: 'kapildev@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://kapildev.com',
    bio: 'Passionate Full Stack Developer with expertise in modern web technologies.',
    title: 'Full Stack Developer',
    avatar: '/Profile.jpg'
  });

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time Firebase listeners for instant updates
  useEffect(() => {
    if (!db) {
      console.warn('Firebase not initialized, using demo data');
      setLoading(false);
      return;
    }

    const unsubscribeFunctions = [];

    try {
      // Profile listener
      const profileUnsubscribe = onSnapshot(
        doc(db, 'portfolio', 'profile'),
        (doc) => {
          if (doc.exists()) {
            setProfile(prev => ({ ...prev, ...doc.data() }));
          }
        },
        (error) => {
          console.error('Profile listener error:', error);
          setError('Failed to load profile data');
        }
      );
      unsubscribeFunctions.push(profileUnsubscribe);

      // Projects listener with optimized query
      const projectsQuery = query(
        collection(db, 'projects'),
        orderBy('createdAt', 'desc')
      );
      const projectsUnsubscribe = onSnapshot(
        projectsQuery,
        (snapshot) => {
          const projectsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setProjects(projectsData);
        },
        (error) => {
          console.error('Projects listener error:', error);
          setError('Failed to load projects data');
        }
      );
      unsubscribeFunctions.push(projectsUnsubscribe);

      // Skills listener
      const skillsUnsubscribe = onSnapshot(
        collection(db, 'skills'),
        (snapshot) => {
          const skillsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setSkills(skillsData);
        },
        (error) => {
          console.error('Skills listener error:', error);
          setError('Failed to load skills data');
        }
      );
      unsubscribeFunctions.push(skillsUnsubscribe);

      // Messages listener with optimized query
      const messagesQuery = query(
        collection(db, 'messages'),
        orderBy('createdAt', 'desc')
      );
      const messagesUnsubscribe = onSnapshot(
        messagesQuery,
        (snapshot) => {
          const messagesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMessages(messagesData);
        },
        (error) => {
          console.error('Messages listener error:', error);
          setError('Failed to load messages data');
        }
      );
      unsubscribeFunctions.push(messagesUnsubscribe);

      setLoading(false);
    } catch (error) {
      console.error('Error setting up listeners:', error);
      setError('Failed to initialize data listeners');
      setLoading(false);
    }

    // Cleanup function
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  // Project management functions
  const addProject = async (projectData) => {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const newProject = { id: docRef.id, ...projectData };
      setProjects(prev => [newProject, ...prev]);
      return { success: true, project: newProject };
    } catch (error) {
      console.error('Error adding project:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProject = async (projectId, updates) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, ...updates } : p
      ));
      return { success: true };
    } catch (error) {
      console.error('Error updating project:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      setProjects(prev => prev.filter(p => p.id !== projectId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { success: false, error: error.message };
    }
  };

  // Skill management functions
  const addSkill = async (skillData) => {
    try {
      const docRef = await addDoc(collection(db, 'skills'), {
        ...skillData,
        createdAt: new Date()
      });
      
      const newSkill = { id: docRef.id, ...skillData };
      setSkills(prev => [...prev, newSkill]);
      return { success: true, skill: newSkill };
    } catch (error) {
      console.error('Error adding skill:', error);
      return { success: false, error: error.message };
    }
  };

  const updateSkill = async (skillId, updates) => {
    try {
      const skillRef = doc(db, 'skills', skillId);
      await updateDoc(skillRef, updates);
      
      setSkills(prev => prev.map(s => 
        s.id === skillId ? { ...s, ...updates } : s
      ));
      return { success: true };
    } catch (error) {
      console.error('Error updating skill:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteSkill = async (skillId) => {
    try {
      await deleteDoc(doc(db, 'skills', skillId));
      setSkills(prev => prev.filter(s => s.id !== skillId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting skill:', error);
      return { success: false, error: error.message };
    }
  };

  // Message management functions
  const addMessage = async (messageData) => {
    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        ...messageData,
        createdAt: new Date(),
        status: 'new'
      });
      
      const newMessage = { id: docRef.id, ...messageData, status: 'new', createdAt: new Date() };
      setMessages(prev => [...prev, newMessage]);
      return { success: true, message: newMessage };
    } catch (error) {
      console.error('Error adding message:', error);
      return { success: false, error: error.message };
    }
  };

  const updateMessageStatus = async (messageId, status) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, { status, updatedAt: new Date() });
      
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, status } : m
      ));
      return { success: true };
    } catch (error) {
      console.error('Error updating message status:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await deleteDoc(doc(db, 'messages', messageId));
      setMessages(prev => prev.filter(m => m.id !== messageId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting message:', error);
      return { success: false, error: error.message };
    }
  };

  // Profile management
  const updateProfile = async (updates) => {
    try {
      const profileRef = doc(db, 'portfolio', 'profile'); // Reference to the profile document
      await updateDoc(profileRef, updates); // Update the document in Firestore
      setProfile(prev => ({ ...prev, ...updates })); // Update local state
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  };

  // Get published projects for portfolio display
  const getPublishedProjects = () => {
    return projects.filter(project => project.status === 'published');
  };

  // Get featured projects
  const getFeaturedProjects = () => {
    return projects.filter(project => project.featured && project.status === 'published');
  };

  // Get projects by category
  const getProjectsByCategory = (category) => {
    if (category === 'all') return getPublishedProjects();
    return projects.filter(project => project.category === category && project.status === 'published');
  };



  const value = {
    // State
    profile,
    projects,
    skills,
    messages,
    loading,
    error,
    
    // Functions
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    updateSkill,
    deleteSkill,
    addMessage,
    updateMessageStatus,
    deleteMessage,
    updateProfile,
    getPublishedProjects,
    getFeaturedProjects,
    getProjectsByCategory
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
