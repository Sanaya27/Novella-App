const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Member = require('../models/Member');
const Match = require('../models/Match');
const Message = require('../models/Message');
const config = require('../config/database');

// Sample data for seeding
const sampleMembers = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    age: 25,
    bio: 'Love hiking, reading, and discovering new coffee shops. Looking for genuine connections.',
    interests: ['hiking', 'reading', 'coffee', 'photography', 'travel'],
    location: {
      type: 'Point',
      coordinates: [-122.4194, 37.7749] // San Francisco
    },
    preferences: {
      ageRange: { min: 22, max: 35 },
      maxDistance: 25,
      interestedIn: 'men'
    }
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password123',
    age: 28,
    bio: 'Software developer by day, chef by night. Always up for an adventure!',
    interests: ['cooking', 'technology', 'hiking', 'music', 'gaming'],
    location: {
      type: 'Point',
      coordinates: [-122.4094, 37.7849] // San Francisco
    },
    preferences: {
      ageRange: { min: 20, max: 32 },
      maxDistance: 30,
      interestedIn: 'women'
    }
  },
  {
    name: 'Carol Davis',
    email: 'carol@example.com',
    password: 'password123',
    age: 26,
    bio: 'Artist and yoga instructor. Spreading positive vibes wherever I go.',
    interests: ['yoga', 'art', 'meditation', 'nature', 'photography'],
    location: {
      type: 'Point',
      coordinates: [-122.4094, 37.7749] // San Francisco
    },
    preferences: {
      ageRange: { min: 24, max: 35 },
      maxDistance: 20,
      interestedIn: 'both'
    }
  },
  {
    name: 'David Wilson',
    email: 'david@example.com',
    password: 'password123',
    age: 30,
    bio: 'Entrepreneur and fitness enthusiast. Love trying new restaurants and exploring the city.',
    interests: ['fitness', 'business', 'food', 'travel', 'music'],
    location: {
      type: 'Point',
      coordinates: [-122.4194, 37.7649] // San Francisco
    },
    preferences: {
      ageRange: { min: 23, max: 33 },
      maxDistance: 35,
      interestedIn: 'women'
    }
  }
];

const sampleMatches = [
  {
    // Alice and Bob
    sync_level: 65,
    butterfly_type: 'morpho',
    conversation_depth: 4,
    compatibility_score: 78,
    shared_interests: ['hiking'],
    heart_sync_sessions: 2,
    heart_sync_history: [
      {
        sync_percentage: 72,
        duration_minutes: 1,
        butterfly_generated: false
      },
      {
        sync_percentage: 83,
        duration_minutes: 1,
        butterfly_generated: true
      }
    ],
    conversation_milestones: [
      {
        milestone: 'first_message',
        butterfly_reward: 'monarch'
      },
      {
        milestone: 'first_heart_sync',
        butterfly_reward: 'swallowtail'
      }
    ]
  },
  {
    // Carol and David
    sync_level: 45,
    butterfly_type: 'swallowtail',
    conversation_depth: 2,
    compatibility_score: 62,
    shared_interests: ['music'],
    heart_sync_sessions: 1,
    heart_sync_history: [
      {
        sync_percentage: 58,
        duration_minutes: 1,
        butterfly_generated: false
      }
    ],
    conversation_milestones: [
      {
        milestone: 'first_message',
        butterfly_reward: 'monarch'
      }
    ]
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Member.deleteMany({});
    await Match.deleteMany({});
    await Message.deleteMany({});

    // Create members
    console.log('Creating sample members...');
    const createdMembers = [];
    
    for (const memberData of sampleMembers) {
      const member = new Member(memberData);
      await member.save();
      createdMembers.push(member);
      console.log(`Created member: ${member.name}`);
    }

    // Create matches
    console.log('Creating sample matches...');
    const matchPairs = [
      [0, 1], // Alice and Bob
      [2, 3]  // Carol and David
    ];

    for (let i = 0; i < matchPairs.length; i++) {
      const [user1Index, user2Index] = matchPairs[i];
      const matchData = {
        ...sampleMatches[i],
        user1_id: createdMembers[user1Index]._id,
        user2_id: createdMembers[user2Index]._id,
        mutual_likes: {
          user1_liked: true,
          user2_liked: true,
          matched_at: new Date()
        }
      };

      const match = new Match(matchData);
      await match.save();
      console.log(`Created match between ${createdMembers[user1Index].name} and ${createdMembers[user2Index].name}`);

      // Add butterflies to members' collections
      await createdMembers[user1Index].addButterfly(match.butterfly_type, match._id);
      await createdMembers[user2Index].addButterfly(match.butterfly_type, match._id);

      // Create some sample messages
      const sampleMessages = [
        {
          match_id: match._id,
          sender_id: createdMembers[user1Index]._id,
          content: 'Hey! Nice to match with you 😊',
          message_type: 'text'
        },
        {
          match_id: match._id,
          sender_id: createdMembers[user2Index]._id,
          content: 'Hi there! I love your profile, we have so much in common!',
          message_type: 'text'
        },
        {
          match_id: match._id,
          sender_id: createdMembers[user1Index]._id,
          content: 'Would you like to try a heart sync session? I heard they create beautiful butterflies! 🦋',
          message_type: 'text'
        }
      ];

      for (const messageData of sampleMessages) {
        const message = new Message(messageData);
        await message.save();
      }

      console.log(`Created sample messages for match`);
    }

    // Add some heart rate history
    console.log('Adding heart rate history...');
    for (const member of createdMembers) {
      const heartRateEntries = [];
      for (let i = 0; i < 10; i++) {
        heartRateEntries.push({
          rate: 60 + Math.floor(Math.random() * 40), // 60-100 BPM
          mood: ['golden_pollen', 'blue_mist', 'silver_whisper', 'rose_ember'][Math.floor(Math.random() * 4)],
          timestamp: new Date(Date.now() - (i * 60 * 60 * 1000)) // Every hour back
        });
      }
      member.heart_rate_history = heartRateEntries;
      await member.save();
    }

    console.log('Database seeded successfully!');
    console.log(`Created ${createdMembers.length} members`);
    console.log(`Created ${matchPairs.length} matches`);
    console.log(`Created ${matchPairs.length * 3} messages`);

    console.log('\\nSample login credentials:');
    sampleMembers.forEach(member => {
      console.log(`Email: ${member.email}, Password: ${member.password}`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;