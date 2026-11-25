const ALLOWED_IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i;
const SSRF_BLOCKLIST = [
  /^https?:\/\/localhost/i,
  /^https?:\/\/127\./,
  /^https?:\/\/0\.0\.0\.0/,
  /^https?:\/\/10\./,
  /^https?:\/\/172\.(1[6-9]|2\d|3[01])\./,
  /^https?:\/\/192\.168\./,
  /^https?:\/\/169\.254\./,
  /^https?:\/\/\[::1\]/,
  /^https?:\/\/\[fc/i,
  /^https?:\/\/\[fd/i,
];

export function validateImageUrl(url: string): { valid: boolean; error?: string } {
  if (!url || url.trim() === '') {
    return { valid: false, error: 'Image URL is required' };
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
  }

  for (const pattern of SSRF_BLOCKLIST) {
    if (pattern.test(url)) {
      return { valid: false, error: 'URL points to a private or reserved address' };
    }
  }

  return { valid: true };
}

export function validateExternalUrl(url: string): { valid: boolean; error?: string } {
  if (!url || url.trim() === '') {
    return { valid: false, error: 'External URL is required' };
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  if (parsed.protocol !== 'https:') {
    return { valid: false, error: 'External URL must use HTTPS' };
  }

  for (const pattern of SSRF_BLOCKLIST) {
    if (pattern.test(url)) {
      return { valid: false, error: 'URL points to a private or reserved address' };
    }
  }

  return { valid: true };
}

export function sanitizeRedirectUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return null;
    for (const pattern of SSRF_BLOCKLIST) {
      if (pattern.test(url)) return null;
    }
    return url;
  } catch {
    return null;
  }
}
