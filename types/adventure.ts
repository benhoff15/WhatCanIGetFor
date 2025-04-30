export interface Adventure {
  id: string;
  type: string;
  title: string;
  location: string;
  price: number;
  description: string;
  date?: string;
  duration?: string;
  details?: string[];
}