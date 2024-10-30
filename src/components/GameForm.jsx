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
        body: JSON.stringify({
          ...formData,
          published: true
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add game');
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block mb-2">Game Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full p-3 rounded bg-primary border border-accent-secondary"
          required
          placeholder="Enter game title"
        />
      </div>

      <div>
        <label className="block mb-2">Game URL *</label>
        <input
          type="url"
          value={formData.game_url}
          onChange={(e) => setFormData({...formData, game_url: e.target.value})}
          className="w-full p-3 rounded bg-primary border border-accent-secondary"
          required
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block mb-2">Image URL</label>
        <input
          type="text"
          value={formData.image}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
          className="w-full p-3 rounded bg-primary border border-accent-secondary"
          placeholder="Image URL (optional)"
        />
      </div>

      <div>
        <label className="block mb-2">Category *</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className="w-full p-3 rounded bg-primary border border-accent-secondary"
          required
          placeholder="Enter category (e.g., Action, Adventure, RPG)"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-black p-3 rounded-xl font-medium hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding Game...' : 'Submit Game'}
      </button>
    </form>
  );
} 