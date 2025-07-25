import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { filesize } from 'filesize';

interface Document {
  id: number;
  name: string;
  url: string;
  signed: boolean;
  signed_at: string | null;
  size: number;
  type: string;
  requires_signature: boolean;
  created_at: string;
  updated_at: string;
}

export default function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`);
        if (!res.ok) throw new Error('Failed to fetch documents');
        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load documents');
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
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

  if (!documents.length) {
    return (
      <div className="p-4 bg-gray-800 rounded border border-gold text-center">
        <p className="text-gray-300">No documents found.</p>
        <button className="mt-2 px-4 py-2 bg-gold text-black font-semibold rounded hover:bg-yellow-400 transition">
          Upload Document
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div 
          key={doc.id} 
          className="group p-4 bg-gray-800/80 hover:bg-gray-800 rounded border border-gold transition-all hover:shadow-lg hover:shadow-gold/10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="font-bold text-lg text-gold group-hover:text-yellow-400 transition">
                  {doc.name}
                </div>
                {doc.signed ? (
                  <div className="px-2 py-0.5 rounded text-xs font-semibold bg-green-700 text-green-200">
                    Signed
                  </div>
                ) : doc.requires_signature ? (
                  <div className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-700 text-yellow-200 animate-pulse">
                    Signature Required
                  </div>
                ) : null}
              </div>
              <div className="text-gray-300 mt-1">
                {doc.signed 
                  ? `Signed on ${format(new Date(doc.signed_at!), 'PPP')}`
                  : doc.requires_signature 
                    ? 'Awaiting your signature'
                    : 'No signature required'
                }
              </div>
              <div className="text-sm text-gray-400 flex flex-wrap gap-4 mt-1">
                <span>File Size: {filesize(doc.size)}</span>
                <span>Type: {doc.type}</span>
                <span>Uploaded: {format(new Date(doc.created_at), 'PP')}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              {doc.requires_signature && !doc.signed && (
                <button className="px-3 py-1 bg-gold text-black hover:bg-yellow-400 rounded text-sm font-semibold transition">
                  Sign Now
                </button>
              )}
              <a 
                href={doc.url}
                download={doc.name}
                className="px-3 py-1 bg-transparent border border-gold text-gold hover:bg-gold hover:text-black rounded text-sm font-semibold transition"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
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
