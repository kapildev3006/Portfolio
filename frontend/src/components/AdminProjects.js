import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { motion } from 'framer-motion';
import { PlusCircle, Edit, Trash2, Save, XCircle, ExternalLink, Github, Lock, Unlock } from 'lucide-react';

const AdminProjects = () => {
  const { projects, addProject, updateProject, deleteProject } = usePortfolio();
  const [editingProject, setEditingProject] = useState(null);
  const [newProjectData, setNewProjectData] = useState({
    title: '',
    description: '',
    image: '',
    techStack: [],
    category: '',
    githubUrl: '',
    demoUrl: '',
    isPrivate: false,
    featured: false,
    status: 'draft'
  });

  const handleAddProject = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!newProjectData.title || !newProjectData.description || !newProjectData.category) {
      alert('Please fill in all required fields (Title, Description, Category).');
      return;
    }
    await addProject(newProjectData);
    setNewProjectData({
      title: '',
      description: '',
      image: '',
      techStack: [],
      category: '',
      githubUrl: '',
      demoUrl: '',
      isPrivate: false,
      featured: false,
      status: 'draft'
    });
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!editingProject.title || !editingProject.description || !editingProject.category) {
      alert('Please fill in all required fields (Title, Description, Category).');
      return;
    }
    await updateProject(editingProject.id, editingProject);
    setEditingProject(null);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
    }
  };

  const handleNewProjectChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProjectData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditingProjectChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProject(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTechStackChange = (e, formType) => {
    const value = e.target.value;
    const techStackArray = value.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
    if (formType === 'new') {
      setNewProjectData(prev => ({ ...prev, techStack: techStackArray }));
    } else {
      setEditingProject(prev => ({ ...prev, techStack: techStackArray }));
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Projects</h2>

      {/* Add New Project Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Project</h3>
        <form onSubmit={handleAddProject} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={newProjectData.title}
            onChange={handleNewProjectChange}
            className="form-input"
            required
          />
          <textarea
            name="description"
            placeholder="Project Description"
            value={newProjectData.description}
            onChange={handleNewProjectChange}
            className="form-textarea"
            rows="3"
            required
          ></textarea>
          <input
            type="text"
            name="image"
            placeholder="Image URL (e.g., /path/to/image.png)"
            value={newProjectData.image}
            onChange={handleNewProjectChange}
            className="form-input"
          />
          <input
            type="text"
            name="techStack"
            placeholder="Tech Stack (comma-separated: React, Node.js, MongoDB)"
            value={newProjectData.techStack.join(', ')}
            onChange={(e) => handleTechStackChange(e, 'new')}
            className="form-input"
          />
          <select
            name="category"
            value={newProjectData.category}
            onChange={handleNewProjectChange}
            className="form-select"
            required
          >
            <option value="">Select Category</option>
            <option value="web">Web App</option>
            <option value="mobile">Mobile App</option>
            <option value="fullstack">Full Stack</option>
            <option value="frontend">Frontend</option>
          </select>
          <input
            type="url"
            name="githubUrl"
            placeholder="GitHub URL"
            value={newProjectData.githubUrl}
            onChange={handleNewProjectChange}
            className="form-input"
          />
          <input
            type="url"
            name="demoUrl"
            placeholder="Demo URL"
            value={newProjectData.demoUrl}
            onChange={handleNewProjectChange}
            className="form-input"
          />
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                name="isPrivate"
                checked={newProjectData.isPrivate}
                onChange={handleNewProjectChange}
                className="form-checkbox"
              />
              <span>Private</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                name="featured"
                checked={newProjectData.featured}
                onChange={handleNewProjectChange}
                className="form-checkbox"
              />
              <span>Featured</span>
            </label>
            <select
              name="status"
              value={newProjectData.status}
              onChange={handleNewProjectChange}
              className="form-select"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <motion.button 
            type="submit" 
            className="btn-primary w-full flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlusCircle size={20} /> Add Project
          </motion.button>
        </form>
      </motion.div>

      {/* Projects List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Existing Projects</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {projects.map((project) => (
                <tr key={project.id}>
                  {editingProject && editingProject.id === project.id ? (
                    // Editing row
                    <td colSpan="4" className="p-4">
                      <form onSubmit={handleUpdateProject} className="space-y-3">
                        <input
                          type="text"
                          name="title"
                          placeholder="Project Title"
                          value={editingProject.title}
                          onChange={handleEditingProjectChange}
                          className="form-input"
                          required
                        />
                        <textarea
                          name="description"
                          placeholder="Project Description"
                          value={editingProject.description}
                          onChange={handleEditingProjectChange}
                          className="form-textarea"
                          rows="2"
                          required
                        ></textarea>
                        <input
                          type="text"
                          name="image"
                          placeholder="Image URL"
                          value={editingProject.image}
                          onChange={handleEditingProjectChange}
                          className="form-input"
                        />
                        <input
                          type="text"
                          name="techStack"
                          placeholder="Tech Stack (comma-separated)"
                          value={editingProject.techStack.join(', ')}
                          onChange={(e) => handleTechStackChange(e, 'edit')}
                          className="form-input"
                        />
                        <select
                          name="category"
                          value={editingProject.category}
                          onChange={handleEditingProjectChange}
                          className="form-select"
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="web">Web App</option>
                          <option value="mobile">Mobile App</option>
                          <option value="fullstack">Full Stack</option>
                          <option value="frontend">Frontend</option>
                        </select>
                        <input
                          type="url"
                          name="githubUrl"
                          placeholder="GitHub URL"
                          value={editingProject.githubUrl}
                          onChange={handleEditingProjectChange}
                          className="form-input"
                        />
                        <input
                          type="url"
                          name="demoUrl"
                          placeholder="Demo URL"
                          value={editingProject.demoUrl}
                          onChange={handleEditingProjectChange}
                          className="form-input"
                        />
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                            <input
                              type="checkbox"
                              name="isPrivate"
                              checked={editingProject.isPrivate}
                              onChange={handleEditingProjectChange}
                              className="form-checkbox"
                            />
                            <span>Private</span>
                          </label>
                          <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                            <input
                              type="checkbox"
                              name="featured"
                              checked={editingProject.featured}
                              onChange={handleEditingProjectChange}
                              className="form-checkbox"
                            />
                            <span>Featured</span>
                          </label>
                          <select
                            name="status"
                            value={editingProject.status}
                            onChange={handleEditingProjectChange}
                            className="form-select"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                          </select>
                        </div>
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
                            onClick={() => setEditingProject(null)} 
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {project.image && (
                            <img className="h-10 w-10 rounded-full mr-4 object-cover" src={project.image} alt={project.title} />
                          )}
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{project.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{project.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          project.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                              <Github size={18} />
                            </a>
                          )}
                          {project.demoUrl && (
                            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                              <ExternalLink size={18} />
                            </a>
                          )}
                          {project.isPrivate ? (
                            <Lock size={18} className="text-yellow-500" title="Private" />
                          ) : (
                            <Unlock size={18} className="text-green-500" title="Public" />
                          )}
                          <motion.button 
                            onClick={() => setEditingProject({ ...project })} 
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit size={18} />
                          </motion.button>
                          <motion.button 
                            onClick={() => handleDeleteProject(project.id)} 
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
              {projects.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                    No projects found.
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

export default AdminProjects;
