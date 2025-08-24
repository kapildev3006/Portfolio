require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = {
  type: process.env.FIREBASE_TYPE || "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
  token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

// Check if Firebase is properly configured
if (!process.env.FIREBASE_PROJECT_ID) {
  console.warn('Firebase configuration not found. Running in demo mode without Firebase features.');
  console.warn('Please set up your Firebase environment variables for full functionality.');
  
  // Export mock objects for demo mode
  const mockDb = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => null }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        delete: () => Promise.resolve()
      }),
      add: () => Promise.resolve({ id: 'demo-id' }),
      get: () => Promise.resolve({ docs: [], empty: true })
    })
  };
  
  module.exports = { 
    admin: null, 
    db: mockDb,
    isDemoMode: true 
  };
} else {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    });
    console.log('Firebase Admin initialized successfully');
    
    // Export Firestore instance
    const db = admin.firestore();
    module.exports = { admin, db, isDemoMode: false };
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    
    // Export mock objects if initialization fails
    const mockDb = {
      collection: () => ({
        doc: () => ({
          get: () => Promise.resolve({ exists: false, data: () => null }),
          set: () => Promise.resolve(),
          update: () => Promise.resolve(),
          delete: () => Promise.resolve()
        }),
        add: () => Promise.resolve({ id: 'demo-id' }),
        get: () => Promise.resolve({ docs: [], empty: true })
      })
    };
    
    module.exports = { 
      admin: null, 
      db: mockDb,
      isDemoMode: true 
    };
  }
}




