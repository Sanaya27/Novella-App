import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { useUser } from '../context/UserContext';
import ButterflyAnimation from '../components/dating/ButterflyAnimation';

// Sample profiles for demo - matching HomeNew.jsx profiles
const sampleProfiles = {
  1: { name: 'Lily Chen', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
  2: { name: 'Sofia Luna', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' },
  3: { name: 'Zara Moon', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400' },
  4: { name: 'Aria Chen', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400' },
  5: { name: 'Emma Rodriguez', photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400' },
  6: { name: 'Madison Cooper', photo: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400' }
};

// Sample sync session history
const sampleSyncHistory = [
  { date: '09 Sep 2025, 18:42', partner: 'Lily Chen', syncPercentage: 89 },
  { date: '08 Sep 2025, 21:15', partner: 'Sofia Luna', syncPercentage: 82 },
  { date: '07 Sep 2025, 19:30', partner: 'Zara Moon', syncPercentage: 91 }
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
    return Math.round(Math.max(65, Math.min(105, newBpm))); // Round to integer
  };

  // Sync percentage calculation
  const calculateSyncPercentage = (bpm1, bpm2, flutterBoost = 0) => {
    const similarity = 1 - Math.abs(bpm1 - bpm2) / 60;
    const baseSync = 65 + similarity * 20;
    const jitter = (Math.random() - 0.5) * 4;
    const result = baseSync + flutterBoost + jitter;
    return Math.round(Math.max(65, Math.min(95, result))); // Round to integer
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
      margin: '0 auto',
      background: 'linear-gradient(135deg, #6B46C1 0%, #9333EA 50%, #EC4899 100%)',
      minHeight: '100vh'
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
                pointerEvents: 'none'
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
        marginBottom: '30px'
      }}>
        {/* Back button */}
        <div style={{
          marginBottom: '20px'
        }}>
          <button
            onClick={() => navigate('/home')}
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
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
        </div>
        
        {/* Centered title and tagline */}
        <div style={{
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: 'white',
            margin: '0 0 8px 0'
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

      {/* Connection Status Bar */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#00ff88'
          }} />
          <span style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Connected to {currentPartner.name}
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#00ff88',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          ⚡ {Math.floor(syncPercentage)}% sync
        </div>
      </div>

      {/* BPM Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* My Heart Card */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '24px' }}>💙</span>
            <span style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              You
            </span>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00ff88'
            }} />
          </div>
          
          <div style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#4ecdc4',
            marginBottom: '16px'
          }}>
            {Math.floor(myBpm)}
            <span style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginLeft: '8px'
            }}>
              BPM
            </span>
          </div>
          
          {/* Mini Bar Chart */}
          <div style={{
            height: '40px',
            display: 'flex',
            alignItems: 'end',
            gap: '2px',
            marginBottom: '8px'
          }}>
            <span style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginRight: '8px'
            }}>
              •••
            </span>
            {bpmHistory.slice(-15).map((entry, index) => {
              const height = Math.max(4, (entry.myBpm - 60) / 40 * 100);
              return (
                <motion.div
                  key={`my-mini-${index}`}
                  style={{
                    width: '4px',
                    background: '#4ecdc4',
                    borderRadius: '2px',
                    minHeight: '4px'
                  }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.3 }}
                />
              );
            })}
          </div>
        </div>

        {/* Partner Heart Card */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '24px' }}>🧡</span>
            <span style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              {currentPartner.name}
            </span>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00ff88'
            }} />
          </div>
          
          <div style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#ff6b9d',
            marginBottom: '16px'
          }}>
            {Math.floor(partnerBpm)}
            <span style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginLeft: '8px'
            }}>
              BPM
            </span>
          </div>
          
          {/* Mini Bar Chart */}
          <div style={{
            height: '40px',
            display: 'flex',
            alignItems: 'end',
            gap: '2px',
            marginBottom: '8px'
          }}>
            <span style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginRight: '8px'
            }}>
              •••
            </span>
            {bpmHistory.slice(-15).map((entry, index) => {
              const height = Math.max(4, (entry.partnerBpm - 60) / 40 * 100);
              return (
                <motion.div
                  key={`partner-mini-${index}`}
                  style={{
                    width: '4px',
                    background: '#ff6b9d',
                    borderRadius: '2px',
                    minHeight: '4px'
                  }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.3 }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Heart Visualization */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: '250px'
      }}>
        {/* Your Heart */}
        <div style={{
          position: 'absolute',
          left: '15%',
          top: '50%',
          transform: 'translateY(-50%)',
          textAlign: 'center'
        }}>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 60 / myBpm,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '150px',
              height: '150px',
              marginBottom: '10px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Beautiful Heart Shape */}
            <div style={{
              fontSize: '120px',
              color: '#4ecdc4',
              textAlign: 'center',
              filter: 'drop-shadow(0 0 30px rgba(78, 205, 196, 0.4))'
            }}>
              💙
            </div>
          </motion.div>
          <div style={{
            color: '#4ecdc4',
            fontSize: '16px',
            fontWeight: '600',
            fontStyle: 'italic'
          }}>
            Your Heart
          </div>
        </div>

        {/* Center Connection with Send Flutter Button */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          {/* Connection Heart */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff6b9d, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 0 20px rgba(255, 107, 157, 0.5)'
            }}
          >
            ❤️
          </motion.div>
          
          {/* Send Flutter Button */}
          <motion.button
            onClick={handleSendFlutter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'linear-gradient(45deg, #ff6b9d, #22d3ee)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(255, 107, 157, 0.4)',
              minHeight: '40px'
            }}
          >
            <Send size={16} />
            Send Flutter
          </motion.button>
        </div>

        {/* Partner's Heart */}
        <div style={{
          position: 'absolute',
          right: '15%',
          top: '50%',
          transform: 'translateY(-50%)',
          textAlign: 'center'
        }}>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 60 / partnerBpm,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '150px',
              height: '150px',
              marginBottom: '10px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Beautiful Heart Shape */}
            <div style={{
              fontSize: '120px',
              color: '#ff6b9d',
              textAlign: 'center',
              filter: 'drop-shadow(0 0 30px rgba(255, 107, 157, 0.4))'
            }}>
              💖
            </div>
          </motion.div>
          <div style={{
            color: '#ff6b9d',
            fontSize: '16px',
            fontWeight: '600',
            fontStyle: 'italic'
          }}>
            {currentPartner.name}'s Heart
          </div>
        </div>
      </div>

      {/* Today's Sync Sessions */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: 'white',
          marginBottom: '20px',
          fontStyle: 'italic'
        }}>
          Today's Sync Sessions
        </h3>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#00ff88'
              }} />
              <span style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                2:14 PM
              </span>
              <span style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                fontStyle: 'italic'
              }}>
                Excited
              </span>
            </div>
            <div style={{
              textAlign: 'right'
            }}>
              <div style={{
                color: '#4ecdc4',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                94% sync
              </div>
              <div style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '12px'
              }}>
                3m 42s
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ffeb3b'
              }} />
              <span style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                11:28 AM
              </span>
              <span style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                fontStyle: 'italic'
              }}>
                Calm
              </span>
            </div>
            <div style={{
              textAlign: 'right'
            }}>
              <div style={{
                color: '#4ecdc4',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                87% sync
              </div>
              <div style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '12px'
              }}>
                2m 15s
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#00ff88'
              }} />
              <span style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                9:45 AM
              </span>
              <span style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                fontStyle: 'italic'
              }}>
                Romantic
              </span>
            </div>
            <div style={{
              textAlign: 'right'
            }}>
              <div style={{
                color: '#4ecdc4',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                91% sync
              </div>
              <div style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '12px'
              }}>
                5m 01s
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}