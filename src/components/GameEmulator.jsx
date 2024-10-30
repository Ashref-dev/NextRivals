'use client';
import { useEffect, useState } from 'react';

const CORE_MAPPINGS = {
  // Nintendo
  'nes': 'nes',
  'smc': 'snes',
  'sfc': 'snes',
  'n64': 'n64',
  'z64': 'n64',
  'gb': 'gb',
  'gbc': 'gb',
  'gba': 'gba',
  // Sega
  'md': 'segaMD',
  'gen': 'segaMD',
  // Sony
  'iso': 'psx',
  'bin': 'psx'
};

export default function GameEmulator({ game }) {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  const detectCore = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    return CORE_MAPPINGS[extension] || 'snes';
  };

  useEffect(() => {
    setStatus('loading');
    setError(null);

    try {
      // Configure EmulatorJS
      window.EJS_player = '#game';
      window.EJS_gameUrl = game.game_url;
      window.EJS_core = detectCore(game.game_url);
      window.EJS_pathtodata = 'https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@latest/data/';
      window.EJS_startOnLoaded = true;
      window.EJS_Settings = true;
      window.EJS_Buttons = {
        playPause: true,
        restart: true,
        mute: true,
        settings: true,
        fullscreen: true,
        saveState: true,
        loadState: true,
        screenRecord: true,
        screenshot: true,
      };

      // Load EmulatorJS script
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@latest/data/loader.js';
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
      console.error('Setup error:', err);
    }

    return () => {
      const scripts = document.querySelectorAll('script[src*="EmulatorJS"]');
      scripts.forEach(script => script.remove());
    };
  }, [game.game_url]);

  return (
    <div className="w-full relative">
      <div id="game" className="aspect-video bg-black rounded-lg"></div>

      {/* Loading State */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent mb-4"></div>
            <p className="text-accent">Loading Game...</p>
          </div>
        </div>
      )}

      {/* Error State */}
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

      {/* Game Info */}
      {status === 'ready' && (
        <div className="mt-4 text-sm text-gray-400">
          <p>Console: {detectCore(game.game_url).toUpperCase()}</p>
          <p>Controls: Arrow keys (D-Pad), Z (A), X (B), Enter (Start), Shift (Select)</p>
          <p>Save States: Use the menu to save/load your progress</p>
        </div>
      )}
    </div>
  );
}