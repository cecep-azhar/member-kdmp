const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000/api';

export async function payloadFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.errors?.[0]?.message || 'API request failed');
  }

  return res.json();
}

export const getPayloadUrl = (path: string) => `${process.env.NEXT_PUBLIC_PAYLOAD_API_URL}${path}`;
