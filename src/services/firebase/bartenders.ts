import { where } from 'firebase/firestore';
import type { Bartender } from '../../types';
import { createDocument, getDocument, getDocuments, updateDocument, deleteDocument } from './firestore';

const COLLECTION = 'bartenders';

export const createBartender = async (data: Omit<Bartender, 'id' | 'createdAt'>): Promise<Bartender> => {
  const id = `bt_${Date.now()}`;
  const bartender: Bartender = {
    ...data,
    id,
    createdAt: Date.now()
  };
  return createDocument<Bartender>(COLLECTION, id, bartender);
};

export const getBartender = async (id: string): Promise<Bartender | null> => {
  return getDocument<Bartender>(COLLECTION, id);
};

export const getAllBartenders = async (): Promise<Bartender[]> => {
  return getDocuments<Bartender>(COLLECTION);
};

export const getBartendersByCity = async (city: string): Promise<Bartender[]> => {
  return getDocuments<Bartender>(COLLECTION, [where('city', '==', city)]);
};

export const getBartenderByUserId = async (userId: string): Promise<Bartender | null> => {
  const docs = await getDocuments<Bartender>(COLLECTION, [where('userId', '==', userId)]);
  return docs.length > 0 ? docs[0] : null;
};

export const getBartenderBySlug = async (slug: string): Promise<Bartender | null> => {
  const docs = await getDocuments<Bartender>(COLLECTION, [where('slug', '==', slug)]);
  return docs.length > 0 ? docs[0] : null;
};

export const updateBartender = async (id: string, data: Partial<Omit<Bartender, 'id' | 'createdAt'>>) => {
  return updateDocument<Bartender>(COLLECTION, id, data);
};

export const deleteBartender = async (id: string) => {
  return deleteDocument(COLLECTION, id);
};
