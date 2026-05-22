export interface BusinessHoursDay {
  open: string;
  close: string;
  closed: boolean;
}

export interface BusinessHours {
  friday: BusinessHoursDay;
  monday: BusinessHoursDay;
  sunday: BusinessHoursDay;
  tuesday: BusinessHoursDay;
  saturday: BusinessHoursDay;
  thursday: BusinessHoursDay;
  wednesday: BusinessHoursDay;
}

export interface BusinessUser {
  id: string;
  name: string;
}

export interface Business {
  id: string;
  name: string;
  address: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  phone: string;
  plan: string;
  businessHours: BusinessHours;
  specialDays: Record<string, unknown>;
  defaultSlotInterval: number;
  deletedAt: string | null;
  users: BusinessUser[];
}

export interface ServiceUserWrapper {
  user: {
    id: string;
    name: string;
  };
}

export interface Service {
  id: string;
  name: string;
  durationMin: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  description: string;
  imageUrl: string | null;
  businessId: string;
  category: string | null;
  cleaningTimeMin: number;
  isActive: boolean;
  users: ServiceUserWrapper[];
}
