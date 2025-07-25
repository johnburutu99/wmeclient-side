"use client";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function AuthForm() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      setSuccess(true);
      // TODO: redirect to dashboard
    } catch {}
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button
        className="w-full p-2 rounded bg-gold text-black font-semibold hover:bg-yellow-400 transition"
        type="submit"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-500 text-sm">Login successful!</div>}
    </form>
  );
}
