// app/api/mpesa/callback/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    console.log(
      'M-Pesa Callback:',
      JSON.stringify(body, null, 2)
    )

    const stk = body?.Body?.stkCallback

    // Safaricom expects 200 response always
    if (!stk) {
      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: 'Accepted',
      })
    }

    const resultCode = stk.ResultCode
    const resultDesc = stk.ResultDesc
    const checkoutRequestId = stk.CheckoutRequestID

    // Payment success
    if (resultCode === 0) {
      const metadata = stk.CallbackMetadata?.Item || []

      const mpesaReceipt = metadata.find(
        (i: { Name: string }) =>
          i.Name === 'MpesaReceiptNumber'
      )?.Value

      const amount = metadata.find(
        (i: { Name: string }) =>
          i.Name === 'Amount'
      )?.Value

      const phone = metadata.find(
        (i: { Name: string }) =>
          i.Name === 'PhoneNumber'
      )?.Value

      const transactionDate = metadata.find(
        (i: { Name: string }) =>
          i.Name === 'TransactionDate'
      )?.Value

      // Find order using stored CheckoutRequestID
      await prisma.order.updateMany({
        where: {
          mpesaRef: checkoutRequestId,
        },
        data: {
          status: 'CONFIRMED',

          // Replace temporary CheckoutRequestID
          // with actual M-Pesa receipt number
          mpesaRef: mpesaReceipt,
        },
      })

      console.log('✅ Payment successful:', {
        checkoutRequestId,
        mpesaReceipt,
        amount,
        phone,
        transactionDate,
      })
    } else {
      // Payment failed/cancelled
      await prisma.order.updateMany({
        where: {
          mpesaRef: checkoutRequestId,
        },
        data: {
          status: 'CANCELLED',
        },
      })

      console.log('❌ Payment failed:', {
        checkoutRequestId,
        resultCode,
        resultDesc,
      })
    }

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Accepted',
    })
  } catch (err) {
    console.error('M-Pesa callback error:', err)

    // Always return success to Safaricom
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Accepted',
    })
  }
}