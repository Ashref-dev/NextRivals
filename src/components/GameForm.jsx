'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GameForm({ categories }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    game_url: '',
    image: '',
    category: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          published: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add game');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded">
          {error}
        </div>
      )}

      {/* Game Title */}
      <div>
        <label className="block mb-2">Game Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full p-3 rounded bg-secondary border border-accent-secondary"
          required
          placeholder="Enter game title"
        />
      </div>

      {/* Game URL */}
      <div>
        <label className="block mb-2">Game ROM URL *</label>
        <input
          type="url"
          value={formData.game_url}
          onChange={(e) => setFormData({...formData, game_url: e.target.value})}
          className="w-full p-3 rounded bg-secondary border border-accent-secondary"
          required
          placeholder="https://example.com/game.nes"
        />
        <p className="text-sm text-gray-400 mt-1">
          Direct link to ROM file (.nes, .smc, .gba, etc.)
        </p>
      </div>

      {/* Image URL */}
      <div>
        <label className="block mb-2">Game Image URL</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
          className="w-full p-3 rounded bg-secondary border border-accent-secondary"
          placeholder="https://example.com/image.jpg"
        />
        <p className="text-sm text-gray-400 mt-1">
          Direct link to game cover/screenshot image
        </p>
      </div>

      {/* Category */}
      <div>
        <label className="block mb-2">Category *</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className="w-full p-3 rounded bg-secondary border border-accent-secondary"
          required
          placeholder="Enter category (e.g., Action, Adventure, RPG)"
        />
      </div>

      {/* Preview */}
      {formData.image && (
        <div className="mt-4">
          <label className="block mb-2">Image Preview</label>
          <div className="relative aspect-video bg-black/20 rounded-lg overflow-hidden">
            <img
              src={formData.image}
              alt="Preview"
              className="object-contain w-full h-full"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-black p-3 rounded-xl font-medium hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding Game...' : 'Submit Game'}
      </button>

      {/* Supported Formats */}
      <div className="text-sm text-gray-400 bg-secondary/50 p-4 rounded-lg">
        <h3 className="font-medium text-white mb-2">Supported Game Formats:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>NES Games (.nes)</li>
          <li>SNES Games (.smc, .sfc)</li>
          <li>Game Boy / Color (.gb, .gbc)</li>
          <li>Game Boy Advance (.gba)</li>
          <li>Nintendo 64 (.n64, .z64)</li>
          <li>Sega Genesis (.md, .gen)</li>
          <li>PlayStation (.iso, .bin)</li>
        </ul>
      </div>
    </form>
  );
} 