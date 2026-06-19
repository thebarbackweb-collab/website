import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, QueryConstraint } from 'firebase/firestore';
import { db } from './config';

export const createDocument = async <T extends { [x: string]: any }>(collectionName: string, id: string, data: T) => {
  const docRef = doc(db, collectionName, id);
  await setDoc(docRef, data);
  return { id, ...data };
};

export const getDocument = async <T>(collectionName: string, id: string): Promise<T | null> => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as T;
  }
  return null;
};

export const updateDocument = async <T extends { [x: string]: any }>(collectionName: string, id: string, data: Partial<T>) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data as { [x: string]: any });
};

export const deleteDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

export const getDocuments = async <T>(collectionName: string, constraints: QueryConstraint[] = []): Promise<T[]> => {
  const q = query(collection(db, collectionName), ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as T);
};
