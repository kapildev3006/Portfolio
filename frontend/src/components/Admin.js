import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderOpen, 
  MessageCircle, 
  Trophy, 
  Settings, 
  ArrowLeft,
  Bell,
  LogOut
} from 'lucide-react';
import { gsap } from 'gsap';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { usePortfolio } from '../context/PortfolioContext';
import AdminProjects from './AdminProjects';

const Admin = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const { profile, projects, skills, messages } = usePortfolio();

  useEffect(() => {
    // Simple GSAP animations
    gsap.fromTo('.admin-header', 
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.6 }
    );

    gsap.fromTo('.admin-sidebar', 
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6 }
    );

    gsap.fromTo('.admin-main-content', 
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.6 }
    );
  }, []);

  const showToast = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white admin-header">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg" whileHover={{ y: -2 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg" whileHover={{ y: -2 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {projects.filter(p => p.status === 'published').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg" whileHover={{ y: -2 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unread Messages</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {messages.filter(m => m.status === 'unread').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg" whileHover={{ y: -2 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Skills</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{skills.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="admin-sidebar bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Portfolio Management</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your portfolio content</p>
              </div>
              
              <nav className="space-y-2">
                {[
                  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
                  { id: 'projects', name: 'Projects', icon: FolderOpen },
                  { id: 'messages', name: 'Messages', icon: MessageCircle },
                  { id: 'skills', name: 'Skills', icon: Trophy },
                  { id: 'settings', name: 'Settings', icon: Settings }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === item.id
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                    {item.id === 'messages' && messages.filter(m => m.status === 'unread').length > 0 && (
                      <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {messages.filter(m => m.status === 'unread').length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="admin-main-content">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          {notificationMessage}
        </motion.div>
      )}
    </div>
  );
};

export default Admin;
