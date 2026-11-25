import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';
import { loginSchema } from '@/lib/validation/schemas';
import { createSession, setSessionCookie, clearSessionCookie } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/security/rateLimit';

export async function POST(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle logout
  if (pathname.endsWith('/logout')) {
    const response = NextResponse.json({ ok: true });
    await clearSessionCookie(response);
    return response;
  }

  // Handle login
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const rateLimitKey = `login:${ip}`;
  const rateLimit = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again later.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const admin = await prisma.admin.findUnique({ where: { email: email.toLowerCase() } });
  if (!admin) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Log activity
  await prisma.adminActivityLog.create({
    data: { adminId: admin.id, action: 'LOGIN', details: `Login from ${ip}` },
  });

  const token = await createSession({ adminId: admin.id, email: admin.email });
  const response = NextResponse.json({ ok: true, email: admin.email });
  await setSessionCookie(response, token);
  return response;
}
