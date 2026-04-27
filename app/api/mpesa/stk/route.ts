import { NextRequest, NextResponse } from 'next/server'
import { initiateStkPush } from '@/lib/mpesa'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await requireAuth()
    const { orderId, phone, amount } = await req.json()

    if (!orderId || !phone || !amount) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const result = await initiateStkPush({ phone, amount, orderId })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ checkoutRequestId: result.checkoutRequestId })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
