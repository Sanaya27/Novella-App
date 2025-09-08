import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Home, Heart, MessageSquare, Bot, Eye, Flower2, Mic, User } from "lucide-react";

export default function Layout() {
    const location = useLocation();

    const navItems = [
        { name: "Home", icon: Home, path: "/home" },
        { name: "Sync", icon: Heart, path: "/sync" },
        { name: "Chat", icon: MessageSquare, path: "/chat" },
        { name: "Amora", icon: Bot, path: "/amora" },
        { name: "Garden", icon: Flower2, path: "/garden" },
        { name: "Voice", icon: Mic, path: "/voice" },
        { name: "Glimpse", icon: Eye, path: "/glimpse" },
        { name: "Profile", icon: User, path: "/profile" }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #581c87, #7c3aed, #312e81)',
            fontFamily: 'Inter, system-ui, sans-serif',
            paddingBottom: '80px'
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Inter', system-ui, sans-serif;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 5px rgba(255,255,255,0.5); }
                    50% { box-shadow: 0 0 20px rgba(255,255,255,0.8); }
                }
            `}</style>

            {/* Main Content */}
            <main style={{
                minHeight: 'calc(100vh - 80px)',
                width: '100%'
            }}>
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '12px 0',
                zIndex: 1000
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    maxWidth: '100%',
                    margin: '0 auto'
                }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || 
                                       (item.path !== '/home' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '8px 12px',
                                    textDecoration: 'none',
                                    color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                                    minWidth: '50px',
                                    transition: 'all 0.2s ease'
                                }}
                                aria-label={item.name}
                            >
                                <item.icon 
                                    size={22} 
                                    style={{
                                        animation: isActive ? 'pulse 2s infinite' : 'none',
                                        filter: isActive ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))' : 'none'
                                    }}
                                />
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: isActive ? '600' : '400',
                                    textAlign: 'center'
                                }}>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}