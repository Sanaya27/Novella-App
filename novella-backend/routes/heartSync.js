const express = require('express');
const Match = require('../models/Match');
const Member = require('../models/Member');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Start heart sync session
router.post('/start/:matchId', authMiddleware, async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findOne({
      _id: matchId,
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ]
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.status !== 'active') {
      return res.status(400).json({ error: 'Match is not active' });
    }

    // Create heart sync session
    const sessionId = `heart_sync_${matchId}_${Date.now()}`;
    
    res.json({
      message: 'Heart sync session started',
      session_id: sessionId,
      match_id: matchId,
      instructions: {
        duration: 60, // 60 seconds
        interval: 1000, // Send heart rate every 1 second
        target_sync: 80 // Target sync percentage for butterfly generation
      }
    });
  } catch (error) {
    console.error('Start heart sync error:', error);
    res.status(500).json({ error: 'Failed to start heart sync session' });
  }
});

// End heart sync session and calculate results
router.post('/end/:matchId', authMiddleware, async (req, res) => {
  try {
    const { matchId } = req.params;
    const { heartRateData, duration } = req.body; // Array of heart rate measurements

    if (!heartRateData || !Array.isArray(heartRateData)) {
      return res.status(400).json({ error: 'Heart rate data is required' });
    }

    const match = await Match.findOne({
      _id: matchId,
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ]
    }).populate('user1_id user2_id', 'name heart_rate_history');

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Calculate sync percentage
    const syncPercentage = calculateHeartSyncPercentage(heartRateData);
    const durationMinutes = Math.round(duration / 60);

    // Add session to match
    await match.addHeartSyncSession(syncPercentage, durationMinutes);

    // Update user's heart rate history
    const currentUser = await Member.findById(req.user.id);
    const avgHeartRate = heartRateData.reduce((sum, data) => sum + data.rate, 0) / heartRateData.length;
    
    currentUser.heart_rate_history.push({
      rate: Math.round(avgHeartRate),
      mood: determineMoodFromHeartRate(avgHeartRate, syncPercentage)
    });

    if (currentUser.heart_rate_history.length > 100) {
      currentUser.heart_rate_history = currentUser.heart_rate_history.slice(-100);
    }

    await currentUser.save();

    // Check if butterfly should be generated
    const butterflyGenerated = syncPercentage > 80;
    let butterflyType = null;

    if (butterflyGenerated) {
      butterflyType = match.butterfly_type;
      
      // Add butterfly to both users' collections
      await currentUser.addButterfly(butterflyType, match._id);
      
      const partnerId = match.user1_id._id.equals(req.user.id) ? match.user2_id._id : match.user1_id._id;
      const partner = await Member.findById(partnerId);
      await partner.addButterfly(butterflyType, match._id);

      // Add milestone if it's their first heart sync
      const isFirstHeartSync = match.heart_sync_sessions === 1;
      if (isFirstHeartSync) {
        await match.addMilestone('first_heart_sync', butterflyType);
      }
    }

    res.json({
      message: 'Heart sync session completed',
      results: {
        sync_percentage: syncPercentage,
        duration_minutes: durationMinutes,
        butterfly_generated: butterflyGenerated,
        butterfly_type: butterflyType,
        new_sync_level: match.sync_level,
        total_sessions: match.heart_sync_sessions,
        avg_heart_rate: Math.round(avgHeartRate),
        mood: determineMoodFromHeartRate(avgHeartRate, syncPercentage)
      }
    });
  } catch (error) {
    console.error('End heart sync error:', error);
    res.status(500).json({ error: 'Failed to end heart sync session' });
  }
});

// Get heart sync history for a match
router.get('/history/:matchId', authMiddleware, async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findOne({
      _id: matchId,
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ]
    }).select('heart_sync_history sync_level heart_sync_sessions');

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Calculate statistics
    const history = match.heart_sync_history;
    const stats = {
      total_sessions: match.heart_sync_sessions,
      current_sync_level: match.sync_level,
      average_sync: history.length > 0 ? 
        Math.round(history.reduce((sum, session) => sum + session.sync_percentage, 0) / history.length) : 0,
      best_sync: history.length > 0 ? Math.max(...history.map(s => s.sync_percentage)) : 0,
      total_butterflies: history.filter(s => s.butterfly_generated).length,
      total_duration: history.reduce((sum, session) => sum + session.duration_minutes, 0),
      last_session: history.length > 0 ? history[history.length - 1] : null
    };

    res.json({
      history: history.sort((a, b) => b.session_date - a.session_date),
      statistics: stats
    });
  } catch (error) {
    console.error('Get heart sync history error:', error);
    res.status(500).json({ error: 'Failed to fetch heart sync history' });
  }
});

