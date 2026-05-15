import { NextRequest, NextResponse } from 'next/server'
import { initiateStkPush } from '@/lib/mpesa'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    await requireAuth()

    const { orderId, phone, amount } = await req.json()

    if (!orderId || !phone || !amount) {
      return NextResponse.json(
        { error: 'Missing fields' },
        { status: 400 }
      )
    }

    const result = await initiateStkPush({
      phone,
      amount,
      orderId,
    })

    // STK failed
    if (!result.success || !result.checkoutRequestId) {
      return NextResponse.json(
        {
          error: result.error || 'STK push failed',
        },
        { status: 400 }
      )
    }

    // Save CheckoutRequestID temporarily
    await prisma.order.update({
      where: { id: orderId },
      data: {
        mpesaRef: result.checkoutRequestId,
      },
    })

    return NextResponse.json({
      success: true,
      checkoutRequestId: result.checkoutRequestId,
    })
  } catch (err) {
    console.error('STK Route Error:', err)

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Server error',
      },
      { status: 500 }
    )
  }
}