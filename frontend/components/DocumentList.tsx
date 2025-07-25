import React from 'react';

const dummyDocuments = [
  {
    id: 1,
    name: 'NDA.pdf',
    url: '#',
    signed: true,
    signed_at: '2025-07-01',
  },
  {
    id: 2,
    name: 'Contract.pdf',
    url: '#',
    signed: false,
    signed_at: null,
  },
];

export default function DocumentList() {
  return (
    <div className="space-y-4">
      {dummyDocuments.map((doc) => (
        <div key={doc.id} className="p-4 bg-gray-800 rounded border border-gold flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-bold text-lg text-gold">{doc.name}</div>
            <div className="text-gray-300">{doc.signed ? `Signed at: ${doc.signed_at}` : 'Unsigned'}</div>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <a href={doc.url} className="px-3 py-1 rounded bg-blue-700 text-white text-xs font-semibold" download>
              Download
            </a>
            {!doc.signed && (
              <button className="px-3 py-1 rounded bg-gold text-black text-xs font-semibold hover:bg-yellow-400 transition">
                Sign with DocuSign
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
