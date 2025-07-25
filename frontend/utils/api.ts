export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function apiPost(path: string, data: any) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
