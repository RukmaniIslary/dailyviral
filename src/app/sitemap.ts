import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Lazy import to avoid build-time DB connection
async function getPrisma() {
  const { prisma } = await import('@/lib/db/prisma');
  return prisma;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  let posts: Array<{ slug: string; updatedAt: Date }> = [];
  let categories: Array<{ slug: string; updatedAt: Date }> = [];

  try {
    const prisma = await getPrisma();
    [posts, categories] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        select: { slug: true, updatedAt: true },
      }),
    ]);
  } catch {
    // DB not available at build time – return static pages only
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/trending`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/latest`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.3 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), priority: 0.2 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), priority: 0.2 },
    { url: `${baseUrl}/dmca`, lastModified: new Date(), priority: 0.2 },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: post.updatedAt,
    priority: 0.7,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: cat.updatedAt,
    priority: 0.6,
  }));

  return [...staticPages, ...postPages, ...categoryPages];
}
