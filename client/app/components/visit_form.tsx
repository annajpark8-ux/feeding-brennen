'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createVisit } from '@/lib/apiClient';

export default function VisitForm({ restaurantId }: { restaurantId: number }) {
  const [date, setDate] = useState('');
  const [amountSpent, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();         
    setError(null);             

    try {
      await createVisit({
        restaurantId,
        date,
        amountSpent: amountSpent ? Number(amountSpent) : null,
        notes: notes || null,
      });

      setDate('');
      setAmount('');
      setNotes('');
      router.refresh();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ruh roh');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-2">
      <input
        value={date}
        onChange={(e) => setDate(e.target.value)}
        placeholder="Date (required)"
        type="date"
        className="w-full rounded border p-2"
      />

      <input
        value={amountSpent}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount Spent"
        type="number" step="0.01"
        className="w-full rounded border p-2"
      />

      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
        className="w-full rounded border p-2"
      />
      
      <button type="submit" className="rounded bg-black px-4 py-2 text-white">
        Add
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
