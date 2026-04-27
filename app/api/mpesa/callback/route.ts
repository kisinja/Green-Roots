import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const stk = body?.Body?.stkCallback

    if (!stk) return NextResponse.json({ ResultCode: 0 })

    const resultCode = stk.ResultCode
    const metadata = stk.CallbackMetadata?.Item || []

    if (resultCode === 0) {
      const mpesaRef = metadata.find((i: { Name: string }) => i.Name === 'MpesaReceiptNumber')?.Value
      const accountRef = stk.AccountReference as string
      const orderId = accountRef?.replace('GR-', '').toLowerCase()

      if (mpesaRef && orderId) {
        await prisma.order.updateMany({
          where: { id: { endsWith: orderId } },
          data: { status: 'CONFIRMED', mpesaRef },
        })
      }
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch {
    return NextResponse.json({ ResultCode: 0 })
  }
}
