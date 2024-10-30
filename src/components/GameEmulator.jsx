'use client';
import { useEffect, useState } from 'react';

export default function GameEmulator({ game }) {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    setStatus('loading');
    setError(null);

    // Clear existing scripts
    const existingScripts = document.querySelectorAll('[data-emulator-script]');
    existingScripts.forEach(script => script.remove());

    try {
      // Configure emulator
      window.EJS_player = '#game';
      window.EJS_gameUrl = game.game_url;
      window.EJS_core = 'snes';
      window.EJS_pathtodata = 'https://www.emulatorjs.com/data/';
      window.EJS_startOnLoaded = true;
      window.EJS_gamepad = false;
      window.EJS_settings = true;
      window.EJS_CacheLimit = 1024;
      window.EJS_defaultControls = true;
      window.EJS_Buttons = {
        playPause: true,
        restart: true,
        mute: true,
        settings: true,
        fullscreen: true,
        saveState: true,
        loadState: true,
      };

      // Load emulator script
      const script = document.createElement('script');
      script.src = 'https://www.emulatorjs.com/data/loader.js';
      script.setAttribute('data-emulator-script', 'true');
      script.async = true;
      script.onload = () => {
        console.log('Emulator loaded successfully');
        setStatus('ready');
      };
      script.onerror = (e) => {
        setError('Failed to load emulator');
        setStatus('error');
        console.error('Emulator load error:', e);
      };
      document.body.appendChild(script);

    } catch (err) {
      setError(err.message);
      setStatus('error');
      console.error('Emulator setup error:', err);
    }

    // Cleanup
    return () => {
      const scripts = document.querySelectorAll('[data-emulator-script]');
      scripts.forEach(script => script.remove());
    };
  }, [game.game_url]);

  return (
    <div className="w-full relative">
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
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Game URL Debug (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          <p>Game URL: {game.game_url}</p>
          <p>Status: {status}</p>
          {error && <p className="text-red-400">Error: {error}</p>}
        </div>
      )}
    </div>
  );
}