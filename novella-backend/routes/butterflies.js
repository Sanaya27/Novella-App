const express = require('express');
const Match = require('../models/Match');
const Member = require('../models/Member');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Generate butterfly for a match
router.post('/generate/:matchId', authMiddleware, async (req, res) => {
  try {
    const { matchId } = req.params;
    const { trigger_type = 'manual', context } = req.body;

    // Verify user has access to this match
    const match = await Match.findOne({
      _id: matchId,
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ],
      status: 'active'
    }).populate('user1_id user2_id', 'name butterflies_collected');

    if (!match) {
      return res.status(404).json({ error: 'Match not found or inactive' });
    }

    // Calculate butterfly generation probability
    let probability = calculateButterflyProbability(match, trigger_type, context);

    // Check if butterfly should be generated
    const shouldGenerate = Math.random() < probability;

    if (!shouldGenerate) {
      return res.json({
        butterfly_generated: false,
        probability: Math.round(probability * 100),
        message: 'No butterfly this time, but keep building your connection!'
      });
    }

    // Determine butterfly type based on match quality
    const butterflyType = determineButterflyType(match, trigger_type);

    // Add butterfly to both users' collections
    const user1 = await Member.findById(match.user1_id._id);
    const user2 = await Member.findById(match.user2_id._id);

    await Promise.all([
      user1.addButterfly(butterflyType, match._id),
      user2.addButterfly(butterflyType, match._id)
    ]);

    // Update match butterfly type if it's better
    const butterflyRarity = getButterflyRarity(butterflyType);
    const currentRarity = getButterflyRarity(match.butterfly_type);

    if (butterflyRarity > currentRarity) {
      match.butterfly_type = butterflyType;
      await match.save();
    }

    res.json({
      butterfly_generated: true,
      butterfly_type: butterflyType,
      rarity: getButterflyRarityName(butterflyType),
      probability: Math.round(probability * 100),
      trigger_type: trigger_type,
      collection_update: {
        user1_collection_rate: user1.collection_rate,
        user2_collection_rate: user2.collection_rate
      }
    });
  } catch (error) {
    console.error('Generate butterfly error:', error);
    res.status(500).json({ error: 'Failed to generate butterfly' });
  }
});

// Get butterfly collection for a user
router.get('/collection/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;

    // If viewing another user's collection, verify they have a match
    if (userId !== req.user.id) {
      const hasMatch = await Match.findOne({
        $or: [
          { user1_id: req.user.id, user2_id: userId },
          { user1_id: userId, user2_id: req.user.id }
        ],
        status: 'active'
      });

      if (!hasMatch) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const member = await Member.findById(userId)
      .select('name avatar_url butterflies_collected collection_rate')
      .populate('butterflies_collected.source_match', 'user1_id user2_id butterfly_type');

    if (!member) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Group butterflies by type
    const collection = {
      monarch: [],
      swallowtail: [],
      morpho: [],
      glasswing: [],
      rare_phoenix: []
    };

    member.butterflies_collected.forEach(butterfly => {
      collection[butterfly.type].push({
        collected_at: butterfly.collected_at,
        source_match: butterfly.source_match,
        rarity: getButterflyRarityName(butterfly.type)
      });
    });

    // Calculate collection statistics
    const stats = {
      total_butterflies: member.butterflies_collected.length,
      collection_rate: member.collection_rate,
      types_collected: Object.keys(collection).filter(type => collection[type].length > 0).length,
      rarest_butterfly: getRarestButterfly(member.butterflies_collected),
      recent_butterflies: member.butterflies_collected
        .sort((a, b) => b.collected_at - a.collected_at)
        .slice(0, 5)
    };

    res.json({
      user: {
        name: member.name,
        avatar_url: member.avatar_url,
        collection_rate: member.collection_rate
      },
      collection: collection,
      statistics: stats
    });
  } catch (error) {
    console.error('Get butterfly collection error:', error);
    res.status(500).json({ error: 'Failed to fetch butterfly collection' });
  }
});

// Get current user's butterfly collection
router.get('/collection', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const member = await Member.findById(userId)
      .select('name avatar_url butterflies_collected collection_rate')
      .populate('butterflies_collected.source_match', 'user1_id user2_id butterfly_type');

    if (!member) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Group butterflies by type
    const collection = {
      monarch: [],
      swallowtail: [],
      morpho: [],
      glasswing: [],
      rare_phoenix: []
    };

    member.butterflies_collected.forEach(butterfly => {
      collection[butterfly.type].push({
        collected_at: butterfly.collected_at,
        source_match: butterfly.source_match,
        rarity: getButterflyRarityName(butterfly.type)
      });
    });

    // Calculate collection statistics
    const stats = {
      total_butterflies: member.butterflies_collected.length,
      collection_rate: member.collection_rate,
      types_collected: Object.keys(collection).filter(type => collection[type].length > 0).length,
      rarest_butterfly: getRarestButterfly(member.butterflies_collected),
      recent_butterflies: member.butterflies_collected
        .sort((a, b) => b.collected_at - a.collected_at)
        .slice(0, 5)
    };

    res.json({
      user: {
        name: member.name,
        avatar_url: member.avatar_url,
        collection_rate: member.collection_rate
      },
      collection: collection,
      statistics: stats
    });
  } catch (error) {
    console.error('Get butterfly collection error:', error);
    res.status(500).json({ error: 'Failed to fetch butterfly collection' });
  }
});

