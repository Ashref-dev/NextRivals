'use client';
import { useEffect, useState } from 'react';

export default function GameEmulator({ game }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!game?.game_url) {
      setError('Game URL not found');
      return;
    }

    // Clear any existing emulator
    const existingScript = document.getElementById('emulator-script');
    if (existingScript) {
      existingScript.remove();
    }

    // Configure emulator
    window.EJS_player = '#game';
    window.EJS_gameUrl = game.game_url;
    window.EJS_core = 'nes'; // Default to NES - you can make this dynamic
    window.EJS_pathtodata = '/data/';
    window.EJS_startOnLoaded = true;
    window.EJS_biosUrl = ''; // Add BIOS URL if needed
    window.EJS_color = '#000'; // Match your theme

    // Optional: Add more settings
    window.EJS_volume = 0.5;
    window.EJS_defaultControls = true;

    // Load emulator script
    const script = document.createElement('script');
    script.src = '/data/loader.js';
    script.id = 'emulator-script';
    script.async = true;
    script.onerror = () => setError('Failed to load emulator');
    document.body.appendChild(script);

    return () => {
      if (document.getElementById('emulator-script')) {
        document.getElementById('emulator-script').remove();
      }
    };
  }, [game?.game_url]);

  if (error) {
    return (
      <div className="w-full p-4 text-center bg-red-500/10 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-secondary rounded-lg p-4">
      <h1 className="text-2xl font-bold mb-4">{game?.title}</h1>
      
      {/* Game container */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <div id="game"></div>
      </div>

      {/* Game info */}
      <div className="mt-4 space-y-2">
        {game?.categories?.length > 0 && (
          <div className="flex gap-2">
            {game.categories.map(category => (
              <span 
                key={category.id}
                className="px-3 py-1 bg-accent-secondary rounded-full text-sm"
              >
                {category.title}
              </span>
            ))}
          </div>
        )}
        
        {game?.description && (
          <p className="text-sm text-gray-400">{game.description}</p>
        )}
      </div>
    </div>
  );
}