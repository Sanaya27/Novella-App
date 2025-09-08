import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, MessageSquare, Send, Clock } from 'lucide-react';
import { useUser } from '../context/UserContext';
import ButterflyAnimation from '../components/dating/ButterflyAnimation';

// Sample profiles for demo
const sampleProfiles = {
  1: { name: 'Priya', photo: 'https://images.unsplash.com/photo-1494790108755-2616b332c813?w=400' },
  2: { name: 'Aman', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  3: { name: 'Riya', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
  4: { name: 'Arjun', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' },
  5: { name: 'Kavya', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400' },
  6: { name: 'Rohit', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' }
};

// Sample sync session history
const sampleSyncHistory = [
  { date: '09 Sep 2025, 18:42', partner: 'Priya', syncPercentage: 89 },
  { date: '08 Sep 2025, 21:15', partner: 'Riya', syncPercentage: 82 },
  { date: '07 Sep 2025, 19:30', partner: 'Kavya', syncPercentage: 91 }
];

export default function Sync() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  
  // BPM and sync state
  const [myBpm, setMyBpm] = useState(72);
  const [partnerBpm, setPartnerBpm] = useState(75);
  const [syncPercentage, setSyncPercentage] = useState(73);
  const [syncDuration, setSyncDuration] = useState(0);
  const [bpmHistory, setBpmHistory] = useState([]);
  const [butterflyAnimations, setButterflyAnimations] = useState([]);
  
  const intervalRef = useRef();
  
  const currentPartner = matchId ? sampleProfiles[matchId] : sampleProfiles[1];

  // BPM generation algorithm
  const generateBpm = (currentBpm, isExciting = false) => {
    const baseline = currentBpm < 75 ? 72 : 76;
    const target = isExciting ? Math.random() * 15 + 85 : baseline;
    const oscillation = Math.sin(Date.now() / 1000) * 2;
    const noise = (Math.random() - 0.5) * 3;
    
    const newBpm = currentBpm + (target - currentBpm) * 0.1 + oscillation + noise;
    return Math.max(65, Math.min(105, newBpm));
  };

  // Sync percentage calculation
  const calculateSyncPercentage = (bpm1, bpm2, flutterBoost = 0) => {
    const similarity = 1 - Math.abs(bpm1 - bpm2) / 60;
    const baseSync = 65 + similarity * 20;
    const jitter = (Math.random() - 0.5) * 4;
    const result = baseSync + flutterBoost + jitter;
    return Math.max(65, Math.min(95, result));
  };

  // Update BPM and sync percentage
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMyBpm(prev => generateBpm(prev));
      setPartnerBpm(prev => generateBpm(prev));
      
      // Update sync duration
      setSyncDuration(prev => prev + 1);
    }, 350); // ~350ms for realistic updates

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update sync percentage based on BPM similarity
  useEffect(() => {
    const newSync = calculateSyncPercentage(myBpm, partnerBpm);
    setSyncPercentage(newSync);
    
    // Add to BPM history for chart
    setBpmHistory(prev => {
      const newHistory = [...prev, { time: Date.now(), myBpm, partnerBpm, sync: newSync }];
      return newHistory.slice(-50); // Keep last 50 data points
    });
  }, [myBpm, partnerBpm]);

  const handleSendFlutter = () => {
    // Create enhanced butterfly animation with natural movement
    const newButterflies = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      delay: i * 150, // Reduced delay from 200ms to 150ms for quicker succession
      startX: Math.random() * 40 + 20, // Start from bottom area
      startY: 90 + Math.random() * 10, // Start from bottom
      endX: Math.random() * 60 + 20, // End in wider area
      endY: Math.random() * 20 + 10, // End near top
      rotation: Math.random() * 30 - 15, // Gentle rotation (-15 to +15 degrees)
      color: Math.random() > 0.5 ? '#ff6b9d' : '#4ecdc4',
      size: Math.random() > 0.3 ? 'large' : 'medium',
      curveX: Math.random() * 30 - 15 // For curved flight path
    }));
    
    console.log('🦋 FLUTTER CLICKED! Created butterflies:', newButterflies.length);
    setButterflyAnimations(newButterflies);
    
    setTimeout(() => {
      console.log('🦋 Clearing butterflies');
      setButterflyAnimations([]);
    }, 3000); // Reduced from 5000ms to 3000ms to match faster animation
    
    // Trigger excitement in both BPMs
    setMyBpm(prev => Math.min(100, prev + 8));
    setPartnerBpm(prev => Math.min(100, prev + 6));
    
    // Boost sync percentage temporarily
    setSyncPercentage(prev => Math.min(95, prev + 5));
    
    // Add new sync session entry
    const newEntry = {
      date: new Date().toLocaleString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      partner: currentPartner.name,
      syncPercentage: Math.round(syncPercentage)
    };
    
    // Would normally update sync history here
    console.log('Flutter sent!', newEntry);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Enhanced Butterfly animations (same as home page) */}
      <AnimatePresence>
        {butterflyAnimations.map((butterfly) => {
          console.log('🦋 Rendering butterfly with ID:', butterfly.id);
          return (
            <motion.div
              key={butterfly.id}
              initial={{
                x: `${butterfly.startX}vw`,
                y: `${butterfly.startY}vh`,
                opacity: 1,
                scale: 1
              }}
              animate={{
                x: `${butterfly.endX}vw`,
                y: `${butterfly.endY}vh`,
                opacity: 0,
                scale: 1.2
              }}
              transition={{
                duration: 2.0, // Reduced from 3.0 to 2.0 seconds for faster movement
                delay: butterfly.delay / 1000,
                ease: 'easeOut'
              }}
              style={{
                position: 'fixed',
                zIndex: 9999, // Higher z-index to be on top
                pointerEvents: 'none',
                backgroundColor: 'rgba(255, 0, 255, 0.2)', // Temporary debug background
                borderRadius: '50%'
              }}
            >
              {/* Large visible emoji butterfly */}
              <div style={{
                fontSize: '48px',
                textAlign: 'center',
                lineHeight: '1',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}>
                🦋
              </div>
              
              {/* Original butterfly animation (backup) */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.8
              }}>
                <ButterflyAnimation
                  bpm={80}
                  color={butterfly.color}
                  size={butterfly.size}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '30px'
      }}>
        <button
          onClick={() => navigate('/home')}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '48px',
            minHeight: '48px'
          }}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: 'white',
            margin: '0 0 4px 0'
          }}>
            Heart Sync
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0
          }}>
            Feel the rhythm of connection
          </p>
        </div>
      </div>

      {/* Partner info */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <img
          src={currentPartner.photo}
          alt={currentPartner.name}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'white',
            margin: '0 0 4px 0'
          }}>
            Syncing with {currentPartner.name}
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0
          }}>
            Synced for {formatDuration(syncDuration)}
          </p>
        </div>
      </div>

      {/* Hearts and BPM Display */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* My Heart */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1] 
            }}
            transition={{ 
              duration: 60 / myBpm,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}
          >
            ❤️
          </motion.div>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#ff6b9d',
            marginBottom: '8px'
          }}>
            {Math.round(myBpm)} BPM
          </div>
          <div style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            You ({user?.fullName || 'You'})
          </div>
        </div>

        {/* Partner Heart */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1] 
            }}
            transition={{ 
              duration: 60 / partnerBpm,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}
          >
            💖
          </motion.div>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#22d3ee',
            marginBottom: '8px'
          }}>
            {Math.round(partnerBpm)} BPM
          </div>
          <div style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            {currentPartner.name}
          </div>
        </div>
      </div>

      {/* Sync Percentage */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          fontSize: '48px',
          fontWeight: '700',
          background: 'linear-gradient(45deg, #ff6b9d, #22d3ee)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px'
        }}>
          {Math.round(syncPercentage)}%
        </div>
        <div style={{
          fontSize: '18px',
          color: 'white',
          marginBottom: '20px'
        }}>
          Sync Level
        </div>
        
        {/* Sync Progress Bar */}
        <div style={{
          width: '100%',
          height: '12px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '6px',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          <motion.div
            style={{
              height: '100%',
              background: 'linear-gradient(45deg, #ff6b9d, #22d3ee)',
              borderRadius: '6px'
            }}
            animate={{ width: `${syncPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Send Flutter Button */}
        <motion.button
          onClick={handleSendFlutter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'linear-gradient(45deg, #ff6b9d, #22d3ee)',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 32px',
            color: 'white',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 auto',
            boxShadow: '0 4px 15px rgba(255, 107, 157, 0.4)',
            minHeight: '52px'
          }}
        >
          <Send size={20} />
          Send Flutter
        </motion.button>
      </div>

      {/* BPM Chart */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: 'white',
          marginBottom: '20px'
        }}>
          Live Heart Rate Sync
        </h3>
        
        {/* Simple BPM bars visualization */}
        <div style={{
          display: 'flex',
          alignItems: 'end',
          gap: '4px',
          height: '100px',
          width: '100%',
          overflow: 'hidden'
        }}>
          {bpmHistory.slice(-20).map((data, index) => (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              flex: 1
            }}>
              <motion.div
                style={{
                  width: '100%',
                  background: 'linear-gradient(to top, #ff6b9d, #ff8fab)',
                  borderRadius: '2px'
                }}
                animate={{
                  height: `${(data.myBpm - 60) * 2}px`
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                style={{
                  width: '100%',
                  background: 'linear-gradient(to top, #22d3ee, #60a5fa)',
                  borderRadius: '2px'
                }}
                animate={{
                  height: `${(data.partnerBpm - 60) * 2}px`
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: '#ff6b9d',
              borderRadius: '2px'
            }} />
            <span style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              Your BPM
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              background: '#22d3ee',
              borderRadius: '2px'
            }} />
            <span style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              {currentPartner.name}'s BPM
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        marginBottom: '30px'
      }}>
        <motion.button
          onClick={() => navigate(`/chat/${matchId || 1}`)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            padding: '16px 24px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minHeight: '52px'
          }}
        >
          <MessageSquare size={20} />
          Open Chat
        </motion.button>
      </div>

      {/* Sync Session Summary */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: 'white',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Clock size={20} />
          Sync Session Summary
        </h3>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {sampleSyncHistory.map((session, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{
                  fontSize: '14px',
                  color: 'white',
                  fontWeight: '500'
                }}>
                  {session.date} — Synced with {session.partner}
                </div>
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#22d3ee'
              }}>
                {session.syncPercentage}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}