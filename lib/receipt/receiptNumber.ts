import { prisma } from '@/lib/prisma';

export async function generateReceiptNumber() {
    const total = await prisma.order.count();

    return `RCPT-${String(total + 1).padStart(6, "0")}`;
}