// Get butterfly leaderboard
router.get('/leaderboard', authMiddleware, async (req, res) => {
  try {
    const { limit = 10, type = 'collection_rate' } = req.query;

    let sortField = 'collection_rate';
    if (type === 'total_butterflies') {
      sortField = 'butterflies_collected';
    }

    const leaderboard = await Member.aggregate([
      {
        $project: {
          name: 1,
          avatar_url: 1,
          collection_rate: 1,
          total_butterflies: { $size: '$butterflies_collected' },
          rare_butterflies: {
            $size: {
              $filter: {
                input: '$butterflies_collected',
                cond: { $in: ['$$this.type', ['glasswing', 'rare_phoenix']] }
              }
            }
          }
        }
      },
      { $sort: { [sortField]: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      leaderboard: leaderboard,
      type: type,
      user_rank: await getUserRank(req.user.id, type)
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get butterfly generation tips
router.get('/tips', authMiddleware, async (req, res) => {
  try {
    const user = await Member.findById(req.user.id)
      .select('butterflies_collected collection_rate');

    const tips = generateButterflyTips(user);

    res.json({
      tips: tips,
      user_collection_rate: user.collection_rate,
      next_milestone: getNextCollectionMilestone(user.collection_rate)
    });
  } catch (error) {
    console.error('Get butterfly tips error:', error);
    res.status(500).json({ error: 'Failed to fetch butterfly tips' });
  }
});

// Analyze voice mood (placeholder for AI integration)
router.post('/voice-mood/analyze', authMiddleware, async (req, res) => {
  try {
    const { audio_url, duration } = req.body;

    if (!audio_url) {
      return res.status(400).json({ error: 'Audio URL is required' });
    }

    // This would integrate with voice analysis AI in a real implementation
    const moodAnalysis = analyzeVoiceMood(audio_url, duration);

    res.json({
      mood: moodAnalysis.mood,
      confidence: moodAnalysis.confidence,
      emotions: moodAnalysis.emotions,
      recommendations: moodAnalysis.recommendations,
      butterfly_potential: moodAnalysis.butterfly_potential
    });
  } catch (error) {
    console.error('Voice mood analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze voice mood' });
  }
});

// Helper function to calculate butterfly generation probability
function calculateButterflyProbability(match, triggerType, context) {
  let baseProbability = 0.1; // 10% base chance

  // Adjust based on trigger type
  switch (triggerType) {
    case 'heart_sync':
      baseProbability = 0.6; // 60% for heart sync
      if (context && context.sync_percentage > 80) {
        baseProbability = 0.9; // 90% for high sync
      }
      break;
    case 'voice_mood':
      baseProbability = 0.3; // 30% for voice messages
      if (context && context.positive_emotion > 0.8) {
        baseProbability = 0.5; // 50% for very positive voice
      }
      break;
    case 'deep_conversation':
      baseProbability = 0.4; // 40% for deep conversations
      break;
    case 'milestone':
      baseProbability = 0.8; // 80% for milestones
      break;
    case 'flutter_tap':
      baseProbability = 0.2; // 20% for flutter taps
      break;
    default:
      baseProbability = 0.1; // 10% for manual/other
  }

  // Adjust based on match quality
  const compatibilityBonus = (match.compatibility_score / 100) * 0.2;
  const syncBonus = (match.sync_level / 100) * 0.15;
  const depthBonus = (match.conversation_depth / 10) * 0.1;

  // Reduce if too many recent butterflies
  const recentButterflies = match.heart_sync_history
    .filter(session => session.butterfly_generated && 
            new Date() - session.session_date < 24 * 60 * 60 * 1000)
    .length;
  const recentPenalty = recentButterflies * 0.1;

  const finalProbability = Math.max(0.05, 
    baseProbability + compatibilityBonus + syncBonus + depthBonus - recentPenalty
  );

  return Math.min(0.95, finalProbability); // Cap at 95%
}

// Helper function to determine butterfly type
function determineButterflyType(match, triggerType) {
  const score = match.compatibility_score + 
                (match.conversation_depth * 5) + 
                (match.sync_level * 0.5) +
                (match.heart_sync_sessions * 2);

  // Special conditions for rare butterflies
  if (triggerType === 'milestone' && match.conversation_depth >= 8) {
    return 'rare_phoenix';
  }

  if (triggerType === 'heart_sync' && match.sync_level > 90) {
    return 'rare_phoenix';
  }

  // Regular distribution based on score
  if (score >= 150) return 'rare_phoenix';
  if (score >= 100) return 'glasswing';
  if (score >= 70) return 'morpho';
  if (score >= 40) return 'swallowtail';
  return 'monarch';
}

// Helper function to get butterfly rarity value
function getButterflyRarity(butterflyType) {
  const rarities = {
    monarch: 1,
    swallowtail: 2,
    morpho: 3,
    glasswing: 4,
    rare_phoenix: 5
  };
  return rarities[butterflyType] || 1;
}

// Helper function to get butterfly rarity name
function getButterflyRarityName(butterflyType) {
  const names = {
    monarch: 'Common',
    swallowtail: 'Uncommon',
    morpho: 'Rare',
    glasswing: 'Epic',
    rare_phoenix: 'Legendary'
  };
  return names[butterflyType] || 'Common';
}

// Helper function to get rarest butterfly
function getRarestButterfly(butterflies) {
  if (butterflies.length === 0) return null;

  return butterflies.reduce((rarest, current) => {
    const currentRarity = getButterflyRarity(current.type);
    const rarestRarity = getButterflyRarity(rarest.type);
    return currentRarity > rarestRarity ? current : rarest;
  });
}

// Helper function to get user rank
async function getUserRank(userId, type) {
  try {
    const sortField = type === 'total_butterflies' ? 'butterflies_collected' : 'collection_rate';
    
    const user = await Member.findById(userId).select('collection_rate butterflies_collected');
    if (!user) return null;

    const userValue = type === 'total_butterflies' ? 
      user.butterflies_collected.length : user.collection_rate;

    const higherRanks = await Member.countDocuments({
      [type === 'total_butterflies' ? 'butterflies_collected.10' : 'collection_rate']: 
        { [type === 'total_butterflies' ? '$exists' : '$gt']: 
          type === 'total_butterflies' ? true : userValue }
    });

    return higherRanks + 1;
  } catch (error) {
    return null;
  }
}

// Helper function to generate butterfly tips
function generateButterflyTips(user) {
  const tips = [];
  const collectionRate = user.collection_rate;

  if (collectionRate < 20) {
    tips.push("Start with heart sync sessions to increase your butterfly chances!");
    tips.push("Voice mood messages have a higher butterfly generation rate.");
    tips.push("Deep conversations unlock rare butterfly species.");
  } else if (collectionRate < 50) {
    tips.push("Try achieving conversation milestones for guaranteed butterflies.");
    tips.push("High heart sync percentages (80%+) dramatically increase rare butterfly chances.");
    tips.push("Flutter taps between messages can spontaneously generate butterflies.");
  } else if (collectionRate < 80) {
    tips.push("Focus on building deeper connections for legendary butterflies.");
    tips.push("Multiple heart sync sessions with the same partner increase sync levels.");
    tips.push("Consistent positive interactions boost overall butterfly probability.");
  } else {
    tips.push("You're a butterfly master! Help others by being an engaging conversationalist.");
    tips.push("Rare phoenixes appear when you achieve perfect emotional synchronization.");
    tips.push("Your high collection rate attracts butterflies to your conversations.");
  }

  return tips;
}

// Helper function to get next collection milestone
function getNextCollectionMilestone(currentRate) {
  const milestones = [20, 40, 60, 80, 100];
  const nextMilestone = milestones.find(milestone => milestone > currentRate);
  
  if (!nextMilestone) {
    return { rate: 100, message: "You've achieved maximum collection rate!" };
  }

  const rewards = {
    20: "Unlock Swallowtail butterflies",
    40: "Unlock Morpho butterflies", 
    60: "Unlock Glasswing butterflies",
    80: "Unlock Rare Phoenix butterflies",
    100: "Become a Butterfly Master"
  };

  return {
    rate: nextMilestone,
    progress: Math.round(((currentRate / nextMilestone) * 100)),
    reward: rewards[nextMilestone]
  };
}

// Mock voice mood analysis (would integrate with AI in production)
function analyzeVoiceMood(audioUrl, duration) {
  const moods = ['golden_pollen', 'blue_mist', 'silver_whisper', 'rose_ember'];
  const selectedMood = moods[Math.floor(Math.random() * moods.length)];
  
  const moodDescriptions = {
    golden_pollen: { emotion: 'Joy', butterfly_potential: 0.4 },
    blue_mist: { emotion: 'Calm', butterfly_potential: 0.3 },
    silver_whisper: { emotion: 'Mysterious', butterfly_potential: 0.35 },
    rose_ember: { emotion: 'Passionate', butterfly_potential: 0.45 }
  };

  const analysis = moodDescriptions[selectedMood];
  
  return {
    mood: selectedMood,
    confidence: 0.75 + Math.random() * 0.2, // 75-95% confidence
    emotions: [
      { emotion: analysis.emotion, intensity: 0.6 + Math.random() * 0.4 }
    ],
    recommendations: [
      "Your voice carries positive energy that attracts butterflies!",
      "Continue expressing yourself authentically for better connections."
    ],
    butterfly_potential: analysis.butterfly_potential
  };
}

module.exports = router;