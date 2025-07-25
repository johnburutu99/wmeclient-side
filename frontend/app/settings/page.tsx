import React from 'react';

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold text-gold mb-6">Settings</h1>
      {/* TODO: Profile, notifications, 2FA, etc. */}
      <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gold">
        <p>Update your settings here.</p>
      </div>
    </main>
  );
}
