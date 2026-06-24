export type Role = 'customer' | 'bartender' | 'admin';
export type AvailabilityStatus = 'available' | 'busy' | 'partially available';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: number; // Storing as timestamp
}

export interface Bartender {
  id: string;
  userId?: string; // Links to Auth User
  bartenderCode: string; // 5-digit unique ID
  name: string;
  slug: string; // For SEO URL
  email?: string;
  loginPhone?: string;
  callingNumber?: string;
  city: string;
  state: string;
  experience: number;
  languages?: string[];
  specializations?: string[];
  signatureCocktails?: string[];
  pricing: Record<string, any>; // You can structure pricing like packages later
  bio: string;
  profileImage: string;
  coverImage: string;
  galleryImages: string[];
  whatsappNumber: string;
  availability: AvailabilityStatus;
  verified: boolean;
  rating: number;
  createdAt: number;
}

export interface Booking {
  id: string;
  bartenderId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  guests: string;
  occasion: string;
  budget: string;
  specialRequirements: string;
  status: BookingStatus;
  createdAt: number;
}

export interface Review {
  id: string;
  bartenderId: string;
  customerId: string;
  rating: number;
  review: string;
  createdAt: number;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  featured: boolean;
}

export interface Equipment {
  id: string;
  title: string;
  description: string;
  images: string[];
  pricingType: 'per hour' | 'per day';
  price: number;
  status: 'available' | 'rented';
  createdAt: number;
}
