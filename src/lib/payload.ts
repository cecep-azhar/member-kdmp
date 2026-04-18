const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000/api';

function getAuthHeaders(): Record<string, string> {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('member-token');
    if (token) {
      return { Authorization: `JWT ${token}` };
    }
  }
  return {};
}

export async function payloadFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('member-user');
        localStorage.removeItem('member-token');
        document.cookie = 'member-token=; path=/; max-age=0';
        window.location.href = '/login';
      }
    }
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.errors?.[0]?.message || `API request failed (${res.status})`);
  }

  return res.json();
}

export const getPayloadUrl = (path: string) => `${process.env.NEXT_PUBLIC_PAYLOAD_API_URL}${path}`;
