import { createDocument, getDocument, getDocuments, updateDocument, deleteDocument } from './firestore';
import type { Equipment } from '../../types';

const COLLECTION = 'equipments';

export const createEquipment = async (data: Omit<Equipment, 'id' | 'createdAt'>): Promise<Equipment> => {
  const id = `eq_${Date.now()}`;
  const equipment: Equipment = {
    ...data,
    id,
    createdAt: Date.now()
  };
  return createDocument<Equipment>(COLLECTION, id, equipment);
};

export const getEquipment = async (id: string): Promise<Equipment | null> => {
  return getDocument<Equipment>(COLLECTION, id);
};

export const getAllEquipments = async (): Promise<Equipment[]> => {
  return getDocuments<Equipment>(COLLECTION);
};

export const updateEquipment = async (id: string, data: Partial<Omit<Equipment, 'id' | 'createdAt'>>) => {
  return updateDocument<Equipment>(COLLECTION, id, data);
};

export const deleteEquipment = async (id: string) => {
  return deleteDocument(COLLECTION, id);
};
