import { where } from 'firebase/firestore';
import type { Booking } from '../../types';
import { createDocument, getDocument, getDocuments, updateDocument } from './firestore';

const COLLECTION = 'bookings';

export const createBooking = async (data: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
  const id = `bk_${Date.now()}`;
  const booking: Booking = {
    ...data,
    id,
    createdAt: Date.now()
  };
  return createDocument<Booking>(COLLECTION, id, booking);
};

export const getBooking = async (id: string): Promise<Booking | null> => {
  return getDocument<Booking>(COLLECTION, id);
};

export const getBookingsByCustomer = async (customerId: string): Promise<Booking[]> => {
  return getDocuments<Booking>(COLLECTION, [where('customerId', '==', customerId)]);
};

export const getBookingsByBartender = async (bartenderId: string): Promise<Booking[]> => {
  return getDocuments<Booking>(COLLECTION, [where('bartenderId', '==', bartenderId)]);
};

export const updateBookingStatus = async (id: string, status: Booking['status']) => {
  return updateDocument<Booking>(COLLECTION, id, { status });
};
