import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

const AdminProfile = () => {
  const { profile, updateProfile } = usePortfolio();
  const [formData, setFormData] = useState(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Profile</h2>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Profile Information</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Name:</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Email:</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Phone:</span>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Location:</span>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Website:</span>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="form-input"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Title:</span>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
            />
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Bio:</span>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
            ></textarea>
          </label>
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300">Avatar URL:</span>
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="form-input"
            />
          </label>
          <motion.button 
            type="submit" 
            className="btn-primary w-full flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save size={20} /> Save Profile
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminProfile;
