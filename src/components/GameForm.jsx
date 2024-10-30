'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GameForm() {
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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add game');
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block mb-2">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full p-3 rounded bg-secondary"
          required
          placeholder="Enter game title"
        />
      </div>

      <div>
        <label className="block mb-2">Game URL</label>
        <input
          type="url"
          value={formData.game_url}
          onChange={(e) => setFormData({...formData, game_url: e.target.value})}
          className="w-full p-3 rounded bg-secondary"
          placeholder="https://example.com/game.smc"
        />
      </div>

      <div>
        <label className="block mb-2">Image URL</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
          className="w-full p-3 rounded bg-secondary"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label className="block mb-2">Category</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className="w-full p-3 rounded bg-secondary"
          placeholder="e.g., SNES, Action, RPG"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-black p-3 rounded font-medium hover:bg-accent/80 disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Game'}
      </button>
    </form>
  );
} 