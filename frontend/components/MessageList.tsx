import React from 'react';

const dummyMessages = [
  { id: 1, sender: 'Coordinator', content: 'Welcome to WME!', created_at: '2025-07-01 10:00' },
  { id: 2, sender: 'You', content: 'Thank you!', created_at: '2025-07-01 10:05' },
];

export default function MessageList() {
  return (
    <div className="space-y-2">
      {dummyMessages.map((msg) => (
        <div key={msg.id} className={`p-3 rounded-lg max-w-lg ${msg.sender === 'You' ? 'bg-gold text-black ml-auto' : 'bg-gray-800 text-white'}`}> 
          <div className="text-xs text-gray-400 mb-1">{msg.sender} • {msg.created_at}</div>
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  );
}
