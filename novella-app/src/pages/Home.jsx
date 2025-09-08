export { default } from './HomeNew';

const initialMatches = [
    {
        id: 1,
        name: "Lily Chen",
        age: 26,
        bio: "Dancing through life with butterflies in my heart 🦋",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
        distance: "2 miles away",
        currentBpm: 78,
        syncLevel: 87,
        butterflyType: "morpho",
        lastSeen: "Active now"
    },
    {
        id: 2,
        name: "Sofia Luna",
        age: 24,
        bio: "Artist & dreamer seeking authentic connections ✨",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
        distance: "5 miles away", 
        currentBpm: 92,
        syncLevel: 94,
        butterflyType: "swallowtail",
        lastSeen: "2 hours ago"
    },
    {
        id: 3,
        name: "Zara Moon",
        age: 28,
        bio: "Yoga instructor with a wild heart 🌙",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
        distance: "1 mile away",
        currentBpm: 65,
        syncLevel: 76,
        butterflyType: "monarch",
        lastSeen: "30 minutes ago"
    },
    {
        id: 4,
        name: "Aria Chen",
        age: 25,
        bio: "Musician who believes in soul connections 🎵",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
        distance: "3 miles away",
        currentBpm: 73,
        syncLevel: 82,
        butterflyType: "swallowtail",
        lastSeen: "1 hour ago"
    }
];

