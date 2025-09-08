import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Heart, Camera, LogOut, Shield, Bell } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function Profile() {
  const { user, logout } = useUser();

  const stats = [
    { label: 'Heart Syncs', value: '24', icon: Heart },
    { label: 'Butterflies Collected', value: '12', icon: '🦋' },
    { label: 'Perfect Matches', value: '3', icon: '✨' },
    { label: 'Stories Shared', value: '8', icon: '📖' }
  ];

  const menuItems = [
    { icon: Settings, label: 'Account Settings', action: () => {} },
    { icon: Bell, label: 'Notifications', action: () => {} },
    { icon: Shield, label: 'Privacy & Safety', action: () => {} },
    { icon: Camera, label: 'Manage Photos', action: () => {} },
    { icon: LogOut, label: 'Sign Out', action: logout, danger: true }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      padding: '0',
      color: 'white'
    }}>
      {/* Profile Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        padding: '40px 20px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            border: '4px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <User size={48} />
        </motion.div>
        
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          margin: '0 0 8px 0'
        }}>
          {user?.fullName || 'Your Name'}
        </h1>
        
        <p style={{
          fontSize: '16px',
          opacity: 0.8,
          margin: '0 0 4px 0'
        }}>
          {user?.bio || 'Your story begins here...'}
        </p>
        
        <p style={{
          fontSize: '14px',
          opacity: 0.6,
          margin: 0
        }}>
          {user?.identity || 'Identity'} • Looking for {user?.preferences?.join(', ') || 'Connections'}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        padding: '30px 20px',
        background: 'rgba(255, 255, 255, 0.05)'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          margin: '0 0 20px 0',
          textAlign: 'center'
        }}>
          Your Novella Journey
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div style={{
                fontSize: '24px',
                marginBottom: '8px'
              }}>
                {typeof stat.icon === 'string' ? stat.icon : <stat.icon size={24} />}
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                margin: '0 0 4px 0'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '12px',
                opacity: 0.8
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div style={{
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={item.action}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '16px 20px',
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center',
                color: item.danger ? '#ff6b6b' : 'white',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              whileHover={{
                background: item.danger ? 'rgba(255, 107, 107, 0.1)' : 'rgba(255, 255, 255, 0.15)',
                scale: 1.02
              }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon size={20} style={{ marginRight: '16px' }} />
              {item.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        opacity: 0.6,
        fontSize: '14px'
      }}>
        <p style={{ margin: '0 0 8px 0' }}>
          Novella v1.0 • Where hearts sync and stories begin
        </p>
        <p style={{ margin: 0 }}>
          Made with 💜 for authentic connections
        </p>
      </div>
    </div>
  );
}