'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRestaurant } from '@/lib/apiClient';

export default function RestaurantForm() {
  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [address, setAddress] = useState('');
  const [rating, setRating] = useState('');
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();         
    setError(null);             

    try {
      await createRestaurant({
        name,
        cuisine: cuisine || null,
        address: address || null,
        rating: rating ? Number(rating) : null
      });

      setName('');
      setCuisine('');
      setAddress('');
      setRating('');
      router.refresh();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ruh roh');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name (required)"
        className="w-full rounded border p-2"
      />

      <input
        value={cuisine}
        onChange={(e) => setCuisine(e.target.value)}
        placeholder="Cuisine"
        className="w-full rounded border p-2"
      />

      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
        className="w-full rounded border p-2"
      />

      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        placeholder="Rating"
        className="w-full rounded border p-2"
      />
      
      <button type="submit" className="rounded bg-black px-4 py-2 text-white">
        Add
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
