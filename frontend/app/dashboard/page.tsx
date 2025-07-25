
import dynamic from 'next/dynamic';
const BookingList = dynamic(() => import('../../components/BookingList'), { ssr: false });

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold text-gold mb-6">Booking Dashboard</h1>
      <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gold">
        <BookingList />
      </div>
    </main>
  );
}
