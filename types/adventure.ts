export interface Adventure {
  id: string;
  type: string;
  title: string;
  location: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  price: number;
  description: string;
  date?: string | null;
  duration?: string | null;
  details?: string | null;
  bookingUrl?: string;
  imageUrl?: string;
  timeOfDay?: string | null;
  groupSize?: string | null; 
  notes?: string;
  tripBlockId?: string | null; // Reference to the trip block this adventure belongs to
}

export interface TripBlock {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  adventures: Adventure[];
  createdAt: string;
  updatedAt: string;
  notes?: string;
}
