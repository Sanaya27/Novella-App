import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ButterflyAnimation from './ButterflyAnimation';

export default function ButterflyBurst({ trigger }) {
    const [bursts, setBursts] = useState([]);

    useEffect(() => {
        if (trigger > 0) {
            const newBurst = {
                id: Date.now(),
                butterflies: Array.from({ length: 8 }, (_, i) => ({ // Increased from 7 to 8 like home page
                    id: i,
                    x: Math.random() * 100,
                    size: Math.random() > 0.3 ? 'large' : 'medium', // Mix of sizes, mostly large
                    delay: Math.random() * 0.5,
                    color: Math.random() > 0.5 ? '#4CC9F0' : '#F72585',
                })),
            };
            setBursts(prev => [...prev, newBurst]);
            // Auto-remove after animation
            setTimeout(() => {
                setBursts(current => current.filter(b => b.id !== newBurst.id));
            }, 5000); // Increased from 4000ms to 5000ms for longer visibility
        }
    }, [trigger]);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {bursts.map(burst => (
                <div key={burst.id} className="absolute inset-0">
                    {burst.butterflies.map(bf => (
                        <motion.div
                            key={bf.id}
                            className="absolute bottom-0"
                            style={{
                                left: `${bf.x}%`,
                                scale: bf.size,
                            }}
                            initial={{ y: 0, opacity: 1 }}
                            animate={{ y: '-100vh', opacity: 0 }}
                            transition={{
                                duration: 3 + Math.random(),
                                delay: bf.delay,
                                ease: 'easeOut'
                            }}
                        >
                            <ButterflyAnimation
                                bpm={120}
                                color={bf.color}
                                size={bf.size}
                            />
                        </motion.div>
                    ))}
                </div>
            ))}
        </div>
    );
}