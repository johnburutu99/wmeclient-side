
import dynamic from 'next/dynamic';
const PrivacySettings = dynamic(() => import('../../components/PrivacySettings'), { ssr: false });

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold text-gold mb-6">Privacy & Compliance</h1>
      <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gold">
        <PrivacySettings />
      </div>
    </main>
  );
}
