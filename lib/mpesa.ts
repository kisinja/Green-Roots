const MPESA_AUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
const MPESA_STK_URL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
// For production replace sandbox URLs with:
// https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
// https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')

  const res = await fetch(MPESA_AUTH_URL, {
    headers: { Authorization: `Basic ${auth}` },
  })
  const data = await res.json()
  return data.access_token
}

function getTimestamp(): string {
  return new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, 14)
}

export async function initiateStkPush({
  phone,
  amount,
  orderId,
}: {
  phone: string
  amount: number
  orderId: string
}): Promise<{ success: boolean; checkoutRequestId?: string; error?: string }> {
  try {
    const token = await getAccessToken()
    const timestamp = getTimestamp()
    const shortcode = process.env.MPESA_SHORTCODE!
    const passkey = process.env.MPESA_PASSKEY!
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

    // Normalize phone: 0712345678 → 254712345678
    const normalized = phone.replace(/^0/, '254').replace(/^\+/, '')

    const body = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(amount),
      PartyA: normalized,
      PartyB: shortcode,
      PhoneNumber: normalized,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: `GR-${orderId.slice(-6).toUpperCase()}`,
      TransactionDesc: 'GreenRoots Agrovet Order',
    }

    const res = await fetch(MPESA_STK_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (data.ResponseCode === '0') {
      return { success: true, checkoutRequestId: data.CheckoutRequestID }
    }
    return { success: false, error: data.errorMessage || 'STK push failed' }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}
