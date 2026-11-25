import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@dailyviralmms.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123456';

  if (!adminPassword || adminPassword.length < 8) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 8 characters');
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  });

  console.log(`Admin created/updated: ${admin.email}`);

  // Seed default categories
  const categoryData = [
    { name: 'Latest', slug: 'latest', description: 'Latest viral content' },
    { name: 'Trending', slug: 'trending', description: 'Trending posts' },
    { name: 'Popular', slug: 'popular', description: 'Most popular content' },
    { name: 'Videos', slug: 'videos', description: 'Video content' },
    { name: 'Images', slug: 'images', description: 'Image galleries' },
    { name: 'Collections', slug: 'collections', description: 'Content collections' },
  ];

  for (const cat of categoryData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('Default categories seeded.');
  console.log('\n--- Login Credentials ---');
  console.log(`Email:    ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log('URL:      http://localhost:3000/admin/login');
  console.log('--- CHANGE PASSWORD IN PRODUCTION ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
