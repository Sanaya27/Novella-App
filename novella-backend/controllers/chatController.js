const Message = require('../models/Message');
const Match = require('../models/Match');
const Member = require('../models/Member');

class ChatController {
  handleConnection(socket, io) {
    // Join match rooms
    socket.on('join_match', async (data) => {
      try {
        const { matchId } = data;
        
        // Verify user has access to this match
        const match = await Match.findOne({
          _id: matchId,
          $or: [
            { user1_id: socket.userId },
            { user2_id: socket.userId }
          ]
        });

        if (match) {
          socket.join(`match_${matchId}`);
          
          // Notify partner that user is online
          socket.to(`match_${matchId}`).emit('user_online', {
            userId: socket.userId,
            timestamp: new Date()
          });

          console.log(`User ${socket.userId} joined match room: match_${matchId}`);
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to join match room' });
      }
    });

    // Leave match room
    socket.on('leave_match', (data) => {
      const { matchId } = data;
      socket.leave(`match_${matchId}`);
      
      // Notify partner that user left
      socket.to(`match_${matchId}`).emit('user_offline', {
        userId: socket.userId,
        timestamp: new Date()
      });

      console.log(`User ${socket.userId} left match room: match_${matchId}`);
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { matchId } = data;
      socket.to(`match_${matchId}`).emit('user_typing', {
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    socket.on('typing_stop', (data) => {
      const { matchId } = data;
      socket.to(`match_${matchId}`).emit('user_stopped_typing', {
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    // Handle real-time message sending
    socket.on('send_message', async (data) => {
      try {
        const { matchId, content, messageType = 'text', replyTo } = data;

        // Verify user has access to this match
        const match = await Match.findOne({
          _id: matchId,
          $or: [
            { user1_id: socket.userId },
            { user2_id: socket.userId }
          ],
          status: 'active'
        });

        if (!match) {
          socket.emit('message_error', { error: 'Match not found or inactive' });
          return;
        }

        // Create and save message
        const message = new Message({
          match_id: matchId,
          sender_id: socket.userId,
          content,
          message_type: messageType,
          reply_to: replyTo || null
        });

        await message.save();
        await message.populate('sender_id', 'name avatar_url');

        // Update match last interaction
        await match.updateLastInteraction();

        // Update ghosting detection
        const isUser1 = match.user1_id.equals(socket.userId);
        if (isUser1) {
          match.ghosting_detection.last_response_user1 = new Date();
        } else {
          match.ghosting_detection.last_response_user2 = new Date();
        }
        
        if (match.is_ghosted) {
          match.is_ghosted = false;
        }

        await match.save();

        // Check for butterfly generation
        const butterflyProbability = message.getButterflyProbability();
        const shouldGenerateButterfly = Math.random() < butterflyProbability;

        if (shouldGenerateButterfly) {
          const butterflyType = match.butterfly_type;
          await message.addButterflyInteraction(socket.userId, butterflyType, 'landed');
        }

        // Emit message to all users in the match room
        io.to(`match_${matchId}`).emit('new_message', {
          message: message,
          butterfly_generated: shouldGenerateButterfly,
          butterfly_type: shouldGenerateButterfly ? match.butterfly_type : null
        });

        // Send confirmation to sender
        socket.emit('message_sent', {
          messageId: message._id,
          timestamp: message.createdAt
        });

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    // Handle message read status
    socket.on('mark_messages_read', async (data) => {
      try {
        const { matchId, messageIds } = data;

        // Verify user has access to this match
        const match = await Match.findOne({
          _id: matchId,
          $or: [
            { user1_id: socket.userId },
            { user2_id: socket.userId }
          ]
        });

        if (!match) {
          return;
        }

        // Mark messages as read
        await Message.updateMany(
          {
            _id: { $in: messageIds },
            match_id: matchId,
            sender_id: { $ne: socket.userId },
            is_read: false
          },
          {
            $set: {
              is_read: true,
              read_at: new Date(),
              delivery_status: 'read'
            }
          }
        );

        // Notify sender that messages were read
        socket.to(`match_${matchId}`).emit('messages_read', {
          messageIds: messageIds,
          readBy: socket.userId,
          timestamp: new Date()
        });

      } catch (error) {
        console.error('Mark messages read error:', error);
      }
    });

    // Handle voice mood message
    socket.on('send_voice_mood', async (data) => {
      try {
        const { matchId, voiceFileUrl, mood } = data;

        const match = await Match.findOne({
          _id: matchId,
          $or: [
            { user1_id: socket.userId },
            { user2_id: socket.userId }
          ],
          status: 'active'
        });

        if (!match) {
          socket.emit('message_error', { error: 'Match not found or inactive' });
          return;
        }

        const message = new Message({
          match_id: matchId,
          sender_id: socket.userId,
          content: '🎵 Voice mood message',
          message_type: 'voice_mood',
          voice_file_url: voiceFileUrl,
          voice_mood: mood
        });

        await message.save();
        await message.populate('sender_id', 'name avatar_url');

        // Update match
        await match.updateLastInteraction();

        // Check if this is first voice message milestone
        const hasVoiceMilestone = match.conversation_milestones.some(m => m.milestone === 'first_voice');
        if (!hasVoiceMilestone) {
          await match.addMilestone('first_voice', 'swallowtail');
        }

        // Emit to match room
        io.to(`match_${matchId}`).emit('new_voice_mood', {
          message: message,
          milestone_achieved: !hasVoiceMilestone
        });

      } catch (error) {
        console.error('Send voice mood error:', error);
        socket.emit('message_error', { error: 'Failed to send voice mood' });
      }
    });

    // Handle flutter tap (quick emoji reaction)
    socket.on('send_flutter_tap', async (data) => {
      try {
        const { matchId, emoji } = data;

        const match = await Match.findOne({
          _id: matchId,
          $or: [
            { user1_id: socket.userId },
            { user2_id: socket.userId }
          ],
          status: 'active'
        });

        if (!match) {
          socket.emit('message_error', { error: 'Match not found or inactive' });
          return;
        }

        const message = new Message({
          match_id: matchId,
          sender_id: socket.userId,
          content: emoji || '💕',
          message_type: 'flutter_tap'
        });

        await message.save();
        await message.populate('sender_id', 'name avatar_url');

        // Update match
        await match.updateLastInteraction();

        // Higher chance for butterfly on flutter taps
        const shouldGenerateButterfly = Math.random() < 0.4; // 40% chance

        if (shouldGenerateButterfly) {
          const butterflyType = match.butterfly_type;
          await message.addButterflyInteraction(socket.userId, butterflyType, 'landed');
        }

        // Emit to match room
        io.to(`match_${matchId}`).emit('new_flutter_tap', {
          message: message,
          butterfly_generated: shouldGenerateButterfly,
          butterfly_type: shouldGenerateButterfly ? match.butterfly_type : null
        });

      } catch (error) {
        console.error('Send flutter tap error:', error);
        socket.emit('message_error', { error: 'Failed to send flutter tap' });
      }
    });

    // Handle ghost glimpse (temporary message)
    socket.on('send_ghost_glimpse', async (data) => {
      try {
        const { matchId, content, duration = 5000 } = data; // Default 5 seconds

        const match = await Match.findOne({
          _id: matchId,
          $or: [
            { user1_id: socket.userId },
            { user2_id: socket.userId }
          ],
          status: 'active'
        });

        if (!match) {
          socket.emit('message_error', { error: 'Match not found or inactive' });
          return;
        }

        const message = new Message({
          match_id: matchId,
          sender_id: socket.userId,
          content,
          message_type: 'ghost_glimpse'
        });

        await message.save();
        await message.populate('sender_id', 'name avatar_url');

        // Emit temporary message
        io.to(`match_${matchId}`).emit('ghost_glimpse', {
          message: message,
          duration: duration
        });

        // Delete message after duration
        setTimeout(async () => {
          try {
            await Message.findByIdAndDelete(message._id);
            io.to(`match_${matchId}`).emit('ghost_glimpse_expired', {
              messageId: message._id
            });
          } catch (error) {
            console.error('Failed to delete ghost glimpse:', error);
          }
        }, duration);

      } catch (error) {
        console.error('Send ghost glimpse error:', error);
        socket.emit('message_error', { error: 'Failed to send ghost glimpse' });
      }
    });

    // Handle message reactions
    socket.on('react_to_message', async (data) => {
      try {
        const { messageId, reaction } = data;

        const message = await Message.findById(messageId);
        if (!message) {
          socket.emit('reaction_error', { error: 'Message not found' });
          return;
        }

        // Verify user has access to this match
        const match = await Match.findOne({
          _id: message.match_id,
          $or: [
            { user1_id: socket.userId },
            { user2_id: socket.userId }
          ]
        });

        if (!match) {
          socket.emit('reaction_error', { error: 'Access denied' });
          return;
        }

        // Emit reaction to match room
        io.to(`match_${message.match_id}`).emit('message_reaction', {
          messageId: messageId,
          reaction: reaction,
          userId: socket.userId,
          timestamp: new Date()
        });

      } catch (error) {
        console.error('React to message error:', error);
        socket.emit('reaction_error', { error: 'Failed to add reaction' });
      }
    });

    // Handle user status updates
    socket.on('update_status', async (data) => {
      try {
        const { status } = data;

        await Member.findByIdAndUpdate(socket.userId, {
          status: status,
          last_active: new Date()
        });

        // Broadcast status to all user's matches
        const matches = await Match.find({
          $or: [
            { user1_id: socket.userId },
            { user2_id: socket.userId }
          ],
          status: 'active'
        });

        matches.forEach(match => {
          socket.to(`match_${match._id}`).emit('partner_status_update', {
            userId: socket.userId,
            status: status,
            timestamp: new Date()
          });
        });

      } catch (error) {
        console.error('Update status error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      try {
        // Update user status to offline
        await Member.findByIdAndUpdate(socket.userId, {
          status: 'offline',
          last_active: new Date()
        });

        // Notify all matches that user went offline
        const matches = await Match.find({
          $or: [
            { user1_id: socket.userId },
            { user2_id: socket.userId }
          ],
          status: 'active'
        });

        matches.forEach(match => {
          socket.to(`match_${match._id}`).emit('partner_offline', {
            userId: socket.userId,
            timestamp: new Date()
          });
        });

        console.log(`User ${socket.userId} disconnected`);
      } catch (error) {
        console.error('Disconnect handler error:', error);
      }
    });
  }
}

module.exports = new ChatController();