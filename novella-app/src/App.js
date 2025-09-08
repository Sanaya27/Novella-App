import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import WhoYouAre from './pages/WhoYouAre';
import Preferences from './pages/Preferences';
import Home from './pages/HomeNew';
import Sync from './pages/Sync';
import Chat from './pages/Chat';
import Amora from './pages/Amora';
import Glimpse from './pages/Glimpse';
import SymbiosisGarden from './pages/Garden';
import VoiceMode from './pages/VoiceMood';
import Profile from './pages/Profile';
import { UserProvider } from './context/UserContext';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('novellaUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem('novellaUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('novellaUser');
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,255,255,0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }} />
          <p>Loading Novella...</p>
        </div>
      </div>
    );
  }

  return (
    <UserProvider value={{ user, saveUser, logout }}>
      <Router>
        <div className="App">
          <Routes>
            {/* Onboarding flow */}
            <Route path="/login" element={!user ? <Login /> : user.setupCompleted ? <Navigate to="/home" /> : <Navigate to="/who-you-are" />} />
            <Route path="/who-you-are" element={user && !user.setupCompleted && user.fullName ? <WhoYouAre /> : !user ? <Navigate to="/login" /> : <Navigate to="/home" />} />
            <Route path="/preferences" element={user && !user.setupCompleted && user.identity ? <Preferences /> : !user ? <Navigate to="/login" /> : <Navigate to="/home" />} />
            
            {/* Main app with layout */}
            <Route path="/" element={!user ? <Navigate to="/login" /> : <Layout />}>
              <Route index element={<Navigate to="/home" />} />
              <Route path="home" element={<Home />} />
              <Route path="sync" element={<Sync />} />
              <Route path="sync/:matchId" element={<Sync />} />
              <Route path="chat" element={<Chat />} />
              <Route path="chat/:matchId" element={<Chat />} />
              <Route path="amora" element={<Amora />} />
              <Route path="glimpse" element={<Glimpse />} />
              <Route path="garden" element={<SymbiosisGarden />} />
              <Route path="voice" element={<VoiceMode />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
