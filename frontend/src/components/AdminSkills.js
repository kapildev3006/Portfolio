import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion } from 'framer-motion';
import { PlusCircle, Edit, Trash2, Save, XCircle } from 'lucide-react';

const AdminSkills = () => {
  const { skills, addSkill, updateSkill, deleteSkill } = usePortfolio();
  const [editingSkill, setEditingSkill] = useState(null);
  const [newSkillData, setNewSkillData] = useState({
    name: '',
    proficiency: 'Beginner',
    category: 'Frontend',
    icon: '',
  });

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillData.name) {
      alert('Skill name cannot be empty.');
      return;
    }
    await addSkill(newSkillData);
    setNewSkillData({
      name: '',
      proficiency: 'Beginner',
      category: 'Frontend',
      icon: '',
    });
  };

  const handleUpdateSkill = async (e) => {
    e.preventDefault();
    if (!editingSkill.name) {
      alert('Skill name cannot be empty.');
      return;
    }
    await updateSkill(editingSkill.id, editingSkill);
    setEditingSkill(null);
  };

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      await deleteSkill(skillId);
    }
  };

  const handleNewSkillChange = (e) => {
    const { name, value } = e.target;
    setNewSkillData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditingSkillChange = (e) => {
    const { name, value } = e.target;
    setEditingSkill(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Skills</h2>

      {/* Add New Skill Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Skill</h3>
        <form onSubmit={handleAddSkill} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Skill Name (e.g., React, Node.js)"
            value={newSkillData.name}
            onChange={handleNewSkillChange}
            className="form-input"
            required
          />
          <select
            name="proficiency"
            value={newSkillData.proficiency}
            onChange={handleNewSkillChange}
            className="form-select"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
          <select
            name="category"
            value={newSkillData.category}
            onChange={handleNewSkillChange}
            className="form-select"
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="DevOps">DevOps</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="icon"
            placeholder="Icon Class (e.g., fab fa-react)"
            value={newSkillData.icon}
            onChange={handleNewSkillChange}
            className="form-input"
          />
          <motion.button 
            type="submit" 
            className="btn-primary w-full flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlusCircle size={20} /> Add Skill
          </motion.button>
        </form>
      </motion.div>

      {/* Skills List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Existing Skills</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Proficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {skills.map((skill) => (
                <tr key={skill.id}>
                  {editingSkill && editingSkill.id === skill.id ? (
                    // Editing row
                    <td colSpan="4" className="p-4">
                      <form onSubmit={handleUpdateSkill} className="space-y-3">
                        <input
                          type="text"
                          name="name"
                          placeholder="Skill Name"
                          value={editingSkill.name}
                          onChange={handleEditingSkillChange}
                          className="form-input"
                          required
                        />
                        <select
                          name="proficiency"
                          value={editingSkill.proficiency}
                          onChange={handleEditingSkillChange}
                          className="form-select"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                        <select
                          name="category"
                          value={editingSkill.category}
                          onChange={handleEditingSkillChange}
                          className="form-select"
                        >
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                          <option value="Database">Database</option>
                          <option value="DevOps">DevOps</option>
                          <option value="Other">Other</option>
                        </select>
                        <input
                          type="text"
                          name="icon"
                          placeholder="Icon Class"
                          value={editingSkill.icon}
                          onChange={handleEditingSkillChange}
                          className="form-input"
                        />
                        <div className="flex space-x-2">
                          <motion.button 
                            type="submit" 
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Save size={20} /> Save
                          </motion.button>
                          <motion.button 
                            type="button" 
                            onClick={() => setEditingSkill(null)} 
                            className="btn-secondary flex-1 flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <XCircle size={20} /> Cancel
                          </motion.button>
                        </div>
                      </form>
                    </td>
                  ) : (
                    // Display row
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{skill.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{skill.proficiency}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{skill.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <motion.button 
                            onClick={() => setEditingSkill({ ...skill })} 
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit size={18} />
                          </motion.button>
                          <motion.button 
                            onClick={() => handleDeleteSkill(skill.id)} 
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {skills.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                    No skills found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSkills;
