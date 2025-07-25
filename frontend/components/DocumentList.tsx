import React, { useCallback, useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { filesize } from 'filesize';
import { Document as PDFDocument, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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
  status?: 'uploading' | 'processing' | 'error';
  upload_progress?: number;
  preview_url?: string;
  last_viewed?: string;
  shared_with?: Array<{ id: number; name: string; email: string }>;
  version?: number;
  description?: string;
}

interface DocumentVersion {
  id: number;
  document_id: number;
  version: number;
  created_at: string;
  created_by: string;
  changes: string;
}
  signed: boolean;
  signed_at: string | null;
  size: number;
  type: string;
  requires_signature: boolean;
  created_at: string;
  updated_at: string;
  status?: 'uploading' | 'processing' | 'error';
  upload_progress?: number;
  preview_url?: string;
  last_viewed?: string;
  shared_with?: { id: number; name: string; email: string }[];
  version?: number;
  description?: string;
}

interface DocumentVersion {
  id: number;
  document_id: number;
  version: number;
  created_at: string;
  created_by: string;
  changes: string;
}

export default function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [previewPage, setPreviewPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const fetchDocuments = useCallback(async () => {
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
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.classList.contains('drag-active')) {
      e.currentTarget.classList.add('drag-active');
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-active');
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-active');
    
    if (!e.dataTransfer?.files.length) return;
    await handleFileUpload(Array.from(e.dataTransfer.files));
  }, []);

  const handleFileUpload = useCallback(async (files: File[]) => {
    for (const file of files) {
      const optimisticDoc: Document = {
        id: Date.now(),
        name: file.name,
        url: URL.createObjectURL(file),
        signed: false,
        signed_at: null,
        size: file.size,
        type: file.type,
        requires_signature: file.type === 'application/pdf',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'uploading',
        upload_progress: 0
      };

      setDocuments(prev => [optimisticDoc, ...prev]);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type);
      formData.append('requires_signature', String(file.type === 'application/pdf'));

      try {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            setUploadProgress(prev => ({ ...prev, [optimisticDoc.id]: progress }));
          }
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Failed to upload document');

        const data = await response.json();
        setDocuments(prev => prev.map(doc => 
          doc.id === optimisticDoc.id ? { ...data, preview_url: URL.createObjectURL(file) } : doc
        ));
      } catch (err) {
        setDocuments(prev => prev.map(doc => 
          doc.id === optimisticDoc.id ? { ...doc, status: 'error' } : doc
        ));
        setError(err instanceof Error ? err.message : 'Failed to upload document');
      }
    }
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
    fetchDocuments();

    // Fetch documents on mount
    fetchDocuments();
  }, []);
      };

      dropZone.addEventListener('dragenter', preventDefault);
      dropZone.addEventListener('dragover', preventDefault);
      dropZone.addEventListener('dragleave', preventDefault);
      dropZone.addEventListener('drop', handleDrop as EventListener);

      return () => {
        dropZone.removeEventListener('dragenter', preventDefault);
        dropZone.removeEventListener('dragover', preventDefault);
        dropZone.removeEventListener('dragleave', preventDefault);
        dropZone.removeEventListener('drop', handleDrop as EventListener);
      };
    }
  }, []);

  const handleFileUpload = async (files: File[]) => {
    for (const file of files) {
      // Create optimistic document
      const optimisticDoc: Document = {
        id: Date.now(),
        name: file.name,
        url: URL.createObjectURL(file),
        signed: false,
        signed_at: null,
        size: file.size,
        type: file.type,
        requires_signature: file.type === 'application/pdf',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'uploading',
        upload_progress: 0
      };

      setDocuments(prev => [optimisticDoc, ...prev]);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type);
      formData.append('requires_signature', String(file.type === 'application/pdf'));

      try {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            setUploadProgress(prev => ({ ...prev, [optimisticDoc.id]: progress }));
          }
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Failed to upload document');

        const data = await response.json();
        setDocuments(prev => prev.map(doc => 
          doc.id === optimisticDoc.id ? { ...data, preview_url: URL.createObjectURL(file) } : doc
        ));
      } catch (err) {
        setDocuments(prev => prev.map(doc => 
          doc.id === optimisticDoc.id ? { ...doc, status: 'error' } : doc
        ));
        setError(err instanceof Error ? err.message : 'Failed to upload document');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.classList.contains('drag-active')) {
      e.currentTarget.classList.add('drag-active');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-active');
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-active');
    
    if (!e.dataTransfer?.files.length) return;
    await handleFileUpload(Array.from(e.dataTransfer.files));
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

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
        <button 
          onClick={() => setError(null)} 
          className="ml-4 underline hover:no-underline focus:outline-none"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div 
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="p-6 border-2 border-dashed border-gray-700 rounded-lg transition-colors hover:border-gold/50 group"
      >
        <div className="text-center">
          <svg 
            className="w-12 h-12 mx-auto text-gray-400 group-hover:text-gold transition-colors" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
          <p className="mt-4 text-gray-300">
            Drag and drop your documents here, or{' '}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-gold hover:text-yellow-400 focus:outline-none"
            >
              browse
            </button>
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG (max 50MB)
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
          onChange={(e) => {
            if (e.target.files) {
              handleFileUpload(Array.from(e.target.files));
              e.target.value = '';
            }
          }}
        />
      </div>

      {!documents.length ? (
        <div className="p-4 bg-gray-800 rounded border border-gold text-center">
          <p className="text-gray-300">No documents found.</p>
          <p className="mt-2 text-sm text-gray-400">
            Upload your first document to get started.
          </p>
        </div>
      ) : null}

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div 
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="p-6 border-2 border-dashed border-gray-700 rounded-lg transition-colors hover:border-gold/50 group"
      >
        <div className="text-center">
          <svg 
            className="w-12 h-12 mx-auto text-gray-400 group-hover:text-gold transition-colors" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
          <p className="mt-4 text-gray-300">
            Drag and drop your documents here, or{' '}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-gold hover:text-yellow-400 focus:outline-none"
            >
              browse
            </button>
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG (max 50MB)
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
          onChange={(e) => {
            if (e.target.files) {
              handleFileUpload(Array.from(e.target.files));
              e.target.value = '';
            }
          }}
        />
      </div>

      {/* Document List */}
      {documents.map((doc) => (
        <div 
          key={doc.id} 
          className={`group p-4 bg-gray-800/80 hover:bg-gray-800 rounded border transition-all ${
            doc.status === 'error' ? 'border-red-500' :
            doc.status === 'uploading' ? 'border-yellow-500' :
            'border-gold hover:shadow-lg hover:shadow-gold/10'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-start md:gap-4">
            {/* Preview */}
            {doc.type === 'application/pdf' && doc.preview_url && (
              <div className="w-32 h-40 bg-black/50 rounded overflow-hidden flex items-center justify-center">
                <PDFDocument file={doc.preview_url} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page 
                    pageNumber={1} 
                    width={128}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </PDFDocument>
              </div>
            )}

            {/* Document Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-lg text-gold group-hover:text-yellow-400 transition">
                      {doc.name}
                    </div>
                    {doc.status === 'uploading' ? (
                      <div className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-700 text-yellow-200">
                        Uploading {uploadProgress[doc.id]?.toFixed(0)}%
                      </div>
                    ) : doc.status === 'error' ? (
                      <div className="px-2 py-0.5 rounded text-xs font-semibold bg-red-700 text-red-200">
                        Upload Failed
                      </div>
                    ) : doc.signed ? (
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
                    {doc.status === 'error' ? (
                      'Failed to upload. Please try again.'
                    ) : doc.signed ? (
                      `Signed on ${format(new Date(doc.signed_at!), 'PPP')}`
                    ) : doc.requires_signature ? (
                      'Awaiting your signature'
                    ) : (
                      'No signature required'
                    )}
                  </div>

                  <div className="text-sm text-gray-400 flex flex-wrap gap-4 mt-1">
                    <span>Size: {filesize(doc.size)}</span>
                    <span>Type: {doc.type.split('/')[1].toUpperCase()}</span>
                    <span>Uploaded: {format(new Date(doc.created_at), 'PP')}</span>
                    {doc.version && <span>Version: {doc.version}</span>}
                  </div>

                  {doc.description && (
                    <p className="mt-2 text-sm text-gray-300">{doc.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {doc.status === 'uploading' ? (
                    <button
                      onClick={() => {
                        setDocuments(prev => prev.filter(d => d.id !== doc.id));
                      }}
                      className="text-gray-400 hover:text-white"
                      title="Cancel upload"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ) : (
                    <>
                      {doc.requires_signature && !doc.signed && (
                        <button 
                          onClick={() => {/* Handle signature */}}
                          className="px-3 py-1 bg-gold text-black hover:bg-yellow-400 rounded text-sm font-semibold transition flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Sign Now
                        </button>
                      )}
                      {doc.type === 'application/pdf' && (
                        <button
                          onClick={() => setSelectedDocument(doc)}
                          className="px-3 py-1 bg-gray-700 text-white hover:bg-gray-600 rounded text-sm font-semibold transition flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Preview
                        </button>
                      )}
                      <a 
                        href={doc.url}
                        download={doc.name}
                        className="px-3 py-1 bg-transparent border border-gold text-gold hover:bg-gold hover:text-black rounded text-sm font-semibold transition flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </a>
                      <button
                        onClick={() => {
                          setShowVersions(true);
                          // Fetch versions
                          fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${doc.id}/versions`)
                            .then(res => res.json())
                            .then(setVersions)
                            .catch(console.error);
                        }}
                        className="p-1 text-gray-400 hover:text-white"
                        title="Show version history"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Shared With */}
              {doc.shared_with && doc.shared_with.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-gray-400">Shared with:</span>
                  <div className="flex -space-x-2">
                    {doc.shared_with.map((user) => (
                      <div 
                        key={user.id}
                        className="w-6 h-6 rounded-full bg-gray-700 border border-gray-800 flex items-center justify-center text-xs font-medium text-gray-300"
                        title={`${user.name} (${user.email})`}
                      >
                        {user.name[0].toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* PDF Preview Modal */}
      {selectedDocument && selectedDocument.type === 'application/pdf' && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">{selectedDocument.name}</h3>
              <button 
                onClick={() => setSelectedDocument(null)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
              <PDFDocument file={selectedDocument.url} onLoadSuccess={onDocumentLoadSuccess}>
                <Page
                  pageNumber={previewPage}
                  width={800}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </PDFDocument>
              {numPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
                    disabled={previewPage === 1}
                    className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-400">
                    Page {previewPage} of {numPages}
                  </span>
                  <button
                    onClick={() => setPreviewPage((p) => Math.min(numPages, p + 1))}
                    disabled={previewPage === numPages}
                    className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersions && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Version History</h3>
              <button 
                onClick={() => setShowVersions(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-2 max-h-[60vh] overflow-auto">
              {versions.map((version) => (
                <div 
                  key={version.id}
                  className="p-3 bg-gray-800 rounded"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Version {version.version}</span>
                    <span className="text-xs text-gray-400">
                      {format(new Date(version.created_at), 'PPp')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-300">{version.changes}</p>
                  <div className="mt-2 text-xs text-gray-400">
                    By {version.created_by}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}