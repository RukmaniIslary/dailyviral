import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import PostGrid from '@/components/posts/PostGrid';

const PAGE_SIZE = 24;

interface Props { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) return { title: 'Category Not Found' };
  return { title: `${cat.name} – Daily Viral MMS`, description: cat.description || `Browse ${cat.name} posts` };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: p } = await searchParams;
  const page = Math.max(1, parseInt(p || '1'));

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const [posts, total] = await Promise.all([
    prisma.post.findMany({ where: { status: 'PUBLISHED', categoryId: category.id }, orderBy: { publishedAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, include: { category: { select: { name: true, slug: true } } } }),
    prisma.post.count({ where: { status: 'PUBLISHED', categoryId: category.id } }),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div style={{ background: '#f7f7f7', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#999', marginBottom: 24 }}>
          <Link href="/" style={{ color: '#00aff0' }}>Home</Link>
          <span>›</span>
          <span style={{ color: '#333' }}>{category.name}</span>
        </nav>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 }}>{category.name}</h1>
          {category.description && <p style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>{category.description}</p>}
          <p style={{ fontSize: 14, color: '#999' }}>{total.toLocaleString()} posts</p>
        </div>
        <PostGrid posts={JSON.parse(JSON.stringify(posts))} columns={4} />
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
            {page > 1 && <Link href={`/category/${slug}?page=${page - 1}`} style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 13, fontWeight: 600, color: '#555', background: '#fff' }}>Previous</Link>}
            <span style={{ padding: '9px 16px', fontSize: 13, color: '#999' }}>Page {page} of {totalPages}</span>
            {page < totalPages && <Link href={`/category/${slug}?page=${page + 1}`} style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 13, fontWeight: 600, color: '#555', background: '#fff' }}>Next</Link>}
          </div>
        )}
      </div>
    </div>
  );
}
