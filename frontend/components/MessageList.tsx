import React, { useEffect, useState, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: number;
  sender: string;
  content: string;
  created_at: string;
  read: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
  attachments?: {
    id: number;
    name: string;
    url: string;
  }[];
}

interface TypingUser {
  name: string;
  lastTyped: number;
}

export default function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      path: '/socket.io',
      auth: { token: localStorage.getItem('token') },
    });

    const socket = socketRef.current;

    socket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('messageStatus', ({ messageId, status }: { messageId: number; status: Message['status'] }) => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      ));
    });

    socket.on('typing', ({ user }: { user: string }) => {
      setTypingUsers(prev => {
        const existing = prev.find(u => u.name === user);
        if (existing) {
          return prev.map(u => u.name === user ? { ...u, lastTyped: Date.now() } : u);
        }
        return [...prev, { name: user, lastTyped: Date.now() }];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Clean up typing indicators after 3 seconds of inactivity
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingUsers(prev => prev.filter(u => Date.now() - u.lastTyped < 3000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`);
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    // Create form data for files
    const formData = new FormData();
    formData.append('content', newMessage.trim());
    selectedFiles.forEach(file => formData.append('files', file));

    // Create optimistic message
    const optimisticMessage: Message = {
      id: Date.now(), // Temporary ID
      sender: 'You',
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
      read: true,
      status: 'sending',
      attachments: selectedFiles.map((file, index) => ({
        id: index,
        name: file.name,
        url: URL.createObjectURL(file)
      }))
    };

    // Add optimistic message
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    setSelectedFiles([]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Failed to send message');

      const data = await res.json();
      
      // Replace optimistic message with real one
      setMessages(prev => 
        prev.map(msg => msg.id === optimisticMessage.id ? data : msg)
      );

      // Notify socket about new message
      socketRef.current?.emit('messageSent', { messageId: data.id });
    } catch (err) {
      // Show error but keep optimistic message with error state
      setError(err instanceof Error ? err.message : 'Failed to send message');
      setMessages(prev => 
        prev.map(msg => 
          msg.id === optimisticMessage.id 
            ? { ...msg, status: 'error' } 
            : msg
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 bg-gray-800 rounded-lg max-w-lg animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
            <div className="h-6 bg-gray-700 rounded w-3/4"></div>
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

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-gray-900/50 rounded">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`group p-3 rounded-lg max-w-lg ${
              msg.sender === 'You' 
                ? 'bg-gold text-black ml-auto' 
                : 'bg-gray-800 text-white'
            }`}
          > 
            <div className={`text-xs mb-1 flex justify-between items-center ${
              msg.sender === 'You' ? 'text-gray-800' : 'text-gray-400'
            }`}>
              <span>{msg.sender} • {format(new Date(msg.created_at), 'PP p')}</span>
              {!msg.read && msg.sender !== 'You' && (
                <span className="px-1.5 py-0.5 rounded-full bg-gold text-black text-[10px] font-medium">
                  New
                </span>
              )}
            </div>
            <div className="whitespace-pre-wrap break-words">{msg.content}</div>
            {msg.attachments && msg.attachments.length > 0 && (
              <div className="mt-2 flex gap-2">
                {msg.attachments.map((file) => (
                  <a
                    key={file.id}
                    href={file.url}
                    download={file.name}
                    className={`text-xs py-1 px-2 rounded flex items-center gap-1 ${
                      msg.sender === 'You'
                        ? 'bg-black/10 hover:bg-black/20'
                        : 'bg-black/20 hover:bg-black/30'
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {file.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      <div className="p-4 bg-gray-800 rounded-b border-t border-gray-700">
        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-400 mb-2">
            {typingUsers.map(u => u.name).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
        {selectedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="bg-gray-900 text-white rounded px-2 py-1 text-sm flex items-center gap-2">
                <span>{file.name}</span>
                <button
                  onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-white transition"
              title="Attach files"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setSelectedFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
                  e.target.value = '';
                }
              }}
            />
            <textarea
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                // Emit typing event
                if (socketRef.current) {
                  if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                  socketRef.current.emit('typing');
                  typingTimeoutRef.current = setTimeout(() => {
                    socketRef.current?.emit('stopTyping');
                  }, 3000);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              className="flex-1 bg-gray-900 text-white rounded p-2 min-h-[40px] max-h-[120px] resize-none focus:outline-none focus:ring-1 focus:ring-gold"
              rows={1}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() && selectedFiles.length === 0}
            className="px-4 py-2 bg-gold text-black rounded font-semibold hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
