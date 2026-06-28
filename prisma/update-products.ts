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
    const products = await prisma.product.updateMany({
        where: { isActive: false },
        data: {
            isActive: true,
        }
    })
    console.log(`Updated products`)
}

main().catch(console.error).finally(() => prisma.$disconnect())