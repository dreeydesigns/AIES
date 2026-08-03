// Run this script locally using Node to provision an admin account
// Requires Firebase Admin SDK and service account key
// npm install firebase-admin

const admin = require('firebase-admin');

// 1. Download your service account key from Firebase Console
// 2. Set the path here or use GOOGLE_APPLICATION_CREDENTIALS
// const serviceAccount = require('./path-to-service-account.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

async function createAdmin(email, password) {
  /*
  const db = admin.firestore();
  
  // Create user in Auth
  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: 'System Admin'
  });

  // Create user in Firestore with admin role (bypasses rules)
  await db.collection('users').doc(userRecord.uid).set({
    name: 'System Admin',
    role: 'admin',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log('Successfully created admin user:', userRecord.uid);
  */
  console.log("Uncomment code and add service account credentials to run.");
}

// createAdmin('admin@example.com', 'secure_password_here');
