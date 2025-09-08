import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Activity, Timer } from 'lucide-react';

export default function HeartSync() {
    const [myBpm, setMyBpm] = useState(72);
    const [partnerBpm, setPartnerBpm] = useState(78);
    const [syncMode, setSyncMode] = useState(false);
    const [syncLevel, setSyncLevel] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (syncMode) {
                // Simulate heart sync
                const targetSync = Math.min(syncLevel + 2, 100);
                setSyncLevel(targetSync);
                
                // Gradually sync the BPMs
                const avgBpm = (myBpm + partnerBpm) / 2;
                setMyBpm(prev => prev + (avgBpm - prev) * 0.1);
                setPartnerBpm(prev => prev + (avgBpm - prev) * 0.1);
            } else {
                // Natural variation when not syncing
                setMyBpm(prev => 70 + Math.sin(Date.now() / 1000) * 5);
                setPartnerBpm(prev => 75 + Math.cos(Date.now() / 1200) * 6);
            }
        }, 100);
        
        return () => clearInterval(interval);
    }, [syncMode, myBpm, partnerBpm, syncLevel]);

    return (
        <div style={{
            minHeight: '100vh',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}
            >
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 60 / ((myBpm + partnerBpm) / 2), repeat: Infinity }}
                    style={{
                        fontSize: '96px',
                        marginBottom: '16px',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Heart style={{
                        width: '64px',
                        height: '64px',
                        color: '#f87171',
                        fill: 'currentColor'
                    }} />
                </motion.div>
                
                <h1 style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(to right, #f87171, #ec4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '16px',
                    fontStyle: 'italic'
                }} className="satoshi">
                    HeartSync
                </h1>
                
                <p style={{
                    color: '#c4b5fd',
                    fontStyle: 'italic',
                    marginBottom: '32px'
                }}>
                    Synchronize your heartbeats for deeper connection
                </p>

                {/* Heart Rate Display */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                    gap: '16px'
                }}>
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '16px',
                        padding: '16px',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        flex: 1,
                        textAlign: 'center'
                    }}>
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 60 / myBpm, repeat: Infinity }}
                        >
                            <Heart style={{
                                width: '24px',
                                height: '24px',
                                color: '#22d3ee',
                                fill: 'currentColor',
                                margin: '0 auto 8px'
                            }} />
                        </motion.div>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: 'white',
                            fontStyle: 'italic'
                        }}>{Math.round(myBpm)}</div>
                        <div style={{
                            fontSize: '12px',
                            color: '#c4b5fd',
                            fontStyle: 'italic'
                        }}>You</div>
                    </div>
                    
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '16px',
                        padding: '16px',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        flex: 1,
                        textAlign: 'center'
                    }}>
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 60 / partnerBpm, repeat: Infinity }}
                        >
                            <Heart style={{
                                width: '24px',
                                height: '24px',
                                color: '#ec4899',
                                fill: 'currentColor',
                                margin: '0 auto 8px'
                            }} />
                        </motion.div>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: 'white',
                            fontStyle: 'italic'
                        }}>{Math.round(partnerBpm)}</div>
                        <div style={{
                            fontSize: '12px',
                            color: '#c4b5fd',
                            fontStyle: 'italic'
                        }}>Partner</div>
                    </div>
                </div>

                {/* Sync Level */}
                {syncMode && (
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '16px',
                        padding: '16px',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        marginBottom: '24px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            marginBottom: '8px'
                        }}>
                            <Activity style={{ width: '20px', height: '20px', color: '#22d3ee' }} />
                            <span style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontStyle: 'italic'
                            }}>Sync Level: {Math.round(syncLevel)}%</span>
                        </div>
                        <div style={{
                            width: '100%',
                            height: '8px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <motion.div
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(to right, #22d3ee, #ec4899)',
                                    borderRadius: '4px'
                                }}
                                animate={{ width: `${syncLevel}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                )}

                {/* Sync Button */}
                <motion.button
                    onClick={() => {
                        setSyncMode(!syncMode);
                        if (!syncMode) setSyncLevel(0);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        width: '100%',
                        background: syncMode 
                            ? 'linear-gradient(to right, #ef4444, #dc2626)' 
                            : 'linear-gradient(to right, #22d3ee, #ec4899)',
                        border: 'none',
                        borderRadius: '16px',
                        padding: '16px',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        fontStyle: 'italic',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    {syncMode ? (
                        <>
                            <Timer style={{ width: '20px', height: '20px' }} />
                            Stop Syncing
                        </>
                    ) : (
                        <>
                            <Users style={{ width: '20px', height: '20px' }} />
                            Start Heart Sync
                        </>
                    )}
                </motion.button>
                
                <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    marginTop: '24px'
                }}>
                    <p style={{
                        color: 'white',
                        fontStyle: 'italic',
                        margin: 0,
                        lineHeight: '1.5'
                    }}>
                        {syncMode 
                            ? "Breathe deeply and feel your hearts synchronizing. The closer your heart rates become, the stronger your connection grows." 
                            : "Connect with your match and experience the magic of synchronized heartbeats. This creates a unique bond that brings you closer together."}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}