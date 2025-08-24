/*
  Seed the Firestore `projects` collection with initial data.
  - Reads from `backend/data/projects.json` if present, otherwise uses example data.
  - Creates/updates documents by a stable slug id derived from the project title.
*/

const fs = require('fs');
const path = require('path');
const { admin, db, isDemoMode } = require('../firebase-admin');

async function readProjectsFromFile() {
  const dataDir = path.join(__dirname, '../data');
  const customPath = path.join(dataDir, 'projects.json');
  const examplePath = path.join(dataDir, 'projects.example.json');

  if (fs.existsSync(customPath)) {
    const raw = fs.readFileSync(customPath, 'utf8');
    return JSON.parse(raw);
  }

  if (fs.existsSync(examplePath)) {
    const raw = fs.readFileSync(examplePath, 'utf8');
    return JSON.parse(raw);
  }

  // Fallback example data if files are missing
  return [
    {
      title: 'Internal Dashboard',
      description: 'Admin dashboard for analytics and operations.',
      image: 'https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=Internal+Dashboard',
      techStack: ['React', 'Firebase', 'Tailwind'],
      category: 'web',
      demoUrl: 'https://yourdomain.com', 
      featured: false
    },
    {
      title: 'Portfolio Website',
      description: 'This portfolio website showcasing projects and contact form.',
      image: 'https://via.placeholder.com/400x250/8B5CF6/FFFFFF?text=Portfolio',
      techStack: ['React', 'Framer Motion', 'Tailwind'],
      category: 'frontend',
      githubUrl: 'https://github.com/youruser/portfolio',
      demoUrl: 'https://yourdomain.com',
      featured: true
    },
    {
      title: 'Task Manager',
      description: 'Collaborative task management app with real-time updates.',
      image: 'https://via.placeholder.com/400x250/10B981/FFFFFF?text=Task+Manager',
      techStack: ['React', 'Firebase'],
      category: 'web',
      githubUrl: 'https://github.com/youruser/task-manager',
      demoUrl: 'https://yourdomain.com',
      featured: false
    }
  ];
}

function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function seed() {
  try {
    if (isDemoMode || !admin || !db) {
      console.error('\nFirebase Admin is not initialized. Configure backend/.env with service account and restart.');
      process.exit(1);
    }

    const projects = await readProjectsFromFile();
    if (!Array.isArray(projects) || projects.length === 0) {
      console.error('No projects to seed. Ensure your JSON contains an array.');
      process.exit(1);
    }

    const batch = db.batch();
    const collRef = db.collection('projects');

    projects.forEach((project) => {
      if (!project || !project.title) return;
      const id = slugify(project.title);
      const docRef = collRef.doc(id);
      const now = admin.firestore.FieldValue.serverTimestamp();

      batch.set(
        docRef,
        {
          title: project.title,
          description: project.description || '',
          image: project.image || '',
          techStack: Array.isArray(project.techStack) ? project.techStack : [],
          category: project.category || 'web',
          githubUrl: project.githubUrl || null,
          demoUrl: project.demoUrl || null,
          isPrivate: project.isPrivate === true,
          featured: project.featured === true,
          createdAt: now
        },
        { merge: true }
      );
    });

    await batch.commit();
    console.log(`Seeded ${projects.length} project(s) into Firestore.`);
    console.log('You can edit backend/data/projects.json and re-run to update.');
  } catch (error) {
    console.error('Failed to seed projects:', error);
    process.exit(1);
  }
}

seed();


