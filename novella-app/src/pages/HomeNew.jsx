import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Heart, Sparkles, X } from 'lucide-react';
import { useUser } from '../context/UserContext';
import ButterflyAnimation from '../components/dating/ButterflyAnimation';

// Sample profiles data
const sampleProfiles = [
  {
    id: 1,
    name: 'Lily Chen',
    age: 26,
    bio: 'Dancing through life with butterflies in my heart 🦋',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    distance: '2 miles away',
    syncPercentage: 87
  },
  {
    id: 2,
    name: 'Sofia Luna',
    age: 24,
    bio: 'Artist & dreamer seeking authentic connections ✨',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    distance: '5 miles away',
    syncPercentage: 94
  },
  {
    id: 3,
    name: 'Zara Moon',
    age: 28,
    bio: 'Yoga instructor with a wild heart 🌙',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    distance: '1 mile away',
    syncPercentage: 76
  },
  {
    id: 4,
    name: 'Aria Chen',
    age: 25,
    bio: 'Musician who believes in soul connections 🎵',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    distance: '3 miles away',
    syncPercentage: 82
  },
  {
    id: 5,
    name: 'Emma Rodriguez',
    age: 27,
    bio: 'Coffee lover & late-night coder who dreams in algorithms',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400',
    distance: '2.3 km away',
    syncPercentage: 88
  },
  {
    id: 6,
    name: 'Madison Cooper',
    age: 25,
    bio: 'Adventure seeker with a wild heart and gentle soul',
    photo: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400',
    distance: '1.5 km away',
    syncPercentage: 91
  }
];

export default function Home() {
  const [profiles] = useState(sampleProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [passedProfiles, setPassedProfiles] = useState(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [butterflyAnimations, setButterflyAnimations] = useState([]);
  const navigate = useNavigate();
  const { user } = useUser();

  const currentProfile = profiles[currentIndex];
  const allProfilesPassed = passedProfiles.size >= profiles.length;

  // Butterfly animation when Flutter is pressed
  const triggerButterflyAnimation = () => {
    console.log('🦋 Triggering butterfly animation!');
    // Create enhanced butterfly animation with natural movement (same as sync page)
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
    
    console.log('🦋 Created butterflies:', newButterflies);
    setButterflyAnimations(newButterflies);
    
    setTimeout(() => {
      console.log('🦋 Clearing butterflies');
      setButterflyAnimations([]);
    }, 3000); // Increased duration to match sync page
  };

  const handleAction = (action) => {
    if (isAnimating || allProfilesPassed) return;
    
    setIsAnimating(true);
    
    if (action === 'flutter') {
      triggerButterflyAnimation();
      setTimeout(() => {
        navigate(`/sync/${currentProfile.id}`);
      }, 600);
    } else {
      // Mark current profile as passed
      setPassedProfiles(prev => new Set([...prev, currentProfile.id]));
      
      setTimeout(() => {
        // Find next unviewed profile
        let nextIndex = -1;
        for (let i = 0; i < profiles.length; i++) {
          if (!passedProfiles.has(profiles[i].id) && profiles[i].id !== currentProfile.id) {
            nextIndex = i;
            break;
          }
        }
        
        if (nextIndex !== -1) {
          setCurrentIndex(nextIndex);
        }
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #6B46C1 0%, #9333EA 50%, #EC4899 100%)'
    }}>
      {/* Butterfly animations */}
      <AnimatePresence>
        {butterflyAnimations.map((butterfly) => {
          console.log('🦋 Rendering butterfly:', butterfly);
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
                  bpm={120}
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
        padding: '20px',
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(20px)'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #22d3ee, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 8px 0',
          fontStyle: 'italic'
        }}>
          Novella
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#22d3ee',
          fontStyle: 'italic',
          fontWeight: '600',
          margin: '0 0 12px 0'
        }}>
          Where Hearts Sync and Stories Begin
        </p>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.8)',
          margin: 0
        }}>
          Welcome, {user?.fullName || 'Explorer'}
        </p>
      </div>

      {/* Profile Card */}
      <div style={{
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <AnimatePresence mode="wait">
          {allProfilesPassed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: 'center',
                color: 'white',
                padding: '40px'
              }}
            >
              <div style={{
                fontSize: '60px',
                marginBottom: '20px'
              }}>
                🦋
              </div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '12px',
                background: 'linear-gradient(to right, #22d3ee, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                That's all for now
              </h2>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontStyle: 'italic'
              }}>
                Come back later
              </p>
            </motion.div>
          ) : currentProfile && (
            <motion.div
              key={currentProfile.id}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                width: '100%',
                maxWidth: '400px',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* Profile Image */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '400px',
                overflow: 'hidden'
              }}>
                <img
                  src={currentProfile.photo}
                  alt={currentProfile.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '60%',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'
                }} />
                
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Sparkles size={14} style={{ color: '#ff6b9d' }} />
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'white'
                  }}>
                    {currentProfile.syncPercentage}% sync
                  </span>
                </div>
              </div>

              {/* Profile Info */}
              <div style={{
                padding: '24px',
                color: 'white'
              }}>
                <div style={{
                  marginBottom: '16px'
                }}>
                  <h2 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    margin: '0 0 8px 0'
                  }}>
                    {currentProfile.name}, {currentProfile.age}
                  </h2>
                  <p style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: '0 0 12px 0',
                    lineHeight: '1.4'
                  }}>
                    {currentProfile.bio}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <MapPin size={14} style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                    <span style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>
                      {currentProfile.distance}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  justifyContent: 'center'
                }}>
                  <motion.button
                    onClick={() => handleAction('pass')}
                    disabled={isAnimating}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      flex: 1,
                      padding: '16px',
                      borderRadius: '12px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(0, 0, 0, 0.3)',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: isAnimating ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      minHeight: '52px',
                      opacity: isAnimating ? 0.6 : 1
                    }}
                  >
                    <X size={20} />
                    Pass
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleAction('flutter')}
                    disabled={isAnimating}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      flex: 1,
                      padding: '16px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(45deg, #ff6b9d, #ff8fab)',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: isAnimating ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      minHeight: '52px',
                      boxShadow: '0 4px 15px rgba(255, 107, 157, 0.4)',
                      opacity: isAnimating ? 0.6 : 1
                    }}
                  >
                    <Heart size={20} fill="currentColor" />
                    Flutter
                  </motion.button>
                </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}