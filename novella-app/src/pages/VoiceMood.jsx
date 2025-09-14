import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, Sparkles } from "lucide-react";
<div className="bg-green-500 text-white p-4">TAILWIND WORKING!</div>


// --- Custom Button Component ---
const Button = ({ onClick, disabled, className, children }) => (
  <button onClick={onClick} disabled={disabled} className={className}>
    {children}
  </button>
);

export default function VoiceMood() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [voiceMessages, setVoiceMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [petals, setPetals] = useState([]);

  const recognitionRef = useRef(null);

  // --- Generate floating petals ---
  useEffect(() => {
    const newPetals = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + "vw",
      delay: Math.random() * 5 + "s",
    }));
    setPetals(newPetals);
  }, []);

  // --- Mood Categories ---
  const moodTypes = {
    golden_pollen: {
      name: "Golden Pollen",
      color: "#FFD700",
      emoji: "✨",
      description: "Flirty and playful",
    },
    blue_mist: {
      name: "Blue Mist",
      color: "#4CC9F0",
      emoji: "🌊",
      description: "Calm and sorrowful tone",
    },
    silver_whisper: {
      name: "Silver Whisper",
      color: "#C0C0C0",
      emoji: "🌙",
      description: "Mysterious and intimate",
    },
    rose_ember: {
      name: "Rose Ember",
      color: "#F72585",
      emoji: "🔥",
      description: "Passionate and intense",
    },
    neutral: {
      name: "Clear Light",
      color: "#E0E0E0",
      emoji: "⚪",
      description: "A balanced and neutral tone",
    },
  };

  // --- Detect Mood From Text ---
  const detectMood = (text) => {
    const lower = text.toLowerCase();
    const moodKeywords = {
      golden_pollen: [
        "haha", "lol", "funny", "play", "cute", "sweet", "giggle", "flirty", "hug", "playful",
      ],
      rose_ember: ["happy", "want", "love", "joy", "excited","thrilled","desired","passion", "intense"],
      blue_mist: ["sad", "down", "tired", "calm","quiet","alone", "thoughtful", "serene"],
      silver_whisper: ["mystery", "secret", "whisper", "hidden", "intimate", "hush"],
    };

    for (const mood in moodKeywords) {
      if (moodKeywords[mood].some((keyword) => lower.includes(keyword))) {
        return mood;
      }
    }

    return "neutral"; // default mood
  };

  // --- Start Recording ---
  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window)) {
      setErrorMessage(
        "Speech Recognition not supported in this browser. Please use Google Chrome."
      );
      return;
    }
    setErrorMessage("");

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript("");
      setCurrentMood(null);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      const mood = detectMood(text);
      setCurrentMood(mood);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
      setErrorMessage("Error during speech recognition. Please try again.");
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // --- Stop Recording ---
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  // --- Save Voice Message ---
  const sendVoiceMessage = () => {
    if (currentMood) {
      const newMessage = {
        id: Date.now(),
        senderId: "local-user",
        mood: currentMood,
        description: moodTypes[currentMood].description,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        transcript: transcript,
      };

      setVoiceMessages((prev) => [newMessage, ...prev]);
      setCurrentMood(null);
      setTranscript("");
    }
  };

  return (
    <div className="relative min-h-screen p-4 pt-16 font-[Inter] text-white bg-gradient-to-br from-gray-900 to-purple-950 overflow-hidden">
      {/* Falling petals */}
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal"
          style={{ left: p.left, animationDelay: p.delay }}
        ></div>
      ))}

      {/* Floating butterflies */}
      <motion.div
        className="butterfly-float absolute top-10 left-10 text-pink-300 text-4xl"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
      >
        🦋
      </motion.div>
      <motion.div
        className="butterfly-float absolute bottom-10 right-10 text-blue-300 text-3xl"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        🦋
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 z-10"
      >
        <h1 className="text-3xl font-bold satoshi text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-2 bio-glow">
          Voice Mood Analyzer
        </h1>
        <p className="text-purple-300 italic">
          Transform your voice into beautiful emotions
        </p>
      </motion.div>

      {/* Recording Interface */}
      <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-purple-500/30 text-center relative z-10">
        <AnimatePresence>
          {isRecording && (
            <motion.div
              key="recording"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-6"
            >
              <div className="text-cyan-400 mb-4">
                <div className="text-lg font-semibold italic">
                  Listening to your voice...
                </div>
                <div className="text-sm opacity-80">
                  Analyzing emotional patterns
                </div>
              </div>
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 rounded-full bg-gradient-to-t from-cyan-400 to-pink-500"
                    animate={{ height: [20, 60, 20] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mood Result */}
        <AnimatePresence>
          {currentMood && !isRecording && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <div className="text-center bio-glow">
                <div className="text-4xl mb-2">{moodTypes[currentMood].emoji}</div>
                <h3
                  className="text-2xl font-bold satoshi mb-2"
                  style={{ color: moodTypes[currentMood].color }}
                >
                  {moodTypes[currentMood].name}
                </h3>
                <p className="text-purple-200 italic mb-4">
                  {moodTypes[currentMood].description}
                </p>
                <Button
                  onClick={sendVoiceMessage}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-4 rounded-xl font-bold text-white shadow-lg transition-all w-full"
                >
                  <Send className="w-4 h-4 mr-2 inline-block" />
                  Send Voice Mood
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Record Button */}
        {!currentMood && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-24 h-24 rounded-full ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 heartbeat"
                  : "bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600"
              } text-white border-4 border-white/30 transition-all duration-300`}
            >
              {isRecording ? (
                <MicOff className="w-10 h-10" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </Button>
          </motion.div>
        )}

        <p className="text-purple-300 text-sm mt-4 italic">
          {isRecording
            ? "Recording your voice patterns..."
            : currentMood
            ? "Mood analyzed! Save to history"
            : "Tap to record a voice message"}
        </p>

        {errorMessage && (
          <p className="text-red-400 text-sm mt-2 italic">{errorMessage}</p>
        )}
        {transcript && (
          <p className="text-sm text-purple-200 mt-2 italic">
            Transcript: "{transcript}"
          </p>
        )}
      </div>

      {/* Mood Spectrum */}
      <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-purple-500/30 z-10">
        <h2 className="text-xl font-semibold text-white mb-4 italic flex items-center gap-2 bio-glow">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          Mood Spectrum
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(moodTypes).map(([key, mood]) => (
            <motion.div
              key={key}
              className="p-3 bg-white/5 rounded-lg border border-gray-600/30 butterfly-float"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{mood.emoji}</span>
                <span className="font-semibold" style={{ color: mood.color }}>
                  {mood.name}
                </span>
              </div>
              <p className="text-gray-300 text-sm italic">{mood.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Voice Message History */}
      <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30 z-10">
        <h2 className="text-xl font-semibold text-white mb-4 italic bio-glow">
          Recent Voice Messages
        </h2>

        <div className="space-y-3">
          <AnimatePresence>
            {voiceMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 rounded-2xl bg-purple-600/30 ml-8 bio-glow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {moodTypes[message.mood]?.emoji || "⚪"}
                    </span>
                    <span
                      className="font-semibold"
                      style={{
                        color: moodTypes[message.mood]?.color || "#E0E0E0",
                      }}
                    >
                      {moodTypes[message.mood]?.name || "Unknown"}
                    </span>
                  </div>
                  <span className="text-purple-300 text-sm">
                    {message.timestamp}
                  </span>
                </div>
                <p className="text-purple-200 italic text-sm">
                  {message.description}
                </p>
                {message.transcript && (
                  <p className="text-gray-400 text-xs italic mt-2">
                    "{message.transcript}"
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
