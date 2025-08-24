const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { db } = require('./firebase-admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      // Allow Firebase SDK network calls from the frontend
      connectSrc: [
        "'self'",
        "https://firestore.googleapis.com",
        "https://*.googleapis.com",
        "https://*.firebaseio.com",
        "https://www.googleapis.com",
        "https://www.gstatic.com"
      ]
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Middleware
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projectsRef = db.collection('projects');
    const snapshot = await projectsRef.orderBy('createdAt', 'desc').get();
    
    const projects = [];
    snapshot.forEach(doc => {
      projects.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      success: true,
      data: projects,
      count: projects.length
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
      message: error.message
    });
  }
});

// Get projects by category
app.get('/api/projects/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const projectsRef = db.collection('projects');
    const snapshot = await projectsRef.where('category', '==', category).orderBy('createdAt', 'desc').get();
    
    const projects = [];
    snapshot.forEach(doc => {
      projects.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      success: true,
      data: projects,
      count: projects.length,
      category
    });
  } catch (error) {
    console.error('Error fetching projects by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects by category',
      message: error.message
    });
  }
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['name', 'email', 'subject', 'message']
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }
    
    // Store in Firestore
    const contactRef = db.collection('contacts');
    const docRef = await contactRef.add({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      timestamp: new Date(),
      status: 'new',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      id: docRef.id
    });
    
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form',
      message: error.message
    });
  }
});

// Get contact submissions (admin only - add authentication in production)
app.get('/api/contacts', async (req, res) => {
  try {
    // In production, add authentication middleware here
    const contactsRef = db.collection('contacts');
    const snapshot = await contactsRef.orderBy('timestamp', 'desc').get();
    
    const contacts = [];
    snapshot.forEach(doc => {
      contacts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      success: true,
      data: contacts,
      count: contacts.length
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contacts',
      message: error.message
    });
  }
});

// Update contact status (admin only)
app.patch('/api/contacts/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: new, read, replied, archived'
      });
    }
    
    const contactRef = db.collection('contacts').doc(id);
    await contactRef.update({
      status,
      updatedAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Contact status updated successfully',
      id,
      status
    });
    
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update contact status',
      message: error.message
    });
  }
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Admin panel route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Handle React routing, return all requests to React app
// BUT make sure API routes are handled first
app.get('*', (req, res) => {
  // Don't serve React app for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: 'API endpoint not found',
      path: req.originalUrl
    });
  }
  
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Portfolio App running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
