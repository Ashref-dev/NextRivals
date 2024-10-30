'use client';
import { useEffect, useState } from 'react';

export default function GameEmulator({ game }) {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset states on new game
    setStatus('loading');
    setError(null);

    // Clear existing
    const existingScript = document.getElementById('emulatorScript');
    if (existingScript) {
      existingScript.remove();
    }

    // Validate game URL
    if (!game.game_url) {
      setError('Game URL is missing');
      setStatus('error');
      return;
    }

    try {
      // Configure emulator
      window.EJS_player = '#game';
      window.EJS_gameUrl = game.game_url;
      window.EJS_core = 'snes';
      window.EJS_pathtodata = 'https://rawcdn.githack.com/EmulatorJS/EmulatorJS/main/data/';
      window.EJS_startOnLoaded = true;
      window.EJS_gamepad = true;
      window.EJS_settings = true;
      window.EJS_SaveState = true;

      // Add custom loading handler
      window.EJS_onGameStart = () => {
        setStatus('ready');
        console.log('Game started successfully');
      };

      // Load required scripts in order
      const scripts = [
        'https://rawcdn.githack.com/EmulatorJS/EmulatorJS/main/data/gamepad.js',
        'https://rawcdn.githack.com/EmulatorJS/EmulatorJS/main/data/loader.js'
      ];

      const loadScripts = async () => {
        for (const src of scripts) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => {
              console.log(`Loaded: ${src}`);
              resolve();
            };
            script.onerror = () => {
              reject(new Error(`Failed to load: ${src}`));
            };
            document.body.appendChild(script);
          });
        }
      };

      loadScripts().catch((err) => {
        setError(err.message);
        setStatus('error');
        console.error('Script loading error:', err);
      });

    } catch (err) {
      setError(err.message);
      setStatus('error');
      console.error('Emulator setup error:', err);
    }

    // Cleanup
    return () => {
      document.querySelectorAll('script[src*="EmulatorJS"]').forEach(script => {
        script.remove();
      });
    };
  }, [game.game_url]);

  return (
    <div className="w-full relative">
      {/* Game Container */}
      <div id="game" className="aspect-video bg-black rounded-lg"></div>

      {/* Loading Overlay */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent mb-4"></div>
            <p className="text-accent">Loading Game...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 rounded-lg">
          <div className="bg-red-500/10 p-4 rounded-lg border border-red-500 max-w-md">
            <h3 className="text-red-500 font-bold mb-2">Failed to load game</h3>
            <p className="text-red-400 text-sm">{error}</p>
            <div className="mt-4 text-xs text-red-400">
              <p>Troubleshooting:</p>
              <ul className="list-disc list-inside">
                <li>Check if the game URL is valid</li>
                <li>Ensure the ROM file is accessible</li>
                <li>Try refreshing the page</li>
              </ul>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          <p>Status: {status}</p>
          <p>Game URL: {game.game_url}</p>
          {error && <p className="text-red-400">Error: {error}</p>}
        </div>
      )}
    </div>
  );
}