import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  collectionGroup
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Helper functions
const createUserDocument = async (user, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = user;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user document', error);
    }
  }

  return getUserDocument(user.uid);
};

const getUserDocument = async (uid) => {
  if (!uid) return null;

  try {
    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      return { uid, ...snapshot.data() };
    }
  } catch (error) {
    console.error('Error fetching user document', error);
  }

  return null;
};

const updateUserDocument = async (uid, data) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
    return true;
  } catch (error) {
    console.error('Error updating user document', error);
    return false;
  }
};

// Authentication functions
const registerWithEmailAndPassword = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    await createUserDocument(userCredential.user, { displayName: name });
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Firestore functions
const addUploadToUser = async (userId, uploadData) => {
  try {
    const uploadsRef = collection(db, 'users', userId, 'uploads');
    const newUploadRef = doc(uploadsRef);
    await setDoc(newUploadRef, {
      ...uploadData,
      createdAt: new Date()
    });
    return { success: true, id: newUploadRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const getUserUploads = async (userId) => {
  try {
    const uploadsRef = collection(db, 'users', userId, 'uploads');
    const q = query(uploadsRef);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user uploads:', error);
    return [];
  }
};

const getAllUploads = async () => {
  try {
    const uploadsQuery = collectionGroup(db, 'uploads');
    const querySnapshot = await getDocs(uploadsQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      userId: doc.ref.parent.parent?.id
    }));
  } catch (error) {
    console.error('Error getting all uploads:', error);
    return [];
  }
};

export {
  auth,
  db,
  storage,
  // Authentication
  registerWithEmailAndPassword,
  loginWithEmailAndPassword,
  logout,
  onAuthStateChanged,
  // Firestore
  createUserDocument,
  getUserDocument,
  updateUserDocument,
  addUploadToUser,
  getUserUploads,
  getAllUploads
};