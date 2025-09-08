const express = require('express');
const Match = require('../models/Match');
const Member = require('../models/Member');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get user's matches
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status = 'active', page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const matches = await Match.find({
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ],
      status: status
    })
    .populate('user1_id user2_id', 'name avatar_url age bio collection_rate status')
    .sort({ last_interaction: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    // Format matches with partner info
    const formattedMatches = matches.map(match => {
      const isUser1 = match.user1_id._id.equals(req.user.id);
      const partner = isUser1 ? match.user2_id : match.user1_id;
      
      return {
        _id: match._id,
        partner: partner,
        sync_level: match.sync_level,
        butterfly_type: match.butterfly_type,
        last_interaction: match.last_interaction,
        conversation_depth: match.conversation_depth,
        heart_sync_sessions: match.heart_sync_sessions,
        compatibility_score: match.compatibility_score,
        is_ghosted: match.is_ghosted,
        status: match.status,
        mutual_likes: match.mutual_likes
      };
    });

    res.json({
      matches: formattedMatches,
      page: parseInt(page),
      total: await Match.countDocuments({
        $or: [
          { user1_id: req.user.id },
          { user2_id: req.user.id }
        ],
        status: status
      })
    });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Get specific match details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.id,
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ]
    })
    .populate('user1_id user2_id', 'name avatar_url age bio collection_rate status location');

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const isUser1 = match.user1_id._id.equals(req.user.id);
    const partner = isUser1 ? match.user2_id : match.user1_id;

    res.json({
      _id: match._id,
      partner: partner,
      sync_level: match.sync_level,
      butterfly_type: match.butterfly_type,
      last_interaction: match.last_interaction,
      conversation_depth: match.conversation_depth,
      heart_sync_sessions: match.heart_sync_sessions,
      heart_sync_history: match.heart_sync_history,
      conversation_milestones: match.conversation_milestones,
      compatibility_score: match.compatibility_score,
      shared_interests: match.shared_interests,
      is_ghosted: match.is_ghosted,
      status: match.status,
      mutual_likes: match.mutual_likes,
      ghosting_detection: match.ghosting_detection
    });
  } catch (error) {
    console.error('Get match details error:', error);
    res.status(500).json({ error: 'Failed to fetch match details' });
  }
});

// Update match status
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'paused', 'ended', 'blocked'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const match = await Match.findOne({
      _id: req.params.id,
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ]
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    match.status = status;
    await match.save();

    res.json({
      message: 'Match status updated',
      match_id: match._id,
      status: match.status
    });
  } catch (error) {
    console.error('Update match status error:', error);
    res.status(500).json({ error: 'Failed to update match status' });
  }
});

// Calculate and update compatibility score
router.post('/:id/calculate-compatibility', authMiddleware, async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.id,
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ]
    })
    .populate('user1_id user2_id', 'interests collection_rate heart_rate_history');

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const user1 = match.user1_id;
    const user2 = match.user2_id;

    // Calculate compatibility score
    let compatibilityScore = 0;

    // Interest compatibility (40% weight)
    const commonInterests = user1.interests.filter(interest =>
      user2.interests.includes(interest)
    );
    const interestScore = (commonInterests.length / Math.max(user1.interests.length, user2.interests.length, 1)) * 40;
    compatibilityScore += interestScore;

    // Collection rate similarity (20% weight)
    const collectionDiff = Math.abs(user1.collection_rate - user2.collection_rate);
    const collectionScore = Math.max(0, 20 - collectionDiff / 5);
    compatibilityScore += collectionScore;

    // Heart sync compatibility (30% weight)
    const heartSyncScore = match.sync_level * 0.3;
    compatibilityScore += heartSyncScore;

    // Conversation depth (10% weight)
    const conversationScore = match.conversation_depth;
    compatibilityScore += conversationScore;

    // Update match
    match.compatibility_score = Math.min(100, Math.round(compatibilityScore));
    match.shared_interests = commonInterests;
    match.butterfly_type = match.calculateButterflyType();
    
    await match.save();

    res.json({
      compatibility_score: match.compatibility_score,
      shared_interests: match.shared_interests,
      butterfly_type: match.butterfly_type,
      breakdown: {
        interest_score: Math.round(interestScore),
        collection_score: Math.round(collectionScore),
        heart_sync_score: Math.round(heartSyncScore),
        conversation_score: Math.round(conversationScore)
      }
    });
  } catch (error) {
    console.error('Calculate compatibility error:', error);
    res.status(500).json({ error: 'Failed to calculate compatibility' });
  }
});

// Add conversation milestone
router.post('/:id/milestone', authMiddleware, async (req, res) => {
  try {
    const { milestone, butterfly_reward } = req.body;

    const validMilestones = ['first_message', 'first_voice', 'first_heart_sync', 'deep_conversation', 'butterfly_collection'];
    if (!validMilestones.includes(milestone)) {
      return res.status(400).json({ error: 'Invalid milestone' });
    }

    const match = await Match.findOne({
      _id: req.params.id,
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ]
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Check if milestone already exists
    const existingMilestone = match.conversation_milestones.find(m => m.milestone === milestone);
    if (existingMilestone) {
      return res.status(400).json({ error: 'Milestone already achieved' });
    }

    await match.addMilestone(milestone, butterfly_reward);

    res.json({
      message: 'Milestone added successfully',
      milestone: milestone,
      conversation_depth: match.conversation_depth,
      butterfly_reward: butterfly_reward
    });
  } catch (error) {
    console.error('Add milestone error:', error);
    res.status(500).json({ error: 'Failed to add milestone' });
  }
});

// Check for ghosting
router.post('/:id/check-ghosting', authMiddleware, async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.id,
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ]
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    await match.checkForGhosting();

    res.json({
      is_ghosted: match.is_ghosted,
      ghosting_detection: match.ghosting_detection
    });
  } catch (error) {
    console.error('Check ghosting error:', error);
    res.status(500).json({ error: 'Failed to check ghosting' });
  }
});

// Get match statistics
router.get('/:id/stats', authMiddleware, async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.id,
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ]
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Get message count (you'll need to implement this after creating the Message model routes)
    // const messageCount = await Message.countDocuments({ match_id: match._id });

    const stats = {
      days_matched: Math.floor((new Date() - match.createdAt) / (1000 * 60 * 60 * 24)),
      heart_sync_sessions: match.heart_sync_sessions,
      conversation_depth: match.conversation_depth,
      sync_level: match.sync_level,
      compatibility_score: match.compatibility_score,
      butterfly_type: match.butterfly_type,
      milestones_achieved: match.conversation_milestones.length,
      // message_count: messageCount,
      average_sync_level: match.heart_sync_history.length > 0 ? 
        Math.round(match.heart_sync_history.reduce((sum, session) => sum + session.sync_percentage, 0) / match.heart_sync_history.length) : 0,
      last_sync_session: match.heart_sync_history.length > 0 ? 
        match.heart_sync_history[match.heart_sync_history.length - 1] : null
    };

    res.json(stats);
  } catch (error) {
    console.error('Get match stats error:', error);
    res.status(500).json({ error: 'Failed to fetch match statistics' });
  }
});

module.exports = router;