import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth/session';

export async function POST(_req: NextRequest) {
  const response = NextResponse.json({ ok: true });
  await clearSessionCookie(response);
  return response;
}
