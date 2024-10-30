'use client';
import { useState } from 'react';

const CORE_MAPPINGS = {
  'nes': 'fceumm',      // NES
  'snes': 'snes9x',     // SNES
  'gba': 'mgba',        // Game Boy Advance
  'gb': 'gambatte',     // Game Boy
  'gbc': 'gambatte',    // Game Boy Color
  'n64': 'mupen64plus', // Nintendo 64
  'sega': 'genesis_plus_gx', // Sega Genesis
  'psx': 'beetle_psx',  // PlayStation
};

export default function GameEmulator({ game }) {
  const [isLoading, setIsLoading] = useState(true);

  // Determine core based on file extension or game type
  const getCore = (gameUrl) => {
    const extension = gameUrl.split('.').pop().toLowerCase();
    switch (extension) {
      case 'nes': return 'fceumm';
      case 'smc':
      case 'sfc': return 'snes9x';
      case 'gba': return 'mgba';
      case 'gb': return 'gambatte';
      case 'gbc': return 'gambatte';
      case 'n64':
      case 'z64': return 'mupen64plus';
      case 'md':
      case 'gen': return 'genesis_plus_gx';
      case 'iso':
      case 'bin': return 'beetle_psx';
      default: return 'snes9x'; // Default to SNES
    }
  };

  const core = getCore(game.game_url);
  const retroarchUrl = `https://www.retroarch.com/?core=${core}`;

  return (
    <div className="w-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent mb-4"></div>
            <p className="text-accent">Loading Emulator...</p>
          </div>
        </div>
      )}

      <iframe
        src={`${retroarchUrl}&rom=${encodeURIComponent(game.game_url)}`}
        className="w-full aspect-video rounded-lg bg-black"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
        style={{ border: 'none' }}
      />

      {/* Game Info */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Console: {core.toUpperCase()}</span>
          <span>•</span>
          <span>Controls: Arrow keys, Z (A), X (B), Enter (Start), Shift (Select)</span>
        </div>
      </div>
    </div>
  );
}