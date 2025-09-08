import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ArrowLeft, Heart } from 'lucide-react';

export default function WhoYouAre() {
  const [selectedIdentity, setSelectedIdentity] = useState('');
  const navigate = useNavigate();
  const { user, saveUser } = useUser();

  const identityOptions = [
    {
      id: 'male',
      label: 'Male',
      description: 'I identify as male',
      icon: '♂️'
    },
    {
      id: 'female',
      label: 'Female',
      description: 'I identify as female',
      icon: '♀️'
    },
    {
      id: 'non-binary',
      label: 'Non-binary',
      description: 'I identify as non-binary',
      icon: '⚧️'
    },
    {
      id: 'other',
      label: 'Other',
      description: 'I identify differently',
      icon: '✨'
    }
  ];

  const handleContinue = () => {
    if (selectedIdentity) {
      const updatedUser = {
        ...user,
        identity: selectedIdentity
      };
      saveUser(updatedUser);
      navigate('/preferences');
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
          onClick={() => navigate('/login')}
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
            Every identity is beautiful
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0
          }}>
            Help us create a welcoming space for you
          </p>
        </div>
      </div>

      {/* Identity Options */}
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
          {identityOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedIdentity(option.id)}
              style={{
                background: selectedIdentity === option.id 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: selectedIdentity === option.id 
                  ? '2px solid rgba(255, 255, 255, 0.5)' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                width: '100%',
                minHeight: '120px',
                transform: selectedIdentity === option.id ? 'scale(1.02)' : 'scale(1)',
                boxShadow: selectedIdentity === option.id 
                  ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
                  : '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                if (selectedIdentity !== option.id) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'scale(1.01)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedIdentity !== option.id) {
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
                  {selectedIdentity === option.id && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Heart size={14} style={{ color: '#ff6b9d' }} />
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
          ))}
        </div>

        {/* Continue Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button
            onClick={handleContinue}
            disabled={!selectedIdentity}
            style={{
              padding: '16px 40px',
              borderRadius: '12px',
              border: 'none',
              background: selectedIdentity 
                ? 'linear-gradient(45deg, #667eea, #764ba2)' 
                : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: selectedIdentity ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              boxShadow: selectedIdentity 
                ? '0 4px 15px rgba(0, 0, 0, 0.2)' 
                : 'none',
              opacity: selectedIdentity ? 1 : 0.6,
              minWidth: '200px',
              minHeight: '52px'
            }}
            onMouseEnter={(e) => {
              if (selectedIdentity) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedIdentity) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
              }
            }}
          >
            Continue to Preferences
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
            background: 'white'
          }} />
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.3)'
          }} />
        </div>
      </div>
    </div>
  );
}