import bcrypt from 'bcryptjs'

import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log('👤 Seeding users.....');

    const hashedPassword = await bcrypt.hash('123123', 10);
    const newUser = await prisma.user.create({
        data: {
            name: 'Kamau', // Admin Mkulima Supply Store
            email: 'kamau@gmail.com', // admin@mkulimasupplystore.co.ke
            password: hashedPassword,
            role: 'CUSTOMER',
            phone: '0700000000', // 0706782301
        }
    });

    console.log(`${newUser.name} successfully added`);
};

main().catch(console.error).finally(() => prisma.$disconnect())