import React, { useState, useEffect } from 'react';
import { Scroll, ArrowRight, Home, Square, HelpCircle, X, MessageCircle, HelpCircleIcon } from 'lucide-react';

// Interfaces for type safety
interface Choice {
  text: string;
  nextScene: string;
  image?: string;
}

interface Scene {
  id: string;
  text: string;
  image?: string;
  choices: Choice[];
}

// Q&A system for intelligent interactions
const qaPairs = [
  { q: "What's the best strategy for this game?", a: "Explore all paths! Each ending offers a unique experience." },
  { q: "Can I go back to previous choices?", a: "Yes, most scenes allow you to return to previous locations." },
  { q: "How many endings are there?", a: "There are three unique endings to discover!" },
  { q: "What's the goal of the game?", a: "The goal is to explore and find the ending that resonates with you most." }
];

// Game scenes data structure
const scenes: Record<string, Scene> = {
  start: {
    id: 'start',
    text: 'Welcome to the Adventure!',
    image: 'https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?auto=format&fit=crop&q=80&w=2000',
    choices: [{
      text: 'Begin Journey',
      nextScene: 'crossroads'
    }]
  },
  crossroads: {
    id: 'crossroads',
    text: 'You find yourself at a mysterious crossroads. Three paths lie before you.',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=2000',
    choices: [
      {
        text: 'Take the misty forest path',
        nextScene: 'forest',
        image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=500'
      },
      {
        text: 'Enter the ancient ruins',
        nextScene: 'ruins',
        image: 'https://images.unsplash.com/photo-1549893072-4bc678117f45?auto=format&fit=crop&q=80&w=500'
      },
      {
        text: 'Follow the mountain trail',
        nextScene: 'mountain',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=500'
      }
    ]
  },
  forest: {
    id: 'forest',
    text: 'The forest is dense and magical. You hear strange whispers.',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=2000',
    choices: [
      {
        text: 'Follow the whispers',
        nextScene: 'fairy',
      },
      {
        text: 'Return to crossroads',
        nextScene: 'crossroads',
      }
    ]
  },
  ruins: {
    id: 'ruins',
    text: 'Ancient stones tell tales of forgotten civilizations.',
    image: 'https://images.unsplash.com/photo-1549893072-4bc678117f45?auto=format&fit=crop&q=80&w=2000',
    choices: [
      {
        text: 'Explore deeper',
        nextScene: 'treasure',
      },
      {
        text: 'Return to crossroads',
        nextScene: 'crossroads',
      }
    ]
  },
  mountain: {
    id: 'mountain',
    text: 'The air gets thinner as you climb the mountain path.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000',
    choices: [
      {
        text: 'Climb to the peak',
        nextScene: 'peak',
      },
      {
        text: 'Return to crossroads',
        nextScene: 'crossroads',
      }
    ]
  },
  fairy: {
    id: 'fairy',
    text: 'You discover a fairy grove! The magical beings offer you eternal happiness in their realm.',
    image: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&q=80&w=2000',
    choices: [
      {
        text: 'Accept and end your journey',
        nextScene: 'end-fairy',
      },
      {
        text: 'Return to the forest',
        nextScene: 'forest',
      }
    ]
  },
  treasure: {
    id: 'treasure',
    text: "You've found an ancient treasure chamber filled with gold!",
    image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&q=80&w=2000',
    choices: [
      {
        text: 'Take the treasure and end your journey',
        nextScene: 'end-treasure',
      },
      {
        text: 'Return to the ruins',
        nextScene: 'ruins',
      }
    ]
  },
  peak: {
    id: 'peak',
    text: 'From the mountain peak, you can see all the realms. You feel at peace.',
    image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&q=80&w=2000',
    choices: [
      {
        text: 'Embrace peace and end your journey',
        nextScene: 'end-peace',
      },
      {
        text: 'Return to the mountain path',
        nextScene: 'mountain',
      }
    ]
  },
  'end-fairy': {
    id: 'end-fairy',
    text: 'You chose to stay in the fairy realm, living in eternal bliss and magic.',
    image: 'https://images.unsplash.com/photo-1639628735078-ed2f038a193e?auto=format&fit=crop&q=80&w=2000',
    choices: [{
      text: 'Play Again',
      nextScene: 'start'
    }]
  },
  'end-treasure': {
    id: 'end-treasure',
    text: 'With the ancient treasure, you become the wealthiest person in all the realms.',
    image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&q=80&w=2000',
    choices: [{
      text: 'Play Again',
      nextScene: 'start'
    }]
  },
  'end-peace': {
    id: 'end-peace',
    text: 'You found inner peace and wisdom atop the mountain, becoming a legendary sage.',
    image: 'https://images.unsplash.com/photo-1682686580003-22d3d65399a8?auto=format&fit=crop&q=80&w=2000',
    choices: [{
      text: 'Play Again',
      nextScene: 'start'
    }]
  }
};

