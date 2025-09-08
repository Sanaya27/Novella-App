// src/entities/all.js
export const User = {
  me: async () => {
    // Mock user data - replace with actual API call
    return {
      id: 1,
      name: "Your Name",
      age: 25,
      bio: "Living my best life",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      heartRate: 72,
      location: { lat: 37.7749, lng: -122.4194 }
    };
  }
};

export const ChatMessage = {
  // Chat message entity methods
};

export const Match = {
  // Match entity methods  
};

export const Member = {
  // Member entity methods
};

export const Message = {
  // Message entity methods
};