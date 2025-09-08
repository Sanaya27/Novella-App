import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Flower, Star, Eye } from "lucide-react";
import ButterflyAnimation from "../Components/dating/ButterflyAnimation";

export default function Garden() {
    const [arMode, setArMode] = useState(false);
    const [selectedSpecies, setSelectedSpecies] = useState(null);

    const butterflySpecies = [
        { 
            id: 1, 
            name: "Azure Morpho", 
            rarity: "Common", 
            unlocked: true,
            color: "#4CC9F0",
            description: "First connection butterflies",
            requirement: "Send your first message"
        },
        { 
            id: 2, 
            name: "Golden Swallowtail", 
            rarity: "Rare", 
            unlocked: true,
            color: "#FFD700",
            description: "Deep conversation specialists",
            requirement: "Have a 30+ message conversation"
        },
        { 
            id: 3, 
            name: "Phantom Glasswing", 
            rarity: "Epic", 
            unlocked: false,
            color: "#E0E7FF",
            description: "Ghost glimpse memories",
            requirement: "Send 5 ghost glimpses"
        },
        { 
            id: 4, 
            name: "Phoenix Monarch", 
            rarity: "Legendary", 
            unlocked: false,
            color: "#FF4500",
            description: "Perfect heart sync achieved",
            requirement: "Achieve 95% heart sync for 5 minutes"
        }
    ];

    const witheredFlowers = [
        { id: 1, name: "Sarah", reason: "No reply for 3 days", days: 3 },
        { id: 2, name: "Maya", reason: "Conversation ended", days: 7 },
    ];

    const rarityColors = {
        Common: "text-gray-300",
        Rare: "text-blue-400", 
        Epic: "text-purple-400",
        Legendary: "text-orange-400"
    };

    return (
        <div className="min-h-screen p-4 pt-16">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl font-bold satoshi text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-2">
                    Symbiosis Garden
                </h1>
                <p className="text-purple-300 italic">Your collection of connection butterflies</p>
            </motion.div>

            {/* AR Toggle */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-8"
            >
                <button
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        fontStyle: 'italic',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Camera className="w-5 h-5 mr-2" />
                    {arMode ? 'Exit AR View' : 'Enter AR Mode'}
                </button>
            </motion.div>

            {/* AR Simulation */}
            {arMode ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-cyan-500/50 relative overflow-hidden"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundBlendMode: 'overlay'
                    }}
                >
                    <div className="text-center mb-6">
                        <p className="text-white font-semibold text-lg italic">AR Garden View</p>
                        <p className="text-cyan-300 text-sm">Butterflies projected into your space</p>
                    </div>
                    
                    {/* Floating butterflies in AR */}
                    <div className="relative h-64">
                        {butterflySpecies.filter(s => s.unlocked).map((species, index) => (
                            <motion.div
                                key={species.id}
                                className="absolute"
                                style={{
                                    left: `${20 + index * 25}%`,
                                    top: `${30 + Math.sin(index) * 20}%`
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
                                <ButterflyAnimation 
                                    size="medium"
                                    color={species.color}
                                    bpm={70 + index * 5}
                                />
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center">
                        <p className="text-white/80 text-sm italic">
                            Move your device to see butterflies dance in your environment
                        </p>
                    </div>
                </motion.div>
            ) : (
                /* Regular Garden View */
                <div className="space-y-6">
                    {/* Butterfly Collection */}
                    <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30">
                        <h2 className="text-xl font-semibold text-white mb-4 italic flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            Butterfly Collection
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {butterflySpecies.map((species) => (
                                <motion.div
                                    key={species.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: species.id * 0.1 }}
                                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                                        species.unlocked 
                                            ? 'bg-white/5 border-purple-400/50 hover:bg-white/10' 
                                            : 'bg-gray-800/30 border-gray-600/30'
                                    }`}
                                    onClick={() => setSelectedSpecies(species)}
                                >
                                    <div className="text-center">
                                        <div className="mb-3 flex justify-center">
                                            {species.unlocked ? (
                                                <ButterflyAnimation 
                                                    size="medium"
                                                    color={species.color}
                                                    bpm={75}
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center opacity-50">
                                                    <Eye className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <h3 className={`font-semibold mb-1 ${species.unlocked ? 'text-white' : 'text-gray-500'}`}>
                                            {species.name}
                                        </h3>
                                        
                                        <p className={`text-sm ${rarityColors[species.rarity]}`}>
                                            {species.rarity}
                                        </p>
                                        
                                        {!species.unlocked && (
                                            <p className="text-xs text-gray-400 mt-2 italic">
                                                {species.requirement}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Withered Flowers (Ghosting Memorial) */}
                    <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-6 border border-gray-500/30">
                        <h2 className="text-xl font-semibold text-gray-300 mb-4 italic flex items-center gap-2">
                            <Flower className="w-5 h-5 text-gray-400" />
                            Withered Garden
                        </h2>
                        
                        <div className="space-y-3">
                            {witheredFlowers.map((flower) => (
                                <motion.div
                                    key={flower.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.6 }}
                                    className="flex items-center gap-3 p-3 bg-gray-800/20 rounded-lg border border-gray-600/30"
                                >
                                    <div className="text-2xl opacity-50">🥀</div>
                                    <div className="flex-1">
                                        <p className="text-gray-300 font-medium">{flower.name}</p>
                                        <p className="text-gray-500 text-sm italic">{flower.reason}</p>
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {flower.days}d ago
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        
                        <p className="text-gray-500 text-sm mt-4 text-center italic">
                            "Every connection teaches us something beautiful" 🌙
                        </p>
                    </div>
                </div>
            )}

            {/* Species Detail Modal */}
            {selectedSpecies && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedSpecies(null)}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-black/60 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/50 max-w-sm w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <ButterflyAnimation 
                                    size="large"
                                    color={selectedSpecies.color}
                                    bpm={80}
                                />
                            </div>
                            
                            <h3 className="text-2xl font-bold satoshi text-white mb-2">
                                {selectedSpecies.name}
                            </h3>
                            
                            <p className={`text-lg ${rarityColors[selectedSpecies.rarity]} mb-4`}>
                                {selectedSpecies.rarity}
                            </p>
                            
                            <p className="text-purple-200 italic mb-4">
                                {selectedSpecies.description}
                            </p>
                            
                            {!selectedSpecies.unlocked && (
                                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                                    <p className="text-gray-300 text-sm font-medium">Unlock Requirement:</p>
                                    <p className="text-gray-400 text-sm italic">{selectedSpecies.requirement}</p>
                                </div>
                            )}
                            
                            <button
                                onClick={() => setSelectedSpecies(null)}
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