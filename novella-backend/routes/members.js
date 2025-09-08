const express = require('express');
const Member = require('../models/Member');
const Match = require('../models/Match');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get member profile by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .select('-email -heart_rate_history'); // Hide sensitive data

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    console.error('Member fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
});

// Get potential matches
router.get('/discover/potential', authMiddleware, async (req, res) => {
  try {
    const currentUser = await Member.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Get existing matches to exclude
    const existingMatches = await Match.find({
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ]
    }).distinct('user1_id user2_id');

    const excludedIds = [
      req.user.id,
      ...existingMatches.filter(id => !id.equals(req.user.id))
    ];

    // Build query based on preferences
    const matchQuery = {
      _id: { $nin: excludedIds },
      status: 'online'
    };

    // Age filter
    if (currentUser.preferences.ageRange) {
      matchQuery.age = {
        $gte: currentUser.preferences.ageRange.min,
        $lte: currentUser.preferences.ageRange.max
      };
    }

    // Location filter (if location is set)
    if (currentUser.location && currentUser.location.coordinates[0] !== 0) {
      const maxDistance = currentUser.preferences.maxDistance || 50;
      matchQuery.location = {
        $near: {
          $geometry: currentUser.location,
          $maxDistance: maxDistance * 1000 // Convert km to meters
        }
      };
    }

    const potentialMatches = await Member.find(matchQuery)
      .select('-email -heart_rate_history')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ last_active: -1 });

    // Calculate compatibility scores
    const matchesWithScores = potentialMatches.map(member => {
      let compatibilityScore = 0;

      // Interest compatibility
      const commonInterests = currentUser.interests.filter(interest =>
        member.interests.includes(interest)
      );
      compatibilityScore += (commonInterests.length / Math.max(currentUser.interests.length, 1)) * 30;

      // Collection rate similarity
      const collectionDiff = Math.abs(currentUser.collection_rate - member.collection_rate);
      compatibilityScore += Math.max(0, 20 - collectionDiff / 5);

      // Activity level (based on last_active)
      const daysSinceActive = (new Date() - member.last_active) / (1000 * 60 * 60 * 24);
      if (daysSinceActive < 1) compatibilityScore += 20;
      else if (daysSinceActive < 7) compatibilityScore += 10;

      // Random factor for variety
      compatibilityScore += Math.random() * 30;

      return {
        ...member.toJSON(),
        compatibility_score: Math.min(100, Math.round(compatibilityScore)),
        common_interests: commonInterests,
        distance: currentUser.location ? calculateDistance(
          currentUser.location.coordinates,
          member.location.coordinates
        ) : null
      };
    });

    // Sort by compatibility score
    matchesWithScores.sort((a, b) => b.compatibility_score - a.compatibility_score);

    res.json({
      matches: matchesWithScores,
      page: parseInt(page),
      limit: parseInt(limit),
      total: await Member.countDocuments(matchQuery)
    });
  } catch (error) {
    console.error('Discover members error:', error);
    res.status(500).json({ error: 'Failed to discover members' });
  }
});

// Like a member
router.post('/like/:id', authMiddleware, async (req, res) => {
  try {
    const targetUserId = req.params.id;

    if (targetUserId === req.user.id) {
      return res.status(400).json({ error: 'Cannot like yourself' });
    }

    // Check if target user exists
    const targetUser = await Member.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if match already exists
    let match = await Match.findOne({
      $or: [
        { user1_id: req.user.id, user2_id: targetUserId },
        { user1_id: targetUserId, user2_id: req.user.id }
      ]
    });

    if (match) {
      // Update existing match
      if (match.user1_id.equals(req.user.id)) {
        match.mutual_likes.user1_liked = true;
      } else {
        match.mutual_likes.user2_liked = true;
      }
    } else {
      // Create new match
      match = new Match({
        user1_id: req.user.id,
        user2_id: targetUserId,
        mutual_likes: {
          user1_liked: true,
          user2_liked: false
        }
      });
    }

    // Check if it's a mutual like
    const isMutualMatch = match.mutual_likes.user1_liked && match.mutual_likes.user2_liked;
    if (isMutualMatch && !match.mutual_likes.matched_at) {
      match.mutual_likes.matched_at = new Date();
      match.status = 'active';
      
      // Add first milestone
      await match.addMilestone('first_message', 'monarch');
    }

    await match.save();

    res.json({
      message: 'Like sent successfully',
      match: isMutualMatch,
      match_id: match._id
    });
  } catch (error) {
    console.error('Like member error:', error);
    res.status(500).json({ error: 'Failed to like member' });
  }
});

// Get member's butterfly collection
router.get('/:id/butterflies', authMiddleware, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .select('butterflies_collected collection_rate')
      .populate('butterflies_collected.source_match', 'butterfly_type user1_id user2_id');

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Group butterflies by type
    const butterflyStats = {
      monarch: 0,
      swallowtail: 0,
      morpho: 0,
      glasswing: 0,
      rare_phoenix: 0
    };

    member.butterflies_collected.forEach(butterfly => {
      butterflyStats[butterfly.type]++;
    });

    res.json({
      collection_rate: member.collection_rate,
      butterflies: butterflyStats,
      recent_butterflies: member.butterflies_collected
        .sort((a, b) => b.collected_at - a.collected_at)
        .slice(0, 10),
      total_collected: member.butterflies_collected.length
    });
  } catch (error) {
    console.error('Butterfly collection error:', error);
    res.status(500).json({ error: 'Failed to fetch butterfly collection' });
  }
});

// Update member's heart rate
router.post('/heart-rate', authMiddleware, async (req, res) => {
  try {
    const { rate, mood } = req.body;

    if (!rate || rate < 40 || rate > 200) {
      return res.status(400).json({ error: 'Invalid heart rate' });
    }

    const member = await Member.findById(req.user.id);
    if (!member) {
      return res.status(404).json({ error: 'User not found' });
    }

    member.heart_rate_history.push({
      rate,
      mood: mood || 'golden_pollen'
    });

    // Keep only last 100 heart rate entries
    if (member.heart_rate_history.length > 100) {
      member.heart_rate_history = member.heart_rate_history.slice(-100);
    }

    await member.save();

    res.json({
      message: 'Heart rate recorded',
      current_rate: rate,
      mood: mood
    });
  } catch (error) {
    console.error('Heart rate update error:', error);
    res.status(500).json({ error: 'Failed to update heart rate' });
  }
});

// Helper function to calculate distance between two coordinates
function calculateDistance(coords1, coords2) {
  if (!coords1 || !coords2 || coords1[0] === 0 || coords2[0] === 0) {
    return null;
  }

  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;

  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
}

module.exports = router;