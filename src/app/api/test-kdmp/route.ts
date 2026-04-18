import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('http://localhost:3000/api/members', {
      method: 'GET', // No auth
    });
    
    // We expect 403 or 401 from payload
    const body = await res.text();
    return NextResponse.json({ status: res.status, body: body });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
