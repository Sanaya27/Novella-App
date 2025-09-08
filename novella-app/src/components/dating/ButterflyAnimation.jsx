import React from 'react';
import { motion } from 'framer-motion';

export default function ButterflyAnimation({ 
    bpm = 70, 
    color = '#4CC9F0', 
    size = 'medium' 
}) {
    const sizeClasses = {
        small: 'w-8 h-8',   // Increased from w-6 h-6
        medium: 'w-16 h-16', // Increased from w-12 h-12
        large: 'w-24 h-24'   // Increased from w-20 h-20
    };

    const flutterSpeed = Math.max(0.3, Math.min(2, 60 / bpm));

    return (
        <motion.div
            className={`relative ${sizeClasses[size]}`}
            animate={{ 
                x: [0, 15, -15, 0], // Increased movement from 10 to 15
                y: [0, -10, 10, 0]  // Increased movement from 5 to 10
            }}
            transition={{ 
                duration: flutterSpeed, 
                repeat: Infinity, 
                ease: "easeInOut" 
            }}
        >
            {/* Simple butterfly shape */}
            <motion.div
                className="w-full h-full"
                animate={{
                    scale: [1, 1.3, 1] // Increased from 1.1 to 1.3 for more dramatic wing flapping
                }}
                transition={{
                    duration: flutterSpeed,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <div 
                    className="absolute inset-0 rounded-full opacity-80"
                    style={{
                        background: `radial-gradient(circle, ${color}, ${color}dd)`,
                        clipPath: 'polygon(50% 20%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%, 20% 0%)'
                    }}
                />
                <div 
                    className="absolute left-1/2 top-1/2 w-0.5 h-3/4 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: '#374151' }}
                />
            </motion.div>
        </motion.div>
    );
}