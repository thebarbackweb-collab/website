import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from './config';
import { createUserProfile, getUserProfile } from './users';
import type { User, Role } from '../../types';

export const registerUser = async (email: string, password: string, name: string, phone: string, role: Role): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const { uid } = userCredential.user;
  
  // Create user profile in Firestore
  return createUserProfile(uid, {
    name,
    email,
    phone,
    role
  });
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const { uid } = userCredential.user;
  
  // Fetch full user profile from Firestore
  return getUserProfile(uid);
};

export const logoutUser = async () => {
  await firebaseSignOut(auth);
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const userProfile = await getUserProfile(firebaseUser.uid);
      callback(userProfile);
    } else {
      callback(null);
    }
  });
};
