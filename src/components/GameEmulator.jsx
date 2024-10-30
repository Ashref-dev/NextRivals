'use client';
import { useEffect } from 'react';

export default function GameEmulator({ game }) {
  useEffect(() => {
    // Remove any existing emulator
    const existingScript = document.getElementById('emulatorScript');
    if (existingScript) {
      existingScript.remove();
    }

    // Set up EmulatorJS configuration
    window.EJS_player = '#game';
    window.EJS_gameUrl = game.game_url;
    window.EJS_core = 'snes';
    // Use CDN path
    window.EJS_pathtodata = 'https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@latest/data/';

    // Load EmulatorJS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/EmulatorJS/EmulatorJS@latest/data/loader.js';
    script.id = 'emulatorScript';
    document.body.appendChild(script);

    return () => {
      if (document.getElementById('emulatorScript')) {
        document.getElementById('emulatorScript').remove();
      }
    };
  }, [game.game_url]);

  return (
    <div className="w-full">
      <div id="game" className="aspect-video"></div>
    </div>
  );
}