export default function Home() {
    const [flutterTrigger, setFlutterTrigger] = useState(0);
    
    const [swipeDirection, setSwipeDirection] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    
    // Using useMemo to prevent re-shuffling on every render
    const profileStack = useMemo(() => initialMatches, []);
    const [activeCardIndex, setActiveCardIndex] = useState(profileStack.length - 1);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const user = await User.me();
            console.log('User loaded:', user);
        } catch (error) {
            console.log("User not logged in");
        }
    };
    
    const handleSwipe = (direction) => {
        if (activeCardIndex < 0) return;

        setSwipeDirection(direction); // Set the direction for the exit animation
        
        if (direction === 'right') {
            setFlutterTrigger(prev => prev + 1); // Trigger butterfly burst
            console.log(`Flutter sent to ${profileStack[activeCardIndex].name}! 🦋💕`);
        } else {
            console.log(`Passed on ${profileStack[activeCardIndex].name} ⬅️`);
        }
        
        // Delay the card removal to allow exit animation
        setTimeout(() => {
            setActiveCardIndex(prev => prev - 1);
            setSwipeDirection(null);
        }, 300);
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.8 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: {
            x: swipeDirection === 'right' ? 400 : swipeDirection === 'left' ? -400 : 0,
            opacity: 0,
            rotate: swipeDirection === 'right' ? 25 : swipeDirection === 'left' ? -25 : 0,
            scale: 0.8,
            transition: { duration: 0.4, ease: 'easeInOut' }
        }
    };
    
    return (
        <div style={{
            minHeight: '100vh',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <ButterflyBurst trigger={flutterTrigger} />
            
            {/* Header */}
            <div style={{
                textAlign: 'center',
                marginBottom: '16px',
                paddingTop: '32px'
            }}>
                <h1 style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(to right, #22d3ee, #ec4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '8px',
                    fontStyle: 'italic'
                }} className="satoshi">
                    Novella
                </h1>
                <p style={{
                    color: '#c4b5fd',
                    fontStyle: 'italic',
                    margin: 0
                }}>Where hearts sync and stories begin</p>
            </div>

            {/* Profile Card Stack */}
            <div style={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                marginBottom: '80px'
            }}>
                <AnimatePresence mode="wait">
                    {activeCardIndex >= 0 ? (
                        <motion.div
                            key={profileStack[activeCardIndex].id}
                            custom={activeCardIndex}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            drag="x"
                            dragConstraints={{ left: -200, right: 200 }}
                            dragElastic={0.2}
                            onDragStart={() => setIsDragging(true)}
                            onDragEnd={(event, { offset, velocity }) => {
                                setIsDragging(false);
                                const swipeThreshold = 100;
                                const velocityThreshold = 500;
                                
                                if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
                                    handleSwipe('right');
                                } else if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
                                    handleSwipe('left');
                                }
                            }}
                            whileDrag={{
                                cursor: 'grabbing',
                                scale: 1.05
                            }}
                            style={{
                                background: 'rgba(0, 0, 0, 0.3)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                border: '1px solid rgba(139, 92, 246, 0.2)',
                                boxShadow: '0 0 20px rgba(76, 201, 240, 0.3), 0 0 40px rgba(76, 201, 240, 0.1)',
                                width: '90vw',
                                maxWidth: '384px',
                                height: '65vh',
                                cursor: 'grab'
                            }}
                        >
                            <div style={{
                                position: 'relative',
                                height: 'calc(100% - 80px)'
                            }}>
                                <img 
                                    src={profileStack[activeCardIndex].avatar} 
                                    alt={profileStack[activeCardIndex].name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)'
                                }} />

                                <div style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px'
                                }}>
                                    <RealisticButterfly 
                                        bpm={profileStack[activeCardIndex].currentBpm}
                                        size="medium"
                                        species={profileStack[activeCardIndex].butterflyType}
                                    />
                                </div>
                                
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: '24px',
                                    color: 'white'
                                }}>
                                    <h3 style={{
                                        fontSize: '30px',
                                        fontWeight: 'bold',
                                        color: 'white',
                                        fontStyle: 'italic',
                                        margin: 0
                                    }} className="satoshi">
                                        {profileStack[activeCardIndex].name}, {profileStack[activeCardIndex].age}
                                    </h3>
                                    <p style={{
                                        color: '#c4b5fd',
                                        margin: '8px 0 12px 0',
                                        fontStyle: 'italic'
                                    }}>{profileStack[activeCardIndex].bio}</p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#22d3ee',
                                        fontSize: '14px',
                                        fontStyle: 'italic'
                                    }}>
                                        <MapPin style={{ width: '16px', height: '16px' }} />
                                        <span>{profileStack[activeCardIndex].distance}</span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginTop: '16px'
                                    }}>
                                         <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            background: 'rgba(0, 0, 0, 0.5)',
                                            backdropFilter: 'blur(16px)',
                                            borderRadius: '9999px',
                                            padding: '4px 12px'
                                        }}>
                                            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 60 / profileStack[activeCardIndex].currentBpm, repeat: Infinity }} >
                                                <Heart style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    color: '#f87171',
                                                    fill: 'currentColor'
                                                }} />
                                            </motion.div>
                                            <span style={{
                                                color: 'white',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                fontStyle: 'italic'
                                            }}>{profileStack[activeCardIndex].currentBpm}</span>
                                        </div>
                                        <div style={{
                                            background: 'linear-gradient(to right, rgba(6, 182, 212, 0.8), rgba(236, 72, 153, 0.8))',
                                            backdropFilter: 'blur(16px)',
                                            borderRadius: '9999px',
                                            padding: '4px 12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <Sparkles style={{ width: '16px', height: '16px', color: 'white' }} />
                                            <span style={{
                                                color: 'white',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                fontStyle: 'italic'
                                            }}>{profileStack[activeCardIndex].syncLevel}% sync</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Swipe Indicators */}
                                {isDragging && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.8 }}
                                            style={{
                                                position: 'absolute',
                                                left: '20px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'rgba(236, 72, 153, 0.8)',
                                                color: 'white',
                                                padding: '12px 20px',
                                                borderRadius: '50px',
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                fontStyle: 'italic',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            ⬅️ PASS
                                        </motion.div>
                                        
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.8 }}
                                            style={{
                                                position: 'absolute',
                                                right: '20px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'rgba(34, 211, 238, 0.8)',
                                                color: 'white',
                                                padding: '12px 20px',
                                                borderRadius: '50px',
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                fontStyle: 'italic',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            FLUTTER 🦋 ➡️
                                        </motion.div>
                                    </>
                                )}
                            </div>
                            
                            {/* Swipe Buttons */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                background: 'rgba(0, 0, 0, 0.5)',
                                backdropFilter: 'blur(8px)',
                                padding: '16px',
                                height: '80px'
                            }}>
                                <motion.button
                                    onClick={() => handleSwipe('left')}
                                    whileHover={{ scale: 1.1 }} 
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '2px solid rgba(236, 72, 153, 0.5)',
                                        borderRadius: '9999px',
                                        padding: '12px 32px',
                                        color: '#ec4899',
                                        fontWeight: '600',
                                        fontStyle: 'italic',
                                        fontSize: '18px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(236, 72, 153, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                    }}
                                >
                                    Pass ←
                                </motion.button>
                                <motion.button
                                    onClick={() => handleSwipe('right')}
                                    whileHover={{ scale: 1.1 }} 
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                        background: 'linear-gradient(to right, #06b6d4, #ec4899)',
                                        borderRadius: '9999px',
                                        padding: '12px 32px',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontStyle: 'italic',
                                        fontSize: '18px',
                                        cursor: 'pointer',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                    }}
                                >
                                    Flutter → 🦋
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                textAlign: 'center',
                                color: '#c4b5fd'
                            }}
                        >
                            <div style={{
                                fontSize: '72px',
                                marginBottom: '16px'
                            }}>🦋</div>
                            <h3 style={{
                                fontSize: '32px',
                                fontWeight: 'bold',
                                marginBottom: '8px',
                                margin: 0
                            }} className="satoshi">No more profiles!</h3>
                            <p style={{
                                fontStyle: 'italic',
                                margin: 0
                            }}>Check back later for new connections</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}