import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://globetrotter-backend-sdio.onrender.com';


const USE_MOCK = false; 

export interface Invitation {
  id: string;
  inviterId: string;
  inviterName: string;
  score: number;
  createdAt: Date;
}

// Persist mock data in localStorage to survive page refreshes
const getMockStorage = (): Map<string, Invitation> => {
  try {
    const stored = localStorage.getItem('mockInvitations');
    if (stored) {
      // Convert the stored JSON back to Map entries
      const parsed = JSON.parse(stored);
      return new Map(parsed);
    }
  } catch (e) {
    console.error('Error retrieving mock invitations:', e);
  }
  return new Map<string, Invitation>();
};

const saveMockStorage = (invitations: Map<string, Invitation>) => {
  try {
    // Convert Map to array of entries for JSON serialization
    const entries = Array.from(invitations.entries());
    localStorage.setItem('mockInvitations', JSON.stringify(entries));
  } catch (e) {
    console.error('Error saving mock invitations:', e);
  }
};

// Initialize with stored data
const mockInvitations = getMockStorage();

export const createInvitation = async (
  inviterId: string,
  inviterName: string,
  score: number
): Promise<{ id: string; invitationLink: string }> => {
  if (USE_MOCK) {
    // Mock implementation with persistence
    console.log('Using mock invitation service for creation');
    
    // Generate a more readable ID
    const id = `inv_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    
    const invitation: Invitation = {
      id,
      inviterId,
      inviterName,
      score,
      createdAt: new Date()
    };
    
    // Save to our mock storage
    mockInvitations.set(id, invitation);
    saveMockStorage(mockInvitations);
    
    // Create a link that will work with the current frontend
    const baseUrl = window.location.origin;
    const invitationLink = `${baseUrl}/invite/${id}`;
    
    console.log(`Created mock invitation with ID: ${id} for ${inviterName} with score ${score}`);
    
    return { id, invitationLink };
  }
  
  try {
    // Real API implementation
    const response = await axios.post(`${API_URL}/invitations`, {
      inviterId,
      inviterName,
      score,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating invitation:', error);
    
    // Fall back to mock if real API fails
    console.log('Falling back to mock service due to API error');
    return createInvitation(inviterId, inviterName, score);
  }
};

export const getInvitation = async (id: string): Promise<Invitation> => {
  if (USE_MOCK) {
    console.log('Using mock invitation service for retrieval');
    
    // Check our mock storage for the invitation
    const invitation = mockInvitations.get(id);
    console.log('Retrieved invitation:', invitation);
    
    if (invitation) {
      return { ...invitation };
    }
    
    // If invitation doesn't exist in our mock data, create a consistent fake one
    // Use a deterministic approach based on the ID to always return the same data
    const idHash = id.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    // Generate consistent data based on the ID hash
    const names = ['Alex', 'Jordan', 'Taylor', 'Sam', 'Riley', 'Casey', 'Morgan'];
    const nameIndex = idHash % names.length;
    const score = 10 + (idHash % 90); // Scores between 10-99
    
    const fakeInvitation: Invitation = {
      id,
      inviterId: `mock-${id}`,
      inviterName: names[nameIndex],
      score: score,
      createdAt: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
    };
    
    // Save this fake invitation for consistency across refreshes
    mockInvitations.set(id, fakeInvitation);
    saveMockStorage(mockInvitations);
    
    console.log(`Created consistent fake invitation for ID: ${id}`);
    
    return fakeInvitation;
  }
  
  try {
    // Real API implementation
    const response = await axios.get(`${API_URL}/invitations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving invitation:', error);
    
    if (USE_MOCK) {
      // Fall back to mock if real API fails
      console.log('Falling back to mock service due to API error');
      return getInvitation(id);
    }
    throw error;
  }
};

// Helper to list all mock invitations (for debugging)
export const listMockInvitations = (): Invitation[] => {
  if (!USE_MOCK) return [];
  return Array.from(mockInvitations.values());
};

// Helper to clear mock invitations (for testing)
export const clearMockInvitations = (): void => {
  if (!USE_MOCK) return;
  mockInvitations.clear();
  saveMockStorage(mockInvitations);
};
