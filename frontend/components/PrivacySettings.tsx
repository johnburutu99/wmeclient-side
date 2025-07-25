import React from 'react';

const dummyConsents = [
  { id: 1, consent_type: 'GDPR', granted: true },
  { id: 2, consent_type: 'CCPA', granted: false },
];

export default function PrivacySettings() {
  return (
    <div className="space-y-4">
      {dummyConsents.map((c) => (
        <div key={c.id} className="p-4 bg-gray-800 rounded border border-gold flex items-center justify-between">
          <div className="font-bold text-gold">{c.consent_type}</div>
          <div>
            <span className={`px-3 py-1 rounded text-xs font-semibold ${c.granted ? 'bg-green-700 text-green-200' : 'bg-red-700 text-red-200'}`}>{c.granted ? 'Granted' : 'Revoked'}</span>
            <button className="ml-4 px-3 py-1 rounded bg-gold text-black text-xs font-semibold hover:bg-yellow-400 transition">
              {c.granted ? 'Revoke' : 'Grant'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