// Help menu content
const helpContent = [
  { title: "Navigation", content: "Click on choices to progress through the story. Your decisions matter!" },
  { title: "Progress", content: "Your journey stats and history are tracked on the right panel." },
  { title: "Returning", content: "Most locations allow you to return to previous areas." },
  { title: "Endings", content: "There are three unique endings to discover. Choose wisely!" }
];

// Tooltip component
const Tooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block">
    <HelpCircleIcon className="w-5 h-5 text-gray-400 hover:text-purple-400 transition-colors duration-200" />
    <div className="absolute hidden group-hover:block bg-gray-800 text-white p-2 rounded-lg text-sm w-48 bottom-full left-1/2 transform -translate-x-1/2 mb-2 shadow-lg">
      {text}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
    </div>
  </div>
);

function App() {
  // State management
  const [isStarted, setIsStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [playerAge, setPlayerAge] = useState("");
  const [nameError, setNameError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [currentScene, setCurrentScene] = useState<string>('start');
  const [moves, setMoves] = useState(0);
  const [history, setHistory] = useState<Array<{ scene: string; choice: string }>>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [showQA, setShowQA] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  // Animation effect
  useEffect(() => {
    setFadeIn(true);
  }, [currentScene]);

  // Enhanced name and age validation
  const validateAndSetName = () => {
    // Check for numbers, special characters, or emojis using regex
    if (!/^[a-zA-Z\s]+$/.test(playerName)) {
      setNameError("Please use only letters (A-Z) in your name!");
      return false;
    }
    if (playerName.trim().length < 2) {
      setNameError("Please enter a name with at least 2 characters!");
      return false;
    }

    // Age validation
    const age = parseInt(playerAge);
    if (isNaN(age) || !Number.isInteger(age) || age < 0 || age > 150) {
      setAgeError("Please enter a valid age between 0 and 150!");
      return false;
    }
    if (age < 8) {
      setAgeError("Sorry, you must be at least 8 years old to play this game!");
      return false;
    }

    setNameError("");
    setAgeError("");
    setIsStarted(true);
    setShowNameInput(false);
    return true;
  };

  // Handle player choices
  const handleChoice = (choice: Choice) => {
    setFadeIn(false);
    setTimeout(() => {
      setHistory(prev => [...prev, { 
        scene: currentScene,
        choice: choice.text 
      }]);
      setCurrentScene(choice.nextScene);
      setMoves(prev => prev + 1);

      if (choice.nextScene === 'start') {
        setMoves(0);
        setHistory([]);
      }
      setFadeIn(true);
    }, 300);
  };

  // Reset game state
  const resetGame = () => {
    setCurrentScene('start');
    setMoves(0);
    setHistory([]);
    setPlayerName("");
    setPlayerAge("");
    setIsStarted(false);
    setShowNameInput(false);
  };

  const scene = scenes[currentScene];
  const isEndScene = currentScene.startsWith('end-');

  // Render start screen
  if (!isStarted && !showNameInput) {
    return (
      <div 
        className="min-h-screen bg-gray-900 text-white flex items-center justify-center bg-cover bg-center transition-opacity duration-500"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?auto=format&fit=crop&q=80&w=2000)' }}
      >
        <div className="text-center p-8 bg-black bg-opacity-50 rounded-xl backdrop-blur-sm">
          <h1 className="text-6xl font-bold mb-8 animate-fade-in">The Adventure Game!</h1>
          <p className="text-xl mb-8 text-gray-300">By: Guru Velivelli</p>
          <button
            onClick={() => setShowNameInput(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-200 flex items-center gap-2 mx-auto hover:scale-105"
          >
            Start Game <ArrowRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Update the name and age input screen
  if (showNameInput) {
    return (
      <div 
        className="min-h-screen bg-gray-900 text-white flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?auto=format&fit=crop&q=80&w=2000)' }}
      >
        <div className="text-center p-8 bg-black bg-opacity-50 rounded-xl backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-6">Welcome, brave adventurer!</h2>
          
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <label htmlFor="name" className="text-gray-300">What is your name?</label>
              <Tooltip text="Enter your name using only letters (A-Z). No numbers or special characters allowed." />
            </div>
            <input
              id="name"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg mb-2 w-64"
              placeholder="Enter your name..."
            />
            {nameError && (
              <p className="text-red-500 text-sm animate-shake">{nameError}</p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <label htmlFor="age" className="text-gray-300">How old are you?</label>
              <Tooltip text="Enter your age (8-150). Must be a whole number." />
            </div>
            <input
              id="age"
              type="number"
              value={playerAge}
              onChange={(e) => setPlayerAge(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg mb-2 w-64"
              placeholder="Enter your age..."
              min="0"
              max="150"
            />
            {ageError && (
              <p className="text-red-500 text-sm animate-shake">{ageError}</p>
            )}
          </div>

          <button
            onClick={validateAndSetName}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 hover:scale-105"
          >
            Begin Adventure
          </button>
        </div>
      </div>
    );
  }

  // Render main game interface
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Scroll /> Adventure Quest
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowHelp(true)}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
            >
              <HelpCircle size={20} /> Help
            </button>
            <button
              onClick={() => setShowQA(true)}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
            >
              <MessageCircle size={20} /> Q&A
            </button>
            <button
              onClick={() => setShowNameInput(true)}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
            >
              <Home size={20} /> Main Menu
            </button>
            <button
              onClick={resetGame}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
            >
              <Square size={20} /> Stop Game
            </button>
          </div>
        </div>

        {/* Help Modal */}
        {showHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full m-4 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Game Help</h2>
                <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                {helpContent.map((item, index) => (
                  <div key={index} className="border-b border-gray-700 pb-4">
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p>{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Q&A Modal */}
        {showQA && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full m-4 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Questions & Answers</h2>
                <button onClick={() => setShowQA(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                {qaPairs.map((qa, index) => (
                  <div key={index} className="border-b border-gray-700 pb-4">
                    <button
                      onClick={() => setSelectedQuestion(selectedQuestion === index ? null : index)}
                      className="w-full text-left font-bold hover:text-purple-400 transition-colors duration-200"
                    >
                      {qa.q}
                    </button>
                    {selectedQuestion === index && (
                      <p className="mt-2 text-gray-300 animate-fade-in">{qa.a}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main game content */}
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            {/* Welcome message with player name */}
            <div className="mb-6 text-xl font-bold text-purple-400">
              {`Welcome, ${playerName}! Your adventure continues...`}
            </div>
            
            {/* Scene image with fade transition */}
            {scene.image && (
              <div className={`transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
                <img
                  src={scene.image}
                  alt={scene.text}
                  className="w-full h-96 object-cover rounded-lg mb-6"
                />
              </div>
            )}
            
            {/* Scene text and choices */}
            <div className={`bg-gray-800 p-6 rounded-lg mb-6 transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-xl mb-6">{scene.text}</p>
              <div className="grid grid-cols-1 gap-4">
                {scene.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoice(choice)}
                    className="bg-purple-600 hover:bg-purple-700 p-4 rounded-lg transition-all duration-200 flex items-center gap-4 hover:scale-102 hover:shadow-lg"
                  >
                    <div className="flex-1">{choice.text}</div>
                    <ArrowRight className="animate-pulse" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Journey Stats */}
          <div className="bg-gray-800 p-6 rounded-lg h-fit">
            <h2 className="text-xl font-bold mb-4">Journey Stats</h2>
            <p className="mb-2">Adventurer: {playerName}</p>
            <p className="mb-2">Age: {playerAge} years</p>
            <p className="mb-4">Moves Made: {moves}</p>
            <h3 className="font-bold mb-2">Choice History:</h3>
            <div className="space-y-2">
              {history.map((item, index) => (
                <div 
                  key={index} 
                  className="text-sm text-gray-300 transition-all duration-200 hover:text-purple-400"
                >
                  {index + 1}. {item.choice}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;