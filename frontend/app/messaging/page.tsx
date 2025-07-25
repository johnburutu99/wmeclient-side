
import dynamic from 'next/dynamic';
const MessageList = dynamic(() => import('../../components/MessageList'), { ssr: false });

export default function MessagingPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold text-gold mb-6">Messaging Center</h1>
      <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gold">
        <MessageList />
      </div>
    </main>
  );
}
