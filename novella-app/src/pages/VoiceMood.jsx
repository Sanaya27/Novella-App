import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send } from 'lucide-react';

const moodSpectrum = {
    'golden_pollen': {
        name: 'Golden Pollen',
        emoji: '✨',
        description: 'Flirty and playful',
        color: '#fbbf24',
        gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)'
    },
    'blue_mist': {
        name: 'Blue Mist', 
        emoji: '🌊',
        description: 'Calm and serene',
        color: '#06b6d4',
        gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)'
    },
    'silver_whisper': {
        name: 'Silver Whisper',
        emoji: '🌙',
        description: 'Mysterious and intimate',
        color: '#64748b',
        gradient: 'linear-gradient(135deg, #64748b, #475569)'
    },
    'rose_ember': {
        name: 'Rose Ember',
        emoji: '🔥',
        description: 'Passionate and intense',
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #ec4899, #db2777)'
    }
};

const recentMessages = [
    {
        id: 1,
        mood: 'golden_pollen',
        analysis: 'Excited and flirty energy detected',
        timestamp: '2:14 PM',
        duration: '0:15'
    },
    {
        id: 2,
        mood: 'blue_mist',
        analysis: 'Calm and thoughtful tone',
        timestamp: '2:12 PM',
        duration: '0:23'
    }
];

