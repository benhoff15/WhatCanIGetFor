import { Adventure } from "@/types/adventure";

// Mock data for different adventure types
const mockFlights: Adventure[] = [
  {
    id: "flight-1",
    type: "Flight",
    title: "Round-trip to New York",
    location: "New York, NY",
    price: 299,
    description: "Enjoy a round-trip flight to the Big Apple. Experience the vibrant city life, iconic landmarks, and diverse culture of New York City.",
    date: "Jun 15 - Jun 22",
    duration: "2h 45m each way",
    details: [
      "Non-stop flight",
      "Includes carry-on bag",
      "Free seat selection",
      "Flexible cancellation policy"
    ]
  },
  {
    id: "flight-2",
    type: "Flight",
    title: "One-way to Miami",
    location: "Miami, FL",
    price: 149,
    description: "Escape to the sunny beaches of Miami with this one-way flight. Perfect for a spontaneous getaway to enjoy the warm weather and vibrant nightlife.",
    date: "Jun 18",
    duration: "3h 15m",
    details: [
      "Non-stop flight",
      "Includes carry-on bag",
      "In-flight entertainment",
      "Complimentary snacks"
    ]
  },
  {
    id: "flight-3",
    type: "Flight",
    title: "Weekend in Las Vegas",
    location: "Las Vegas, NV",
    price: 199,
    description: "Spend an exciting weekend in Las Vegas with this round-trip flight. Try your luck at the casinos, enjoy world-class entertainment, and experience the vibrant nightlife.",
    date: "Jun 24 - Jun 26",
    duration: "1h 55m each way",
    details: [
      "Non-stop flight",
      "Includes carry-on bag",
      "Free seat selection",
      "Complimentary drinks"
    ]
  },
];

const mockHotels: Adventure[] = [
  {
    id: "hotel-1",
    type: "Hotel",
    title: "Luxury Downtown Suite",
    location: "Chicago, IL",
    price: 189,
    description: "Stay in the heart of downtown Chicago in this luxurious suite. Enjoy stunning city views, premium amenities, and easy access to major attractions.",
    date: "Jun 15 - Jun 18",
    duration: "3 nights",
    details: [
      "King-size bed",
      "City view",
      "Free Wi-Fi",
      "Fitness center access",
      "Complimentary breakfast"
    ]
  },
  {
    id: "hotel-2",
    type: "Hotel",
    title: "Beachfront Resort",
    location: "San Diego, CA",
    price: 249,
    description: "Relax at this beautiful beachfront resort in San Diego. Fall asleep to the sound of waves and wake up to stunning ocean views.",
    date: "Jun 20 - Jun 23",
    duration: "3 nights",
    details: [
      "Ocean view room",
      "Private balcony",
      "Pool access",
      "Spa services available",
      "Beachside dining"
    ]
  },
  {
    id: "hotel-3",
    type: "Hotel",
    title: "Historic Boutique Hotel",
    location: "Boston, MA",
    price: 179,
    description: "Experience the charm of Boston in this historic boutique hotel. Located in the heart of the city, this hotel offers a unique blend of history and modern comfort.",
    date: "Jun 25 - Jun 28",
    duration: "3 nights",
    details: [
      "Queen-size bed",
      "Historic building",
      "Walking distance to attractions",
      "Complimentary wine hour",
      "Artisanal breakfast included"
    ]
  },
];

const mockRestaurants: Adventure[] = [
  {
    id: "restaurant-1",
    type: "Restaurant",
    title: "Fine Dining Experience",
    location: "New York, NY",
    price: 120,
    description: "Indulge in a luxurious fine dining experience at one of New York's top-rated restaurants. Enjoy a multi-course tasting menu prepared by award-winning chefs.",
    details: [
      "5-course tasting menu",
      "Wine pairing available",
      "Vegetarian options",
      "Elegant atmosphere",
      "Reservation includes welcome champagne"
    ]
  },
  {
    id: "restaurant-2",
    type: "Restaurant",
    title: "Authentic Italian Dinner",
    location: "San Francisco, CA",
    price: 85,
    description: "Savor the flavors of Italy at this authentic Italian restaurant in San Francisco. Known for their handmade pasta and imported ingredients.",
    details: [
      "3-course dinner",
      "Handmade pasta",
      "Imported Italian wines",
      "Family-style option available",
      "Includes dessert"
    ]
  },
  {
    id: "restaurant-3",
    type: "Restaurant",
    title: "Southern Comfort Food",
    location: "Nashville, TN",
    price: 65,
    description: "Experience true Southern hospitality and comfort food in the heart of Nashville. This restaurant serves up classic Southern dishes with a modern twist.",
    details: [
      "Family-style dinner",
      "Live music on weekends",
      "Signature cocktails",
      "Famous fried chicken",
      "Homemade desserts"
    ]
  },
];

const mockActivities: Adventure[] = [
  {
    id: "activity-1",
    type: "Activity",
    title: "Grand Canyon Helicopter Tour",
    location: "Las Vegas, NV",
    price: 299,
    description: "See the majestic Grand Canyon from above with this breathtaking helicopter tour. Includes transportation from Las Vegas and a champagne picnic.",
    duration: "4 hours",
    details: [
      "Aerial views of Grand Canyon",
      "Hotel pickup and drop-off",
      "Champagne picnic included",
      "Professional pilot/guide",
      "Photo opportunities"
    ]
  },
  {
    id: "activity-2",
    type: "Activity",
    title: "Napa Valley Wine Tour",
    location: "San Francisco, CA",
    price: 149,
    description: "Explore the beautiful Napa Valley wine country with this guided tour. Visit premium wineries, enjoy tastings, and learn about wine production.",
    duration: "8 hours",
    details: [
      "Visit to 3 premium wineries",
      "Wine tasting included",
      "Gourmet lunch",
      "Transportation from San Francisco",
      "Expert wine guide"
    ]
  },
  {
    id: "activity-3",
    type: "Activity",
    title: "Broadway Show Experience",
    location: "New York, NY",
    price: 179,
    description: "Enjoy a world-class Broadway show in the heart of New York City. This package includes premium seating and a pre-show dinner at a nearby restaurant.",
    duration: "5 hours",
    details: [
      "Premium seating",
      "Pre-show dinner included",
      "Behind-the-scenes tour option",
      "Souvenir program",
      "Flexible date options"
    ]
  },
];

// All adventures combined
const allAdventures = [
  ...mockFlights,
  ...mockHotels,
  ...mockRestaurants,
  ...mockActivities,
];

// Mock API functions
export const getAdventures = (
  budget: number,
  type: string,
  location: string
): Promise<Adventure[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      let filteredAdventures = allAdventures;
      
      // Filter by type
      if (type) {
        filteredAdventures = filteredAdventures.filter(
          (adventure) => adventure.type === type
        );
      }
      
      // Filter by location
      if (location) {
        filteredAdventures = filteredAdventures.filter(
          (adventure) => adventure.location === location
        );
      }
      
      // Filter by budget
      if (budget > 0) {
        filteredAdventures = filteredAdventures.filter(
          (adventure) => adventure.price <= budget
        );
      }
      
      resolve(filteredAdventures);
    }, 1500); // Simulate network delay
  });
};

export const mockAdventures = allAdventures;
