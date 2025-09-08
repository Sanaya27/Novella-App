import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Play, Pause, Volume2, Heart, Sparkles } from 'lucide-react';

const moodColors = {
    happy: '#f59e0b',
    romantic: '#ec4899',
    calm: '#06b6d4',
    excited: '#ef4444',
    dreamy: '#8b5cf6',
    playful: '#10b981'
};

const moodEmojis = {
    happy: '😊',
    romantic: '😍',
    calm: '😌',
    excited: '🤩',
    dreamy: '😍',
    playful: '😄'
};

export default function VoiceMood() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentMood, setCurrentMood] = useState('happy');
    const [voiceMessages, setVoiceMessages] = useState([
        {
            id: 1,
            mood: 'romantic',
            duration: '0:15',
            timestamp: '2 hours ago',
            waveform: [20, 45, 30, 60, 40, 55, 35, 50, 25, 40]
        },
        {
            id: 2,
            mood: 'excited',
            duration: '0:23',
            timestamp: '1 day ago',
            waveform: [15, 55, 40, 70, 35, 65, 45, 60, 30, 50]
        }
    ]);
    const [recordingTime, setRecordingTime] = useState(0);
    const recordingInterval = useRef(null);

    useEffect(() => {
        if (isRecording) {
            recordingInterval.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(recordingInterval.current);
        }
        
        return () => clearInterval(recordingInterval.current);
    }, [isRecording]);

    const startRecording = () => {
        setIsRecording(true);
        setRecordingTime(0);
        // Simulate recording
    };

    const stopRecording = () => {
        setIsRecording(false);
        // Simulate saving the recording
        const newMessage = {
            id: voiceMessages.length + 1,
            mood: currentMood,
            duration: `0:${recordingTime.toString().padStart(2, '0')}`,
            timestamp: 'Just now',
            waveform: Array.from({ length: 10 }, () => Math.floor(Math.random() * 70) + 15)
        };
        setVoiceMessages([newMessage, ...voiceMessages]);
        setRecordingTime(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{
            minHeight: '100vh',
            padding: '16px',
            paddingTop: '40px'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '32px' }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                }}>
                    <motion.div
                        animate={{
                            scale: isRecording ? [1, 1.2, 1] : 1,
                            rotate: isRecording ? [0, 5, -5, 0] : 0
                        }}
                        transition={{
                            duration: 0.5,
                            repeat: isRecording ? Infinity : 0
                        }}
                    >
                        <Mic style={{
                            width: '48px',
                            height: '48px',
                            color: moodColors[currentMood]
                        }} />
                    </motion.div>
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: 'bold',
                        background: `linear-gradient(to right, ${moodColors[currentMood]}, #ec4899)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0,
                        fontStyle: 'italic'
                    }} className="satoshi">
                        Voice Mood
                    </h1>
                </div>
                
                <p style={{
                    color: '#c4b5fd',
                    fontStyle: 'italic',
                    marginBottom: '24px'
                }}>
                    Express your emotions through voice and share your mood
                </p>

                {/* Mood Selector */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginBottom: '32px'
                }}>
                    {Object.entries(moodColors).map(([mood, color]) => (
                        <motion.button
                            key={mood}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentMood(mood)}
                            style={{
                                background: currentMood === mood 
                                    ? `linear-gradient(135deg, ${color}, ${color}aa)` 
                                    : 'rgba(255, 255, 255, 0.1)',
                                border: `2px solid ${currentMood === mood ? color : 'rgba(255, 255, 255, 0.2)'}`,
                                borderRadius: '20px',
                                padding: '8px 16px',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                textTransform: 'capitalize'
                            }}
                        >
                            <span>{moodEmojis[mood]}</span>
                            {mood}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Recording Interface */}
            <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '32px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                textAlign: 'center',
                marginBottom: '32px'
            }}>
                {/* Visual Waveform */}
                {isRecording && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'end',
                        gap: '2px',
                        height: '60px',
                        marginBottom: '24px'
                    }}>
                        {Array.from({ length: 20 }).map((_, i) => (
                            <motion.div
                                key={i}
                                style={{
                                    width: '3px',
                                    background: `linear-gradient(to top, ${moodColors[currentMood]}, ${moodColors[currentMood]}aa)`,
                                    borderRadius: '2px',
                                    minHeight: '4px'
                                }}
                                animate={{
                                    height: [`${Math.random() * 40 + 10}px`, `${Math.random() * 60 + 20}px`]
                                }}
                                transition={{
                                    duration: 0.3,
                                    repeat: Infinity,
                                    repeatType: 'reverse',
                                    delay: i * 0.05
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Recording Timer */}
                {isRecording && (
                    <div style={{
                        color: moodColors[currentMood],
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '24px',
                        fontStyle: 'italic'
                    }}>
                        {formatTime(recordingTime)}
                    </div>
                )}

                {/* Record Button */}
                <motion.button
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                        scale: isRecording ? [1, 1.1, 1] : 1,
                        boxShadow: isRecording 
                            ? [`0 0 0 0 ${moodColors[currentMood]}44`, `0 0 0 20px ${moodColors[currentMood]}00`]
                            : 'none'
                    }}
                    transition={{
                        duration: isRecording ? 1 : 0.2,
                        repeat: isRecording ? Infinity : 0
                    }}
                    style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: isRecording 
                            ? `linear-gradient(135deg, ${moodColors[currentMood]}, #ec4899)` 
                            : 'rgba(255, 255, 255, 0.1)',
                        border: `3px solid ${moodColors[currentMood]}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        marginBottom: '16px'
                    }}
                >
                    {isRecording ? (
                        <MicOff style={{
                            width: '40px',
                            height: '40px',
                            color: 'white'
                        }} />
                    ) : (
                        <Mic style={{
                            width: '40px',
                            height: '40px',
                            color: moodColors[currentMood]
                        }} />
                    )}
                </motion.button>

                <p style={{
                    color: '#c4b5fd',
                    fontStyle: 'italic',
                    fontSize: '14px',
                    margin: 0
                }}>
                    {isRecording ? 'Release to stop recording' : `Hold to record a ${currentMood} mood message`}
                </p>
            </div>

            {/* Voice Messages History */}
            <div style={{
                paddingBottom: '100px'
            }}>
                <h3 style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    fontStyle: 'italic'
                }}>Your Voice Moods</h3>
                
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    <AnimatePresence>
                        {voiceMessages.map((message, index) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ delay: index * 0.1 }}
                                style={{
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    border: `1px solid ${moodColors[message.mood]}40`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${moodColors[message.mood]}, ${moodColors[message.mood]}aa)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px'
                                }}>
                                    {moodEmojis[message.mood]}
                                </div>
                                
                                <div style={{
                                    flex: 1
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '4px'
                                    }}>
                                        <span style={{
                                            color: 'white',
                                            fontWeight: '600',
                                            textTransform: 'capitalize'
                                        }}>{message.mood} Mood</span>
                                        <span style={{
                                            color: '#c4b5fd',
                                            fontSize: '12px'
                                        }}>{message.duration}</span>
                                    </div>
                                    
                                    {/* Mini Waveform */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'end',
                                        gap: '1px',
                                        height: '20px'
                                    }}>
                                        {message.waveform.map((height, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    width: '2px',
                                                    height: `${height}%`,
                                                    background: `${moodColors[message.mood]}aa`,
                                                    borderRadius: '1px'
                                                }}
                                            />
                                        ))}
                                    </div>
                                    
                                    <span style={{
                                        color: '#9ca3af',
                                        fontSize: '12px'
                                    }}>{message.timestamp}</span>
                                </div>
                                
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        padding: '8px',
                                        cursor: 'pointer',
                                        color: moodColors[message.mood]
                                    }}
                                >
                                    <Play style={{ width: '16px', height: '16px' }} />
                                </motion.button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}