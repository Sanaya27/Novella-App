import React, { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Camera, Flower, Star } from "lucide-react";
import ButterflyAnimation from "../components/dating/ButterflyAnimation";

// Add CSS animations for mystery effects
const styles = `
@keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
}

@keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
}

@keyframes mysteryFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-5px) rotate(5deg); }
}

@keyframes fadeInUp {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
}

@keyframes bounceIn {
    0% { opacity: 0; transform: scale(0.3); }
    50% { opacity: 1; transform: scale(1.05); }
    70% { transform: scale(0.9); }
    100% { opacity: 1; transform: scale(1); }
}

@keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 5px currentColor; }
    50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
}

/* Responsive breakpoints */
@media (max-width: 768px) {
    .garden-grid {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
    }
    .butterfly-card {
        padding: 12px !important;
    }
    .ar-button {
        padding: 10px 20px !important;
        font-size: 12px !important;
    }
}

@media (max-width: 480px) {
    .garden-header {
        font-size: 28px !important;
    }
    .garden-tagline {
        font-size: 16px !important;
    }
    .modal-content {
        margin: 8px !important;
        padding: 16px !important;
    }
}

/* Accessibility improvements */
.focus-visible {
    outline: 2px solid #22d3ee !important;
    outline-offset: 2px !important;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .butterfly-card {
        border-width: 2px !important;
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

export default function Garden() {
    const [arMode, setArMode] = useState(false);
    const [selectedSpecies, setSelectedSpecies] = useState(null);
    const [flyingButterflies, setFlyingButterflies] = useState([]);

    const butterflySpecies = useMemo(() => [
        { 
            id: 1, 
            name: "Azure Morpho", 
            rarity: "Common", 
            unlocked: true,
            color: "#4CC9F0",
            image: "https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1",
            description: "First connection butterflies - Born from your initial messages",
            requirement: "Send your first message"
        },
        { 
            id: 2, 
            name: "Golden Swallowtail", 
            rarity: "Common", 
            unlocked: true,
            color: "#FFD700",
            image: "https://images.pexels.com/photos/29529931/pexels-photo-29529931.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            description: "Deep conversation specialists - Flourish in meaningful chats",
            requirement: "Have a 10+ message conversation"
        },
        { 
            id: 3, 
            name: "Rose Monarch", 
            rarity: "Rare", 
            unlocked: true,
            color: "#FF6B9D",
            image: "https://images.pexels.com/photos/13044088/pexels-photo-13044088.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            description: "Romantic connection butterflies - Born from heartfelt moments",
            requirement: "Share 5 romantic messages"
        },
        { 
            id: 4, 
            name: "Emerald Glasswing", 
            rarity: "Rare", 
            unlocked: false,
            color: "#4ECDC4",
            image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&crop=faces",
            description: "Trust and vulnerability butterflies - Appear when hearts open",
            requirement: "Complete heart sync session"
        },
        { 
            id: 5, 
            name: "Phantom Twilight", 
            rarity: "Epic", 
            unlocked: false,
            color: "#A855F7",
            image: "https://images.unsplash.com/photo-1509057199576-632a47484ece?w=400&h=400&fit=crop&crop=faces",
            description: "Late night connection specialists - Born from midnight conversations",
            requirement: "Chat between 11PM-3AM for 3 days"
        },
        { 
            id: 6, 
            name: "Starfire Phoenix", 
            rarity: "Epic", 
            unlocked: false,
            color: "#F59E0B",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=faces",
            description: "Passionate bond butterflies - Ignited by intense connections",
            requirement: "Achieve 90%+ sync rate 5 times"
        },
        { 
            id: 7, 
            name: "Crystal Prism", 
            rarity: "Legendary", 
            unlocked: false,
            color: "#E0E7FF",
            image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop&crop=faces",
            description: "Perfect harmony butterflies - The rarest of all connections",
            requirement: "Maintain 95%+ sync for 10 minutes"
        },
        { 
            id: 8, 
            name: "Eternal Bond", 
            rarity: "Legendary", 
            unlocked: false,
            color: "#FF4500",
            image: "https://images.unsplash.com/photo-1588329336204-d8b3a3f2d7e9?w=400&h=400&fit=crop&crop=faces",
            description: "Timeless love butterflies - Symbol of unbreakable connection",
            requirement: "Complete all milestones and sync for 1 hour total"
        }
    ], []);

    const witheredFlowers = [
        { id: 1, name: "Sarah", reason: "No reply for 3 days", days: 3 },
        { id: 2, name: "Maya", reason: "Conversation ended", days: 7 },
    ];

    const rarityColors = {
        Common: "rgba(209, 213, 219, 1)", // text-gray-300
        Rare: "rgba(96, 165, 250, 1)",   // text-blue-400
        Epic: "rgba(196, 181, 253, 1)",  // text-purple-400
        Legendary: "rgba(251, 146, 60, 1)" // text-orange-400
    };

    // Function to generate flying butterflies in AR mode
    const generateFlyingButterflies = useCallback(() => {
        const butterflies = [];
        const unlockedSpecies = butterflySpecies.filter(s => s.unlocked);
        
        // Create 15 flying butterflies with random properties
        for (let i = 0; i < 15; i++) {
            const species = unlockedSpecies[Math.floor(Math.random() * unlockedSpecies.length)];
            butterflies.push({
                id: Date.now() + i,
                speciesId: species.id,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() > 0.7 ? 'large' : Math.random() > 0.4 ? 'medium' : 'small',
                color: species.color,
                speed: 0.5 + Math.random() * 0.5,
                delay: Math.random() * 2,
                direction: Math.random() > 0.5 ? 1 : -1
            });
        }
        
        console.log('Generating flying butterflies:', butterflies); // Debug log
        setFlyingButterflies(butterflies);
    }, [butterflySpecies]);

    // Generate butterflies when AR mode is activated
    useEffect(() => {
        if (arMode) {
            console.log('AR mode activated, generating butterflies'); // Debug log
            generateFlyingButterflies();
            // Regenerate butterflies every 8 seconds
            const interval = setInterval(() => {
                console.log('Regenerating butterflies'); // Debug log
                generateFlyingButterflies();
            }, 8000);
            return () => clearInterval(interval);
        } else {
            console.log('AR mode deactivated, clearing butterflies'); // Debug log
            setFlyingButterflies([]);
        }
    }, [arMode, generateFlyingButterflies]);

    return (
        <div 
            style={{
                minHeight: '100vh',
                padding: '16px',
                paddingTop: '64px',
                background: 'linear-gradient(135deg, #6B46C1 0%, #9333EA 50%, #EC4899 100%)'
            }}
            role="main"
            aria-label="Symbiosis Garden - Your butterfly collection"
        >
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                    textAlign: 'center',
                    marginBottom: '32px'
                }}
            >
                <h1 
                    className="garden-header"
                    style={{
                        fontSize: '36px',
                        fontWeight: 'bold',
                        background: 'linear-gradient(to right, #22d3ee, #ec4899)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '8px',
                        fontStyle: 'italic',
                        animation: 'fadeInUp 0.8s ease-out'
                    }}
                >
                    Symbiosis Garden
                </h1>
                <p 
                    className="garden-tagline"
                    style={{
                        color: '#22d3ee',
                        fontStyle: 'italic',
                        fontSize: '18px',
                        fontWeight: '600',
                        animation: 'fadeInUp 0.8s ease-out 0.2s both'
                    }}
                >
                    🦋 "Your collection of connection butterflies."
                </p>
            </motion.div>

            {/* AR Toggle */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{
                    textAlign: 'center',
                    marginBottom: '32px'
                }}
            >
                <button
                    className="ar-button focus-visible"
                    onClick={() => setArMode(!arMode)}
                    style={{
                        background: arMode 
                            ? 'linear-gradient(to right, #06b6d4, #ec4899)' 
                            : 'rgba(255, 255, 255, 0.1)',
                        border: arMode ? 'none' : '1px solid rgba(147, 51, 234, 0.3)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        fontStyle: 'italic',
                        transition: 'all 0.3s ease',
                        animation: arMode ? 'glowPulse 2s infinite' : 'none'
                    }}
                    aria-label={arMode ? 'Exit AR viewing mode' : 'Enter AR viewing mode'}
                    tabIndex={0}
                >
                    <Camera size={20} aria-hidden="true" />
                    {arMode ? 'Exit AR View' : 'Enter AR Mode'}
                </button>
            </motion.div>

            {/* AR Simulation */}
            {arMode ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        padding: '32px',
                        marginBottom: '32px',
                        border: '1px solid rgba(34, 211, 238, 0.5)',
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundImage: 'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800)', // Forest image
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundBlendMode: 'overlay'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <p style={{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '18px',
                            fontStyle: 'italic'
                        }}>
                            AR Garden View
                        </p>
                        <p style={{
                            color: '#22d3ee',
                            fontSize: '14px',
                            fontStyle: 'italic'
                        }}>
                            Butterflies projected into your space
                        </p>
                    </div>
                    
                    {/* Flying butterflies in AR */}
                    <div style={{
                        position: 'relative',
                        height: '256px',
                        overflow: 'hidden'
                    }}>
                        {/* Existing static butterflies */}
                        {butterflySpecies.filter(s => s.unlocked).map((species, index) => (
                            <motion.div
                                key={species.id}
                                style={{
                                    position: 'absolute',
                                    left: `${20 + index * 25}%`,
                                    top: `${30 + Math.sin(index) * 20}%`,
                                    zIndex: 10
                                }}
                                animate={{
                                    x: [0, 50, 0],
                                    y: [0, -30, 0],
                                    rotate: [0, 15, -15, 0]
                                }}
                                transition={{
                                    duration: 4 + index,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                {/* Use local butterfly image instead of animation */}
                                <img 
                                    src="/butterflies/BFly_Col_diffuse2.png"
                                    alt="Butterfly"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        filter: `drop-shadow(0 0 8px ${species.color})`
                                    }}
                                />
                            </motion.div>
                        ))}
                        
                        {/* Flying butterflies */}
                        {flyingButterflies.map((butterfly) => (
                            <motion.div
                                key={butterfly.id}
                                style={{
                                    position: 'absolute',
                                    left: `${butterfly.x}%`,
                                    top: `${butterfly.y}%`,
                                    zIndex: 20
                                }}
                                initial={{ 
                                    x: `${butterfly.direction * 100}%`,
                                    y: `${Math.random() * 100}%`,
                                    opacity: 0
                                }}
                                animate={{ 
                                    x: `${butterfly.direction * -200}%`,
                                    y: `${butterfly.y + (Math.random() * 40 - 20)}%`,
                                    opacity: [0, 1, 1, 0]
                                }}
                                transition={{
                                    duration: 8 / butterfly.speed,
                                    delay: butterfly.delay,
                                    ease: "linear"
                                }}
                            >
                                {/* Use local butterfly image instead of animation */}
                                <img 
                                    src={`/butterflies/BFly_Col_diffuse${Math.floor(Math.random() * 2) + 2}.png`}
                                    alt="Butterfly"
                                    style={{
                                        width: butterfly.size === 'large' ? '80px' : butterfly.size === 'medium' ? '60px' : '40px',
                                        height: butterfly.size === 'large' ? '80px' : butterfly.size === 'medium' ? '60px' : '40px',
                                        filter: `drop-shadow(0 0 8px ${butterfly.color})`
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '14px',
                            fontStyle: 'italic',
                            position: 'relative',
                            zIndex: 30
                        }}>
                            Move your device to see butterflies dance in your environment
                        </p>
                    </div>
                </motion.div>
            ) : (
                /* Regular Garden View */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Butterfly Collection */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        style={{
                            background: 'rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '24px',
                            padding: '24px',
                            border: '1px solid rgba(139, 92, 246, 0.3)'
                        }}
                    >
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: 'white',
                            marginBottom: '16px',
                            fontStyle: 'italic',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Star size={20} style={{ color: '#fbbf24' }} aria-hidden="true" />
                            Butterfly Collection
                            <span className="sr-only">- {butterflySpecies.filter(s => s.unlocked).length} of {butterflySpecies.length} butterflies unlocked</span>
                        </h2>
                        
                        <div 
                            className="garden-grid"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '16px'
                            }}
                            role="grid"
                            aria-label="Butterfly collection grid"
                        >
                            {butterflySpecies.map((species, index) => (
                                <motion.div
                                    key={species.id}
                                    initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                    transition={{ 
                                        duration: 0.5, 
                                        delay: 0.5 + (index * 0.1),
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                    whileHover={{ 
                                        scale: 1.05, 
                                        y: -5,
                                        transition: { duration: 0.2 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="butterfly-card focus-visible"
                                    style={{
                                        padding: '16px',
                                        borderRadius: '16px',
                                        border: species.unlocked 
                                            ? '1px solid rgba(139, 92, 246, 0.5)' 
                                            : '1px solid rgba(75, 85, 99, 0.3)',
                                        background: species.unlocked 
                                            ? 'rgba(255, 255, 255, 0.05)' 
                                            : 'rgba(31, 41, 55, 0.3)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        animation: species.unlocked ? 'bounceIn 0.6s ease-out' : 'none'
                                    }}
                                    onClick={() => setSelectedSpecies(species)}
                                    role="gridcell"
                                    tabIndex={0}
                                    aria-label={`${species.name} butterfly, ${species.rarity} rarity, ${species.unlocked ? 'unlocked' : 'locked'}. ${species.description}`}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setSelectedSpecies(species);
                                        }
                                    }}
                                >
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{
                                            marginBottom: '12px',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}>
                                            {species.unlocked ? (
                                                <div style={{
                                                    position: 'relative',
                                                    width: '64px',
                                                    height: '64px'
                                                }}>
                                                    <img 
                                                        src={species.image}
                                                        alt={species.name}
                                                        style={{
                                                            width: '64px',
                                                            height: '64px',
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                            border: `2px solid ${species.color}`,
                                                            boxShadow: `0 0 15px ${species.color}50`
                                                        }}
                                                        onError={(e) => {
                                                            // Fallback to butterfly emoji with colored background
                                                            e.target.style.display = 'none';
                                                            const fallbackDiv = e.target.nextElementSibling;
                                                            fallbackDiv.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div style={{
                                                        width: '64px',
                                                        height: '64px',
                                                        borderRadius: '50%',
                                                        background: `linear-gradient(135deg, ${species.color}, ${species.color}aa)`,
                                                        display: 'none',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '32px',
                                                        border: `2px solid ${species.color}`,
                                                        boxShadow: `0 0 15px ${species.color}50`
                                                    }}>
                                                        🦋
                                                    </div>
                                                    <ButterflyAnimation 
                                                        size="small"
                                                        color={species.color}
                                                        bpm={75}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-8px',
                                                            right: '-8px'
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div style={{
                                                    position: 'relative',
                                                    width: '64px',
                                                    height: '64px'
                                                }}>
                                                    {/* Mystery silhouette background */}
                                                    <div style={{
                                                        width: '64px',
                                                        height: '64px',
                                                        borderRadius: '50%',
                                                        background: `linear-gradient(135deg, ${species.color}20, ${species.color}40, #000000)`,
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                        border: `2px solid ${species.color}60`,
                                                        boxShadow: `0 0 20px ${species.color}30`
                                                    }}>
                                                        {/* Blurred butterfly preview */}
                                                        <img 
                                                            src={species.image}
                                                            alt={species.name}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                filter: 'blur(8px) brightness(0.3) contrast(1.5)',
                                                                opacity: 0.6
                                                            }}
                                                        />
                                                        
                                                        {/* Glowing particles effect */}
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '20%',
                                                            left: '30%',
                                                            width: '4px',
                                                            height: '4px',
                                                            background: species.color,
                                                            borderRadius: '50%',
                                                            boxShadow: `0 0 8px ${species.color}`,
                                                            animation: 'pulse 2s infinite'
                                                        }} />
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '60%',
                                                            right: '25%',
                                                            width: '3px',
                                                            height: '3px',
                                                            background: species.color,
                                                            borderRadius: '50%',
                                                            boxShadow: `0 0 6px ${species.color}`,
                                                            animation: 'pulse 2.5s infinite 0.5s'
                                                        }} />
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '40%',
                                                            right: '40%',
                                                            width: '2px',
                                                            height: '2px',
                                                            background: species.color,
                                                            borderRadius: '50%',
                                                            boxShadow: `0 0 4px ${species.color}`,
                                                            animation: 'pulse 3s infinite 1s'
                                                        }} />
                                                        
                                                        {/* Question mark overlay */}
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                            color: species.color,
                                                            fontSize: '20px',
                                                            fontWeight: 'bold',
                                                            textShadow: `0 0 10px ${species.color}`,
                                                            opacity: 0.9
                                                        }}>
                                                            ?
                                                        </div>
                                                        
                                                        {/* Shimmer effect overlay */}
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: '-100%',
                                                            width: '100%',
                                                            height: '100%',
                                                            background: `linear-gradient(90deg, transparent, ${species.color}40, transparent)`,
                                                            animation: 'shimmer 3s infinite'
                                                        }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <h3 style={{
                                            fontWeight: '600',
                                            marginBottom: '4px',
                                            color: species.unlocked ? 'white' : '#6b7280'
                                        }}>
                                            {species.name}
                                        </h3>
                                        
                                        <p style={{
                                            fontSize: '14px',
                                            color: rarityColors[species.rarity]
                                        }}>
                                            {species.rarity}
                                        </p>
                                        
                                        {!species.unlocked && (
                                            <p style={{
                                                fontSize: '12px',
                                                color: '#9ca3af',
                                                marginTop: '8px',
                                                fontStyle: 'italic'
                                            }}>
                                                {species.requirement}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Withered Flowers (Ghosting Memorial) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        style={{
                            background: 'rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '24px',
                            padding: '24px',
                            border: '1px solid rgba(75, 85, 99, 0.3)'
                        }}
                    >
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#d1d5db',
                            marginBottom: '16px',
                            fontStyle: 'italic',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Flower size={20} style={{ color: '#9ca3af' }} aria-hidden="true" />
                            Withered Garden
                            <span className="sr-only">- Memorial for past connections</span>
                        </h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {witheredFlowers.map((flower) => (
                                <motion.div
                                    key={flower.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.6 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        background: 'rgba(31, 41, 55, 0.2)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(75, 85, 99, 0.3)'
                                    }}
                                >
                                    <div style={{ fontSize: '32px', opacity: 0.5 }}>🥀</div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{
                                            color: '#d1d5db',
                                            fontWeight: '500'
                                        }}>
                                            {flower.name}
                                        </p>
                                        <p style={{
                                            color: '#6b7280',
                                            fontSize: '14px',
                                            fontStyle: 'italic'
                                        }}>
                                            {flower.reason}
                                        </p>
                                    </div>
                                    <div style={{
                                        color: '#9ca3af',
                                        fontSize: '14px'
                                    }}>
                                        {flower.days}d ago
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        
                        <p style={{
                            color: '#6b7280',
                            fontSize: '14px',
                            marginTop: '16px',
                            textAlign: 'center',
                            fontStyle: 'italic'
                        }}>
                            "Every connection teaches us something beautiful" 🌙
                        </p>
                    </motion.div>
                </div>
            )}

            {/* Species Detail Modal */}
            {selectedSpecies && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                        zIndex: 50
                    }}
                    onClick={() => setSelectedSpecies(null)}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{
                            background: 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '24px',
                            padding: '24px',
                            border: '1px solid rgba(139, 92, 246, 0.5)',
                            maxWidth: '384px',
                            width: '100%'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                marginBottom: '16px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <div style={{
                                    position: 'relative',
                                    width: '120px',
                                    height: '120px'
                                }}>
                                        {selectedSpecies.unlocked ? (
                                            <>
                                                <img 
                                                    src={selectedSpecies.image}
                                                    alt={selectedSpecies.name}
                                                    style={{
                                                        width: '120px',
                                                        height: '120px',
                                                        borderRadius: '50%',
                                                        objectFit: 'cover',
                                                        border: `3px solid ${selectedSpecies.color}`,
                                                        boxShadow: `0 0 25px ${selectedSpecies.color}60`
                                                    }}
                                                    onError={(e) => {
                                                        // Enhanced fallback for modal
                                                        e.target.style.display = 'none';
                                                        const fallbackDiv = e.target.nextElementSibling;
                                                        fallbackDiv.style.display = 'flex';
                                                    }}
                                                />
                                                <div style={{
                                                    width: '120px',
                                                    height: '120px',
                                                    borderRadius: '50%',
                                                    background: `linear-gradient(135deg, ${selectedSpecies.color}, ${selectedSpecies.color}aa)`,
                                                    display: 'none',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '48px',
                                                    border: `3px solid ${selectedSpecies.color}`,
                                                    boxShadow: `0 0 25px ${selectedSpecies.color}60`
                                                }}>
                                                    🦋
                                                </div>
                                                <ButterflyAnimation 
                                                    size="medium"
                                                    color={selectedSpecies.color}
                                                    bpm={80}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-10px',
                                                        right: '-10px'
                                                    }}
                                                />
                                            </>
                                        ) : (
                                            <div style={{
                                                width: '120px',
                                                height: '120px',
                                                borderRadius: '50%',
                                                background: `radial-gradient(circle, ${selectedSpecies.color}15, #000000)`,
                                                position: 'relative',
                                                overflow: 'hidden',
                                                border: `3px solid ${selectedSpecies.color}80`,
                                                boxShadow: `0 0 30px ${selectedSpecies.color}40`,
                                                animation: 'mysteryFloat 4s ease-in-out infinite'
                                            }}>
                                                {/* Large blurred butterfly preview */}
                                                <img 
                                                    src={selectedSpecies.image}
                                                    alt={selectedSpecies.name}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        filter: 'blur(12px) brightness(0.4) contrast(1.8)',
                                                        opacity: 0.7
                                                    }}
                                                />
                                                
                                                {/* Central question mark */}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    color: selectedSpecies.color,
                                                    fontSize: '40px',
                                                    fontWeight: 'bold',
                                                    textShadow: `0 0 15px ${selectedSpecies.color}`,
                                                    opacity: 0.9
                                                }}>
                                                    ?
                                                </div>
                                                
                                                {/* Enhanced glowing particles */}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '25%',
                                                    left: '30%',
                                                    width: '6px',
                                                    height: '6px',
                                                    background: selectedSpecies.color,
                                                    borderRadius: '50%',
                                                    boxShadow: `0 0 12px ${selectedSpecies.color}`,
                                                    animation: 'pulse 2s infinite'
                                                }} />
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '65%',
                                                    right: '25%',
                                                    width: '5px',
                                                    height: '5px',
                                                    background: selectedSpecies.color,
                                                    borderRadius: '50%',
                                                    boxShadow: `0 0 10px ${selectedSpecies.color}`,
                                                    animation: 'pulse 2.5s infinite 0.5s'
                                                }} />
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '40%',
                                                    right: '35%',
                                                    width: '4px',
                                                    height: '4px',
                                                    background: selectedSpecies.color,
                                                    borderRadius: '50%',
                                                    boxShadow: `0 0 8px ${selectedSpecies.color}`,
                                                    animation: 'pulse 3s infinite 1s'
                                                }} />
                                                
                                                {/* Enhanced shimmer effect */}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: '-100%',
                                                    width: '100%',
                                                    height: '100%',
                                                    background: `linear-gradient(90deg, transparent, ${selectedSpecies.color}60, transparent)`,
                                                    animation: 'shimmer 3s infinite'
                                                }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            
                            <h3 
                                id="modal-title"
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    marginBottom: '8px',
                                    fontStyle: 'italic'
                                }}
                            >
                                {selectedSpecies.name}
                            </h3>
                            
                            <p style={{
                                fontSize: '18px',
                                color: rarityColors[selectedSpecies.rarity],
                                marginBottom: '16px'
                            }}>
                                {selectedSpecies.rarity}
                            </p>
                            
                            <p 
                                id="modal-description"
                                style={{
                                    color: '#c4b5fd',
                                    fontStyle: 'italic',
                                    marginBottom: '16px'
                                }}
                            >
                                {selectedSpecies.description}
                            </p>
                            
                            {!selectedSpecies.unlocked && (
                                <div style={{
                                    background: 'rgba(31, 41, 55, 0.5)',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    marginBottom: '16px'
                                }}>
                                    <p style={{
                                        color: '#d1d5db',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}>
                                        Unlock Requirement:
                                    </p>
                                    <p style={{
                                        color: '#9ca3af',
                                        fontSize: '14px',
                                        fontStyle: 'italic'
                                    }}>
                                        {selectedSpecies.requirement}
                                    </p>
                                </div>
                            )}
                            
                            <button
                                onClick={() => setSelectedSpecies(null)}
                                className="focus-visible"
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(to right, #7c3aed, #ec4899)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    color: 'white',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'linear-gradient(to right, #6d28d9, #db2777)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'linear-gradient(to right, #7c3aed, #ec4899)';
                                }}
                                aria-label="Close butterfly details modal"
                                autoFocus
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}