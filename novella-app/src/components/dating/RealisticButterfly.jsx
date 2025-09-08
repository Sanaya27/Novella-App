import React from "react";
import { motion } from "framer-motion";

export default function RealisticButterfly({ 
    bpm = 70, 
    size = "large",
    species = "morpho"
}) {
    const flutterSpeed = Math.max(0.3, Math.min(2, 60 / bpm));
    const isHighBpm = bpm > 100;
    
    const sizeClasses = {
        small: "w-12 h-12",
        medium: "w-24 h-24", 
        large: "w-40 h-40"
    };

    const wingPatterns = {
        morpho: "radial-gradient(ellipse at 30% 30%, #1E40AF, #3B82F6, #60A5FA)",
        monarch: "radial-gradient(ellipse at 30% 30%, #EA580C, #F97316, #FB923C)",
        swallowtail: "radial-gradient(ellipse at 30% 30%, #FCD34D, #F59E0B, #D97706)",
    };
    const pattern = wingPatterns[species] || wingPatterns.morpho;

    return (
        <motion.div
            className={`relative ${sizeClasses[size]}`}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Left Upper Wing */}
            <motion.div 
                className="absolute w-[45%] h-[60%] left-[5%] top-[10%]" 
                style={{ transformOrigin: "bottom right" }}
                animate={{ 
                    rotateY: [15, 75, 15],
                    rotateZ: [0, -8, 0]
                }}
                transition={{ duration: flutterSpeed, repeat: Infinity, ease: "easeInOut" }}
            >
                <div 
                    className="w-full h-full" 
                    style={{ 
                        background: pattern,
                        clipPath: "polygon(0% 20%, 40% 0%, 80% 10%, 100% 40%, 90% 80%, 60% 100%, 20% 90%, 0% 60%)",
                        filter: isHighBpm ? 'drop-shadow(0 0 12px #FF1744) brightness(1.3)' : 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))'
                    }}
                >
                    {/* Wing details */}
                    <div className="absolute inset-2 opacity-30">
                        <div className="w-px h-full bg-black/60 absolute left-1/4 origin-bottom transform rotate-12" />
                        <div className="w-px h-full bg-black/60 absolute left-2/4 origin-bottom transform rotate-6" />
                        <div className="w-px h-full bg-black/60 absolute left-3/4 origin-bottom transform -rotate-6" />
                        <div className="h-px w-3/4 bg-black/60 absolute top-1/3 transform rotate-3" />
                        <div className="h-px w-2/3 bg-black/60 absolute top-2/3 transform -rotate-3" />
                    </div>
                    {/* Wing spots */}
                    <div className="absolute w-3 h-3 rounded-full bg-white/40" style={{top: '25%', right: '20%'}}/>
                    <div className="absolute w-2 h-2 rounded-full bg-white/30" style={{top: '50%', right: '35%'}}/>
                </div>
            </motion.div>

            {/* Right Upper Wing */}
            <motion.div 
                className="absolute w-[45%] h-[60%] right-[5%] top-[10%]" 
                style={{ transformOrigin: "bottom left" }}
                animate={{ 
                    rotateY: [-15, -75, -15],
                    rotateZ: [0, 8, 0]
                }}
                transition={{ duration: flutterSpeed, repeat: Infinity, ease: "easeInOut" }}
            >
                <div 
                    className="w-full h-full" 
                    style={{ 
                        background: pattern,
                        clipPath: "polygon(20% 0%, 60% 0%, 80% 10%, 100% 40%, 100% 60%, 80% 90%, 60% 100%, 40% 80%, 0% 40%, 20% 10%)",
                        filter: isHighBpm ? 'drop-shadow(0 0 12px #FF1744) brightness(1.3)' : 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))'
                    }}
                >
                    {/* Wing details */}
                    <div className="absolute inset-2 opacity-30">
                        <div className="w-px h-full bg-black/60 absolute right-1/4 origin-bottom transform -rotate-12" />
                        <div className="w-px h-full bg-black/60 absolute right-2/4 origin-bottom transform -rotate-6" />
                        <div className="w-px h-full bg-black/60 absolute right-3/4 origin-bottom transform rotate-6" />
                        <div className="h-px w-3/4 bg-black/60 absolute top-1/3 transform -rotate-3" />
                        <div className="h-px w-2/3 bg-black/60 absolute top-2/3 transform rotate-3" />
                    </div>
                    {/* Wing spots */}
                    <div className="absolute w-3 h-3 rounded-full bg-white/40" style={{top: '25%', left: '20%'}}/>
                    <div className="absolute w-2 h-2 rounded-full bg-white/30" style={{top: '50%', left: '35%'}}/>
                </div>
            </motion.div>

            {/* Left Lower Wing */}
            <motion.div 
                className="absolute w-[35%] h-[40%] left-[15%] bottom-[15%]" 
                style={{ transformOrigin: "top right" }}
                animate={{ 
                    rotateY: [5, 45, 5],
                    rotateZ: [0, -5, 0]
                }}
                transition={{ duration: flutterSpeed, repeat: Infinity, ease: "easeInOut" }}
            >
                <div 
                    className="w-full h-full" 
                    style={{ 
                        background: `linear-gradient(135deg, ${pattern.replace('ellipse at 30% 30%', 'ellipse at 50% 50%')})`,
                        clipPath: "polygon(0% 0%, 60% 0%, 100% 30%, 80% 80%, 40% 100%, 0% 70%)",
                        filter: isHighBpm ? 'drop-shadow(0 0 8px #FF1744) brightness(1.2)' : 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))'
                    }}
                >
                    {/* Lower wing details */}
                    <div className="absolute inset-1 opacity-25">
                        <div className="w-px h-2/3 bg-black/50 absolute left-1/3" />
                        <div className="w-px h-2/3 bg-black/50 absolute left-2/3" />
                        <div className="h-px w-full bg-black/50 absolute top-1/2" />
                    </div>
                </div>
            </motion.div>

            {/* Right Lower Wing */}
            <motion.div 
                className="absolute w-[35%] h-[40%] right-[15%] bottom-[15%]" 
                style={{ transformOrigin: "top left" }}
                animate={{ 
                    rotateY: [-5, -45, -5],
                    rotateZ: [0, 5, 0]
                }}
                transition={{ duration: flutterSpeed, repeat: Infinity, ease: "easeInOut" }}
            >
                <div 
                    className="w-full h-full" 
                    style={{ 
                        background: `linear-gradient(225deg, ${pattern.replace('ellipse at 30% 30%', 'ellipse at 50% 50%')})`,
                        clipPath: "polygon(40% 0%, 100% 0%, 100% 70%, 60% 100%, 20% 80%, 0% 30%)",
                        filter: isHighBpm ? 'drop-shadow(0 0 8px #FF1744) brightness(1.2)' : 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))'
                    }}
                >
                    {/* Lower wing details */}
                    <div className="absolute inset-1 opacity-25">
                        <div className="w-px h-2/3 bg-black/50 absolute right-1/3" />
                        <div className="w-px h-2/3 bg-black/50 absolute right-2/3" />
                        <div className="h-px w-full bg-black/50 absolute top-1/2" />
                    </div>
                </div>
            </motion.div>

            {/* Butterfly Body */}
            <div 
                className="absolute left-1/2 top-[15%] w-1 h-[70%] transform -translate-x-1/2 rounded-full z-10"
                style={{ 
                    background: `linear-gradient(to bottom, ${isHighBpm ? '#DC2626' : '#374151'}, ${isHighBpm ? '#991B1B' : '#1F2937'})`,
                    filter: isHighBpm ? 'drop-shadow(0 0 4px #DC2626)' : 'none'
                }}
            />
            
            {/* Antennae */}
            <div className="absolute left-1/2 top-[10%] transform -translate-x-1/2">
                <div className="w-px h-4 bg-gray-700 absolute -left-1 origin-bottom transform rotate-12">
                    <div className="w-1 h-1 bg-gray-600 rounded-full absolute -top-0.5 -left-0.5" />
                </div>
                <div className="w-px h-4 bg-gray-700 absolute left-1 origin-bottom transform -rotate-12">
                    <div className="w-1 h-1 bg-gray-600 rounded-full absolute -top-0.5 -left-0.5" />
                </div>
            </div>
        </motion.div>
    );
}