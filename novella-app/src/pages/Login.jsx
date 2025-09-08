import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { Heart, Sparkles } from 'lucide-react';

export default function Login() {
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { saveUser } = useUser();

  const validateForm = () => {
    const newErrors = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (bio.trim().length > 80) {
      newErrors.bio = 'Bio must be 80 characters or less';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Add a small delay for smooth transition
      setTimeout(() => {
        const userData = {
          fullName: fullName.trim(),
          bio: bio.trim(),
          createdAt: new Date().toISOString()
        };
        
        saveUser(userData);
        navigate('/who-you-are');
      }, 500);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #581c87, #7c3aed, #312e81)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        fontSize: '2rem',
        opacity: 0.1,
        animation: 'float 6s ease-in-out infinite'
      }}>💕</div>
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '15%',
        fontSize: '1.5rem',
        opacity: 0.1,
        animation: 'float 4s ease-in-out infinite reverse'
      }}>✨</div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '20%',
        fontSize: '1.8rem',
        opacity: 0.1,
        animation: 'float 5s ease-in-out infinite'
      }}>🦋</div>
      
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          padding: '48px',
          width: '100%',
          maxWidth: '480px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.3)',
          position: 'relative'
        }}
      >
        {/* Decorative border glow */}
        <div style={{
          position: 'absolute',
          inset: '-2px',
          background: 'linear-gradient(45deg, #7c3aed, #312e81, #7c3aed)',
          borderRadius: '32px',
          opacity: 0.3,
          zIndex: -1,
          animation: 'spin 3s linear infinite'
        }} />
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <Heart style={{
                width: '40px',
                height: '40px',
                color: '#ff6b9d',
                filter: 'drop-shadow(0 0 8px rgba(255, 107, 157, 0.6))'
              }} />
            </motion.div>
            
            <h1 style={{
              fontSize: '48px',
              fontWeight: '700',
              color: 'transparent',
              backgroundImage: 'linear-gradient(45deg, #fff, #f0f8ff, #e6f3ff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              margin: 0,
              fontStyle: 'italic',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Novella
            </h1>
            
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 15, -10, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1
              }}
            >
              <Sparkles style={{
                width: '36px',
                height: '36px',
                color: '#4ecdc4',
                filter: 'drop-shadow(0 0 6px rgba(78, 205, 196, 0.6))'
              }} />
            </motion.div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.95)',
              margin: '0 0 12px 0',
              fontWeight: '500',
              fontStyle: 'italic'
            }}
          >
            Where hearts sync and stories begin
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0,
              lineHeight: '1.6',
              fontStyle: 'italic'
            }}
          >
            Welcome to a different kind of dating experience.<br />
            Let's start with getting to know the real you.
          </motion.p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          onSubmit={handleSubmit}
          style={{ width: '100%' }}
        >
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontSize: '15px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '10px',
              fontStyle: 'italic'
            }}>
              ✨ Full Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '16px',
                border: errors.fullName ? '2px solid #ff6b6b' : '2px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                fontStyle: 'italic'
              }}
            />
            <AnimatePresence>
              {errors.fullName && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    fontSize: '13px',
                    color: '#ff6b6b',
                    marginTop: '6px',
                    marginBottom: 0,
                    fontStyle: 'italic'
                  }}
                >
                  {errors.fullName}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div style={{ marginBottom: '36px' }}>
            <label style={{
              display: 'block',
              fontSize: '15px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '10px',
              fontStyle: 'italic'
            }}>
              💭 Bio (max 80 characters)
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.02 }}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your personality in one line..."
              maxLength={80}
              rows={3}
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '16px',
                border: errors.bio ? '2px solid #ff6b6b' : '2px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
                resize: 'vertical',
                minHeight: '90px',
                fontFamily: 'inherit',
                backdropFilter: 'blur(10px)',
                fontStyle: 'italic'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '6px'
            }}>
              <AnimatePresence>
                {errors.bio ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      fontSize: '13px',
                      color: '#ff6b6b',
                      margin: 0,
                      fontStyle: 'italic'
                    }}
                  >
                    {errors.bio}
                  </motion.p>
                ) : (
                  <div />
                )}
              </AnimatePresence>
              <span style={{
                fontSize: '13px',
                color: bio.length > 70 ? '#ff6b6b' : 'rgba(255, 255, 255, 0.6)',
                fontStyle: 'italic'
              }}>
                {bio.length}/80
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!fullName.trim() || !bio.trim() || isSubmitting}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '16px',
              border: 'none',
              background: isSubmitting 
                ? 'rgba(255, 255, 255, 0.3)'
                : 'linear-gradient(45deg, #7c3aed, #312e81)',
              color: 'white',
              fontSize: '17px',
              fontWeight: '700',
              cursor: (!fullName.trim() || !bio.trim() || isSubmitting) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
              minHeight: '56px',
              fontStyle: 'italic',
              opacity: (!fullName.trim() || !bio.trim()) ? 0.6 : 1
            }}
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >
                ✨
              </motion.div>
            ) : (
              '✨ Continue to Identity'
            )}
          </motion.button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
            marginTop: '28px',
            lineHeight: '1.5',
            fontStyle: 'italic'
          }}
        >
          Your data is stored locally and private.<br />
          We believe in meaningful connections, not data collection. 💕
        </motion.p>
      </motion.div>
    </div>
  );
}