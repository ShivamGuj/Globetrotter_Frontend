import { Game } from "../types/game";
import { User } from "../types/user";
import { AuthResponse } from "../types/auth";
import { Invite } from "../types/invite";
import { CityData } from "../api/cityApi";

// Mock games data
export const mockGames: Game[] = [
  {
    id: "1",
    title: "The Legend of Zelda: Breath of the Wild",
    thumbnail: "https://via.placeholder.com/300x200?text=Zelda+BOTW",
    description: "An open-world action-adventure game developed by Nintendo.",
    genre: "Action-Adventure",
    platform: ["Nintendo Switch", "Wii U"], // Array format
    publisher: "Nintendo",
    releaseDate: "2017-03-03",
  },
  {
    id: "2",
    title: "Red Dead Redemption 2",
    thumbnail: "https://via.placeholder.com/300x200?text=RDR2",
    description: "A western-themed action-adventure game developed by Rockstar Games.",
    genre: "Action-Adventure",
    platform: "PlayStation 4, Xbox One, PC", // String format
    publisher: "Rockstar Games",
    releaseDate: "2018-10-26",
  },
  {
    id: "3",
    title: "Elden Ring",
    thumbnail: "https://via.placeholder.com/300x200?text=Elden+Ring",
    description: "An action RPG developed by FromSoftware and published by Bandai Namco Entertainment.",
    genre: "Action RPG",
    platform: "PlayStation, Xbox, PC",
    publisher: "Bandai Namco",
    releaseDate: "2022-02-25",
  },
  {
    id: "4",
    title: "Minecraft",
    thumbnail: "https://via.placeholder.com/300x200?text=Minecraft",
    description: "A sandbox game focused on building and exploration.",
    genre: "Sandbox",
    platform: "Multiple platforms",
    publisher: "Mojang Studios",
    releaseDate: "2011-11-18",
  },
  {
    id: "5",
    title: "Cyberpunk 2077",
    thumbnail: "https://via.placeholder.com/300x200?text=Cyberpunk+2077",
    description: "An open-world action RPG set in a futuristic dystopian city.",
    genre: "Action RPG",
    platform: "PlayStation, Xbox, PC",
    publisher: "CD Projekt",
    releaseDate: "2020-12-10",
  }
];

// Mock user data
export const mockUsers: User[] = [
  {
    id: "1",
    username: "gamer123",
    email: "gamer123@example.com",
    profilePicture: "https://via.placeholder.com/100?text=User1",
    createdAt: "2023-01-15T12:00:00Z"
  },
  {
    id: "2",
    username: "rpgfan",
    email: "rpgfan@example.com",
    profilePicture: "https://via.placeholder.com/100?text=User2",
    createdAt: "2023-02-20T14:30:00Z"
  }
];

// Mock auth response
export const mockAuthResponse: AuthResponse = {
  user: {
    id: "1",
    username: "gamer123",
    email: "gamer123@example.com",
    createdAt: "2023-01-15T12:00:00Z"
  },
  token: "mock-jwt-token-for-development"
};

// Mock invites
export const mockInvites: Invite[] = [
  {
    id: "1",
    sender: mockUsers[0],
    recipient: mockUsers[1],
    status: "pending",
    createdAt: "2023-05-10T09:15:00Z"
  }
];

// Mock city data
const mockCities: CityData[] = [
  {
    id: "1",
    city: "Paris",
    country: "France",
    clues: [
      "This city is known as the 'City of Light'",
      "It has a famous iron tower that was built for a World's Fair",
      "It's divided by a river with many beautiful bridges"
    ],
    fun_fact: [
      "This city has over 470 parks and gardens",
      "There is only one stop sign in the entire city",
      "The Eiffel Tower was originally meant to be a temporary structure"
    ],
    secondChanceClue: "This city is the capital of a country known for wine, cheese, and baguettes"
  },
  {
    id: "2",
    city: "Tokyo",
    country: "Japan",
    clues: [
      "This city has the world's busiest pedestrian crossing",
      "It's the most populous metropolitan area in the world",
      "It hosts the largest fish market in the world"
    ],
    fun_fact: [
      "This city has over 300 earthquake-resistant skyscrapers",
      "You can find over 12,000 vending machines throughout the city",
      "The subway system handles over 8 million passengers daily"
    ],
    secondChanceClue: "This city's name translates to 'Eastern Capital'"
  },
  {
    id: "3",
    city: "New York City",
    country: "USA",
    clues: [
      "This city has a famous statue that was a gift from France",
      "It's known as the 'Big Apple'",
      "It has a famous park in the middle of the city"
    ],
    fun_fact: [
      "More than 800 languages are spoken in this city",
      "The subway system has over 472 stations",
      "The first pizzeria in the United States opened here in 1905"
    ],
    secondChanceClue: "This city has five distinct boroughs"
  },
  {
    id: "4",
    city: "London",
    country: "UK",
    clues: [
      "This city has a famous clock tower often mistakenly called by the name of its bell",
      "It has a royal residence that's still in use today",
      "It hosted the Olympic Games three times"
    ],
    fun_fact: [
      "This city has six major airports",
      "The Underground system is the oldest in the world",
      "Black cabs must be able to turn around in a 25-foot radius"
    ],
    secondChanceClue: "This city sits on the River Thames"
  },
  {
    id: "5",
    city: "Rome",
    country: "Italy",
    clues: [
      "This city was founded by twins raised by a wolf according to legend",
      "It has a famous ancient amphitheater",
      "It contains an independent city-state within its borders"
    ],
    fun_fact: [
      "This city has more than 2,000 fountains",
      "It's traditional to throw coins with your right hand over your left shoulder into the Trevi Fountain",
      "The city contains the highest concentration of ancient columns in the world"
    ],
    secondChanceClue: "This city is known as the 'Eternal City'"
  }
];

// Helper function to get a random item from an array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Mock service functions
export const mockServices = {
  // City related mock services
  getGeneratedCities: (count = 20): CityData[] => {
    // Return a subset or repeat items as needed to match count
    const result: CityData[] = [];
    for (let i = 0; i < count; i++) {
      result.push(mockCities[i % mockCities.length]);
    }
    return result;
  },
  
  // Game related mock services
  getRandomGame: (): Game => getRandomItem(mockGames),
  
  getFeaturedGames: (): Game[] => mockGames.slice(0, 3),
  
  getGameById: (id: string): Game | null => {
    return mockGames.find(game => game.id === id) || null;
  },
  
  login: (): AuthResponse => mockAuthResponse,
  
  signup: (): AuthResponse => mockAuthResponse,
  
  getUserProfile: (id: string): User | null => {
    return mockUsers.find(user => user.id === id) || null;
  },
  
  createInvite: (): Invite => mockInvites[0]
};
