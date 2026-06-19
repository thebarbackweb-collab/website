import type { User } from '../../types';
import { createDocument, getDocument, updateDocument, getDocuments } from './firestore';
import { where } from 'firebase/firestore';

const COLLECTION = 'users';

export const createUserProfile = async (uid: string, data: Omit<User, 'uid' | 'createdAt'>): Promise<User> => {
  const user: User = {
    ...data,
    uid,
    createdAt: Date.now()
  };
  return createDocument<User>(COLLECTION, uid, user);
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
  const doc = await getDocument<User>(COLLECTION, uid);
  return doc || null;
};

export const getUserByPhone = async (phone: string): Promise<User | null> => {
  const docs = await getDocuments<User>(COLLECTION, [where('phone', '==', phone)]);
  return docs.length > 0 ? docs[0] : null;
};

export const updateUserProfile = async (uid: string, data: Partial<Omit<User, 'uid' | 'createdAt'>>) => {
  return updateDocument<User>(COLLECTION, uid, data);
};
