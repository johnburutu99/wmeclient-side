import React from 'react';

const dummyPayments = [
  { id: 1, amount: 5000, currency: 'USD', status: 'Paid', receipt_url: '#' },
  { id: 2, amount: 2500, currency: 'USD', status: 'Pending', receipt_url: '#' },
];

export default function PaymentList() {
  return (
    <div className="space-y-4">
      {dummyPayments.map((p) => (
        <div key={p.id} className="p-4 bg-gray-800 rounded border border-gold flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-bold text-lg text-gold">${p.amount} {p.currency}</div>
            <div className="text-sm text-gray-400">Payment ID: {p.id}</div>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <span className={`px-3 py-1 rounded text-xs font-semibold ${p.status === 'Paid' ? 'bg-green-700 text-green-200' : 'bg-yellow-700 text-yellow-200'}`}>{p.status}</span>
            <a href={p.receipt_url} className="px-3 py-1 rounded bg-blue-700 text-white text-xs font-semibold" download>Receipt</a>
          </div>
        </div>
      ))}
    </div>
  );
}
