import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Skip build-time execution
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const res = await fetch(`${apiUrl}/api/members`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const body = await res.text();
    return NextResponse.json({ status: res.status, body: body });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