// Get user's heart rate profile
router.get('/profile/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Only allow users to view their own profile or their match's profile
    if (userId !== req.user.id) {
      // Check if they have a match with this user
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
      .select('heart_rate_history name avatar_url');

    if (!member) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate heart rate statistics
    const recentData = member.heart_rate_history.slice(-50); // Last 50 readings
    
    if (recentData.length === 0) {
      return res.json({
        name: member.name,
        avatar_url: member.avatar_url,
        has_data: false,
        message: 'No heart rate data available'
      });
    }

    const rates = recentData.map(hr => hr.rate);
    const avgRate = Math.round(rates.reduce((sum, rate) => sum + rate, 0) / rates.length);
    const minRate = Math.min(...rates);
    const maxRate = Math.max(...rates);

    // Mood distribution
    const moodCounts = {};
    recentData.forEach(hr => {
      moodCounts[hr.mood] = (moodCounts[hr.mood] || 0) + 1;
    });

    const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );

    res.json({
      name: member.name,
      avatar_url: member.avatar_url,
      has_data: true,
      statistics: {
        average_rate: avgRate,
        min_rate: minRate,
        max_rate: maxRate,
        dominant_mood: dominantMood,
        mood_distribution: moodCounts,
        total_readings: recentData.length,
        last_reading: recentData[recentData.length - 1]
      },
      recent_data: recentData.slice(-10) // Last 10 readings for chart
    });
  } catch (error) {
    console.error('Get heart rate profile error:', error);
    res.status(500).json({ error: 'Failed to fetch heart rate profile' });
  }
});

// Calculate compatibility based on heart rate patterns
router.get('/compatibility/:matchId', authMiddleware, async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findOne({
      _id: matchId,
      $or: [
        { user1_id: req.user.id },
        { user2_id: req.user.id }
      ]
    }).populate('user1_id user2_id', 'heart_rate_history name');

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const user1Data = match.user1_id.heart_rate_history.slice(-20);
    const user2Data = match.user2_id.heart_rate_history.slice(-20);

    if (user1Data.length === 0 || user2Data.length === 0) {
      return res.json({
        compatibility: 0,
        message: 'Insufficient heart rate data for analysis',
        recommendation: 'Try heart sync sessions to build compatibility data'
      });
    }

    // Calculate heart rate compatibility
    const user1Avg = user1Data.reduce((sum, hr) => sum + hr.rate, 0) / user1Data.length;
    const user2Avg = user2Data.reduce((sum, hr) => sum + hr.rate, 0) / user2Data.length;
    
    const rateDifference = Math.abs(user1Avg - user2Avg);
    const rateCompatibility = Math.max(0, 100 - rateDifference * 2); // Lower difference = higher compatibility

    // Mood compatibility
    const user1Moods = user1Data.map(hr => hr.mood);
    const user2Moods = user2Data.map(hr => hr.mood);
    const commonMoods = user1Moods.filter(mood => user2Moods.includes(mood));
    const moodCompatibility = (commonMoods.length / Math.max(user1Moods.length, user2Moods.length)) * 100;

    // Overall compatibility (weighted average)
    const overallCompatibility = Math.round(
      (rateCompatibility * 0.6) + (moodCompatibility * 0.4) + (match.sync_level * 0.2)
    );

    let recommendation = '';
    if (overallCompatibility >= 80) {
      recommendation = 'Excellent heart rhythm compatibility! Perfect for deep connections.';
    } else if (overallCompatibility >= 60) {
      recommendation = 'Good compatibility. Regular heart sync sessions will strengthen your bond.';
    } else if (overallCompatibility >= 40) {
      recommendation = 'Moderate compatibility. Try relaxing activities together to sync better.';
    } else {
      recommendation = 'Low compatibility detected. Focus on building emotional connection first.';
    }

    res.json({
      compatibility: Math.min(100, overallCompatibility),
      breakdown: {
        heart_rate_compatibility: Math.round(rateCompatibility),
        mood_compatibility: Math.round(moodCompatibility),
        sync_sessions_bonus: Math.round(match.sync_level * 0.2)
      },
      statistics: {
        user1_avg_rate: Math.round(user1Avg),
        user2_avg_rate: Math.round(user2Avg),
        rate_difference: Math.round(rateDifference),
        common_moods: [...new Set(commonMoods)]
      },
      recommendation: recommendation
    });
  } catch (error) {
    console.error('Calculate heart compatibility error:', error);
    res.status(500).json({ error: 'Failed to calculate heart compatibility' });
  }
});

// Helper function to calculate heart sync percentage
function calculateHeartSyncPercentage(heartRateData) {
  if (heartRateData.length < 2) return 0;

  // Group data by user (assuming alternating pattern or user_id in data)
  const user1Data = heartRateData.filter((_, index) => index % 2 === 0);
  const user2Data = heartRateData.filter((_, index) => index % 2 === 1);

  if (user1Data.length === 0 || user2Data.length === 0) return 0;

  let syncPoints = 0;
  const minLength = Math.min(user1Data.length, user2Data.length);

  for (let i = 0; i < minLength; i++) {
    const rate1 = user1Data[i].rate;
    const rate2 = user2Data[i].rate;
    const difference = Math.abs(rate1 - rate2);
    
    // Consider sync if heart rates are within 10 BPM
    if (difference <= 10) {
      syncPoints += 1;
    }
  }

  return Math.round((syncPoints / minLength) * 100);
}

// Helper function to determine mood from heart rate and sync
function determineMoodFromHeartRate(avgRate, syncPercentage) {
  if (syncPercentage > 80) {
    return avgRate > 100 ? 'rose_ember' : 'golden_pollen';
  } else if (syncPercentage > 60) {
    return avgRate > 90 ? 'silver_whisper' : 'blue_mist';
  } else {
    return avgRate > 95 ? 'rose_ember' : 'blue_mist';
  }
}

module.exports = router;