'use client';
import { useEffect } from 'react';

export default function GameEmulator({ game }) {
  useEffect(() => {
    // Basic configuration
    window.EJS_player = '#game';
    window.EJS_gameUrl = game.game_url;
    window.EJS_core = 'snes';  // Changed to SNES
    window.EJS_pathtodata = 'data/';

    // Load emulator
    const script = document.createElement('script');
    script.src = 'data/loader.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, [game.game_url]);

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <div id="game"></div>
    </div>
  );
}