
import dynamic from 'next/dynamic';
const PaymentList = dynamic(() => import('../../components/PaymentList'), { ssr: false });

export default function PaymentsPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold text-gold mb-6">Invoices & Payments</h1>
      <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gold">
        <PaymentList />
      </div>
    </main>
  );
}
