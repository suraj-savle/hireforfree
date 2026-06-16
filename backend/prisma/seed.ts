import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@hireforfree.com';

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    console.log('⚠️ Admin already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin123', 10);

  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log('✅ Admin created:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
