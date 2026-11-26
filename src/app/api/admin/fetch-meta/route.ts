import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MetaFetcher/1.0)',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return NextResponse.json({ error: 'Could not fetch page' }, { status: 422 });

    const html = await res.text();

    // Try og:title first, then twitter:title, then <title>
    const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1]
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i)?.[1];

    const twitterTitle = html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i)?.[1]
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:title["']/i)?.[1];

    const pageTitle = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];

    const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)?.[1]
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)?.[1];

    const rawTitle = ogTitle || twitterTitle || (pageTitle && pageTitle !== 'Loading...' ? pageTitle : '') || '';
    // Skip obviously bad titles
    const badTitles = ['loading...', 'loading', 'untitled', ''];
    const cleanedRaw = badTitles.includes(rawTitle.toLowerCase().trim()) ? '' : rawTitle;
    // Clean up title — remove site name suffixes like " - SiteName" or " | SiteName"
    const title = cleanedRaw.replace(/\s*[-|–]\s*[^-|–]{1,40}$/, '').trim();

    // If no meta title found, try to extract something readable from the URL path
    let urlHint = '';
    if (!title) {
      try {
        const u = new URL(url);
        const segments = u.pathname.split('/').filter(Boolean);
        // Take the last meaningful path segment and humanize it
        const last = segments[segments.length - 1] || '';
        urlHint = last.replace(/[-_]/g, ' ').replace(/\.[^.]+$/, '').trim();
      } catch {}
    }

    return NextResponse.json({ title: title || urlHint || null, thumbnail: ogImage || null });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 422 });
  }
}
