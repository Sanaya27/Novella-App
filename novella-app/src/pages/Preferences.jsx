import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ArrowLeft, Heart, Users } from 'lucide-react';

export default function Preferences() {
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const navigate = useNavigate();
  const { user, saveUser } = useUser();

  const preferenceOptions = [
    {
      id: 'men',
      label: 'Men',
      description: 'I\'m interested in men',
      icon: '👨'
    },
    {
      id: 'women',
      label: 'Women',
      description: 'I\'m interested in women',
      icon: '👩'
    },
    {
      id: 'lgbtq+',
      label: 'LGBTQ+',
      description: 'I\'m interested in LGBTQ+ community',
      icon: '🏳️‍🌈'
    },
    {
      id: 'everyone',
      label: 'Everyone',
      description: 'I\'m open to all connections',
      icon: '🌍'
    }
  ];

  const togglePreference = (preferenceId) => {
    setSelectedPreferences(prev => {
      if (prev.includes(preferenceId)) {
        return prev.filter(id => id !== preferenceId);
      } else {
        return [...prev, preferenceId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedPreferences.length > 0) {
      const updatedUser = {
        ...user,
        preferences: selectedPreferences,
        setupCompleted: true,
        joinedAt: new Date().toISOString()
      };
      saveUser(updatedUser);
      navigate('/home');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #581c87, #7c3aed, #312e81)',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '40px',
        maxWidth: '800px',
        margin: '0 auto 40px auto'
      }}>
        <button
          onClick={() => navigate('/who-you-are')}
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
            fontSize: '28px',
            fontWeight: '700',
            color: 'white',
            margin: '0 0 4px 0'
          }}>
            Find the hearts that beat in sync with yours
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0
          }}>
            Choose who you'd like to connect with (you can select multiple)
          </p>
        </div>
      </div>

      {/* Preference Options */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {preferenceOptions.map((option) => {
            const isSelected = selectedPreferences.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => togglePreference(option.id)}
                style={{
                  background: isSelected 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: isSelected 
                    ? '2px solid rgba(255, 255, 255, 0.5)' 
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  width: '100%',
                  minHeight: '120px',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected 
                    ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
                    : '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.transform = 'scale(1.01)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    fontSize: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)'
                  }}>
                    {option.icon}
                  </span>
                  <div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'white',
                      margin: '0 0 4px 0'
                    }}>
                      {option.label}
                    </h3>
                    {isSelected && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Heart size={14} style={{ color: '#ff6b9d', fill: '#ff6b9d' }} />
                        <span style={{
                          fontSize: '12px',
                          color: '#ff6b9d',
                          fontWeight: '500'
                        }}>
                          Selected
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected count and info */}
        {selectedPreferences.length > 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <Users size={20} style={{ color: '#ff6b9d' }} />
              <span style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'white'
              }}>
                {selectedPreferences.length} preference{selectedPreferences.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0
            }}>
              We'll help you find meaningful connections with people who match your interests
            </p>
          </div>
        )}

        {/* Continue Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button
            onClick={handleContinue}
            disabled={selectedPreferences.length === 0}
            style={{
              padding: '16px 40px',
              borderRadius: '12px',
              border: 'none',
              background: selectedPreferences.length > 0 
                ? 'linear-gradient(45deg, #7c3aed, #312e81)' 
                : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: selectedPreferences.length > 0 ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              boxShadow: selectedPreferences.length > 0 
                ? '0 4px 15px rgba(0, 0, 0, 0.2)' 
                : 'none',
              opacity: selectedPreferences.length > 0 ? 1 : 0.6,
              minWidth: '200px',
              minHeight: '52px'
            }}
            onMouseEnter={(e) => {
              if (selectedPreferences.length > 0) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedPreferences.length > 0) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
              }
            }}
          >
            Start My Journey
          </button>
        </div>

        {/* Progress indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '40px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.5)'
          }} />
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.5)'
          }} />
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'white'
          }} />
        </div>
      </div>
    </div>
  );
}