import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface Booking {
  id: number;
  artist: string;
  event_date: string;
  status: string;
  coordinator?: {
    name: string;
    email: string;
  };
  created_at: string;
}

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`);
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-gray-800 rounded border border-gold animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/5"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500 rounded text-red-200">
        Error: {error}
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="p-4 bg-gray-800 rounded border border-gold text-center">
        <p className="text-gray-300">No bookings found.</p>
        <button className="mt-2 px-4 py-2 bg-gold text-black font-semibold rounded hover:bg-yellow-400 transition">
          Create New Booking
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <div 
          key={b.id} 
          className="group p-4 bg-gray-800/80 hover:bg-gray-800 rounded border border-gold transition-all hover:shadow-lg hover:shadow-gold/10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="font-bold text-lg text-gold group-hover:text-yellow-400 transition">
                  {b.artist}
                </div>
                <div className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  b.status === 'Confirmed' ? 'bg-green-700 text-green-200' : 
                  b.status === 'Pending' ? 'bg-yellow-700 text-yellow-200' : 
                  'bg-red-700 text-red-200'
                }`}>
                  {b.status}
                </div>
              </div>
              <div className="text-gray-300 mt-1">
                Event Date: {format(new Date(b.event_date), 'PPP')}
              </div>
              <div className="text-sm text-gray-400 flex items-center gap-4 mt-1">
                <span>Booking ID: {b.id}</span>
                {b.coordinator && (
                  <span>Coordinator: {b.coordinator.name}</span>
                )}
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <button className="px-3 py-1 bg-transparent border border-gold text-gold hover:bg-gold hover:text-black rounded text-sm font-semibold transition">
                Details
              </button>
              <button className="px-3 py-1 bg-gold text-black hover:bg-yellow-400 rounded text-sm font-semibold transition">
                Contact
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
