import { createDocument } from './firestore';

const COLLECTION = 'notifications';

export interface Notification {
  id: string;
  userId: string; // The bartender or user receiving it
  title: string;
  message: string;
  type: 'booking' | 'system' | 'message';
  read: boolean;
  createdAt: number;
  link?: string;
}

export const createNotification = async (data: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification> => {
  const id = `notif_${Date.now()}`;
  const notification: Notification = {
    ...data,
    id,
    read: false,
    createdAt: Date.now()
  };
  return createDocument<Notification>(COLLECTION, id, notification);
};