export default function VoiceMood() {
    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzedMood, setAnalyzedMood] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
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

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const audioChunks = [];

            recorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                setAudioBlob(audioBlob);
                stream.getTracks().forEach(track => track.stop());
                analyzeVoice();
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
            setRecordingTime(0);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Please allow microphone access to record voice messages.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            setIsRecording(false);
            setIsAnalyzing(true);
        }
    };

    const analyzeVoice = () => {
        // Simulate voice analysis
        setTimeout(() => {
            const moods = Object.keys(moodSpectrum);
            const randomMood = moods[Math.floor(Math.random() * moods.length)];
            setAnalyzedMood(randomMood);
            setIsAnalyzing(false);
        }, 2000); // 2 second analysis
    };

    const sendVoiceMood = () => {
        if (analyzedMood) {
            // Here you would send the voice mood to the match
            console.log('Sending voice mood:', analyzedMood);
            alert(`Voice mood "${moodSpectrum[analyzedMood].name}" sent to your match!`);
            
            // Reset state
            setAnalyzedMood(null);
            setAudioBlob(null);
            setRecordingTime(0);
        }
    };

    const resetRecording = () => {
        setAnalyzedMood(null);
        setAudioBlob(null);
        setIsAnalyzing(false);
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
            paddingTop: '40px',
            background: 'linear-gradient(135deg, #6B46C1 0%, #9333EA 50%, #EC4899 100%)'
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
                    <h1 style={{
                        fontSize: '42px',
                        fontWeight: 'bold',
                        color: '#22d3ee',
                        margin: 0,
                        fontStyle: 'italic'
                    }}>
                        Voice Mood Analyzer
                    </h1>
                </div>
                
                <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontStyle: 'italic',
                    fontSize: '18px',
                    marginBottom: '0'
                }}>
                    Transform your voice into beautiful emotions
                </p>
            </motion.div>

            {/* Recording Interface */}
            <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '48px 32px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                textAlign: 'center',
                marginBottom: '32px',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {isRecording ? (
                    // Recording State
                    <>
                        <h2 style={{
                            color: '#22d3ee',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            fontStyle: 'italic'
                        }}>
                            Listening to your voice...
                        </h2>
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '16px',
                            marginBottom: '32px',
                            fontStyle: 'italic'
                        }}>
                            Analyzing emotional patterns
                        </p>
                        
                        {/* Animated Waveform */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'end',
                            gap: '3px',
                            height: '80px',
                            marginBottom: '32px'
                        }}>
                            {Array.from({ length: 12 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    style={{
                                        width: '6px',
                                        background: 'linear-gradient(to top, #22d3ee, #8b5cf6, #ec4899)',
                                        borderRadius: '3px',
                                        minHeight: '8px'
                                    }}
                                    animate={{
                                        height: [`${20 + Math.random() * 30}px`, `${40 + Math.random() * 40}px`]
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

                        {/* Recording Button - Active */}
                        <motion.button
                            onClick={stopRecording}
                            animate={{
                                scale: [1, 1.1, 1],
                                boxShadow: ['0 0 0 0 #ef444444', '0 0 0 20px #ef444400']
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity
                            }}
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: '#ef4444',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                marginBottom: '24px'
                            }}
                        >
                            <Mic style={{
                                width: '40px',
                                height: '40px',
                                color: 'white'
                            }} />
                        </motion.button>

                        <p style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontStyle: 'italic',
                            fontSize: '16px'
                        }}>
                            Recording voice patterns...
                        </p>
                        
                        <div style={{
                            color: '#22d3ee',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            marginTop: '16px'
                        }}>
                            {formatTime(recordingTime)}
                        </div>
                    </>
                ) : isAnalyzing ? (
                    // Analyzing State
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            style={{
                                width: '60px',
                                height: '60px',
                                border: '3px solid #22d3ee',
                                borderTop: '3px solid transparent',
                                borderRadius: '50%',
                                marginBottom: '24px'
                            }}
                        />
                        <h2 style={{
                            color: '#22d3ee',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            fontStyle: 'italic'
                        }}>
                            Analyzing your voice...
                        </h2>
                    </>
                ) : analyzedMood ? (
                    // Analysis Complete State
                    <>
                        {/* Floating Particles */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none'
                        }}>
                            {Array.from({ length: 15 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    style={{
                                        position: 'absolute',
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: `rgba(${Math.random() > 0.5 ? '34, 211, 238' : '139, 92, 246'}, 0.6)`,
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`
                                    }}
                                    animate={{
                                        y: [0, -20, 0],
                                        opacity: [0.3, 1, 0.3]
                                    }}
                                    transition={{
                                        duration: 2 + Math.random() * 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2
                                    }}
                                />
                            ))}
                        </div>

                        {/* Detected Mood */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{
                                textAlign: 'center',
                                marginBottom: '32px'
                            }}
                        >
                            <div style={{
                                fontSize: '80px',
                                marginBottom: '16px'
                            }}>
                                {moodSpectrum[analyzedMood].emoji}
                            </div>
                            <h2 style={{
                                color: moodSpectrum[analyzedMood].color,
                                fontSize: '32px',
                                fontWeight: 'bold',
                                marginBottom: '8px',
                                fontStyle: 'italic'
                            }}>
                                {moodSpectrum[analyzedMood].name}
                            </h2>
                            <p style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '18px',
                                fontStyle: 'italic'
                            }}>
                                {moodSpectrum[analyzedMood].description}
                            </p>
                        </motion.div>

                        {/* Send Button */}
                        <motion.button
                            onClick={sendVoiceMood}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                                border: 'none',
                                borderRadius: '16px',
                                padding: '16px 32px',
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '16px'
                            }}
                        >
                            <Send style={{ width: '20px', height: '20px' }} />
                            Send Voice Mood
                        </motion.button>

                        <p style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                            fontStyle: 'italic'
                        }}>
                            Mood analyzed! Send to your match
                        </p>
                        
                        <button
                            onClick={resetRecording}
                            style={{
                                background: 'transparent',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '14px',
                                cursor: 'pointer',
                                marginTop: '16px'
                            }}
                        >
                            Record Again
                        </button>
                    </>
                ) : (
                    // Initial State
                    <>
                        {/* Record Button */}
                        <motion.button
                            onClick={startRecording}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #22d3ee, #8b5cf6, #ec4899)',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                marginBottom: '24px'
                            }}
                        >
                            <Mic style={{
                                width: '48px',
                                height: '48px',
                                color: 'white'
                            }} />
                        </motion.button>

                        <p style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontStyle: 'italic',
                            fontSize: '16px',
                            margin: 0
                        }}>
                            Tap to record a voice message
                        </p>
                    </>
                )}
            </div>

            {/* Mood Spectrum */}
            {!analyzedMood && (
                <div style={{
                    marginBottom: '32px'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '24px',
                        fontStyle: 'italic',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        ✨ Mood Spectrum
                    </h2>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '16px'
                    }}>
                        {Object.entries(moodSpectrum).map(([key, mood]) => (
                            <motion.div
                                key={key}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: '16px',
                                    padding: '20px',
                                    border: `1px solid ${mood.color}40`,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '8px'
                                    }}>
                                        <span style={{ fontSize: '20px' }}>{mood.emoji}</span>
                                        <h3 style={{
                                            color: mood.color,
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            margin: 0,
                                            fontStyle: 'italic'
                                        }}>
                                            {mood.name}
                                        </h3>
                                    </div>
                                    <p style={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        fontSize: '14px',
                                        margin: 0,
                                        fontStyle: 'italic',
                                        textAlign: 'left'
                                    }}>
                                        {mood.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Voice Messages */}
            <div style={{
                paddingBottom: '100px'
            }}>
                <h3 style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                    fontStyle: 'italic'
                }}>
                    Recent Voice Messages
                </h3>
                
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    {recentMessages.map((message, index) => {
                        const mood = moodSpectrum[message.mood];
                        const isUser = index % 2 === 0; // Alternate between user and partner messages
                        return (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{
                                    display: 'flex',
                                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                                    marginBottom: '8px'
                                }}
                            >
                                <div style={{
                                    maxWidth: '95%',
                                    minWidth: '80%',
                                    background: isUser 
                                        ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                                        : `linear-gradient(135deg, ${mood.color}20, ${mood.color}30, rgba(0, 0, 0, 0.4))`,
                                    backdropFilter: 'blur(20px)',
                                    borderRadius: isUser 
                                        ? '20px 20px 4px 20px'
                                        : '20px 20px 20px 4px',
                                    padding: '20px 24px',
                                    border: isUser 
                                        ? 'none'
                                        : `1px solid ${mood.color}60`,
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        marginBottom: '8px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '4px'
                                            }}>
                                                <span style={{ fontSize: '20px' }}>{mood.emoji}</span>
                                                <h4 style={{
                                                    color: isUser ? 'white' : mood.color,
                                                    fontSize: '20px',
                                                    fontWeight: 'bold',
                                                    margin: 0,
                                                    fontStyle: 'italic'
                                                }}>
                                                    {mood.name}
                                                </h4>
                                            </div>
                                            <p style={{
                                                color: isUser ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.8)',
                                                fontSize: '16px',
                                                margin: 0,
                                                fontStyle: 'italic',
                                                lineHeight: '1.4'
                                            }}>
                                                {message.analysis}
                                            </p>
                                        </div>
                                        <span style={{
                                            color: isUser ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.6)',
                                            fontSize: '12px',
                                            fontStyle: 'italic',
                                            flexShrink: 0,
                                            marginLeft: '16px'
                                        }}>
                                            {message.timestamp}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}