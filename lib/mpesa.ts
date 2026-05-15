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
  console.log('ACCESS TOKEN RESPONSE:', data)
  return data.access_token
}

function getTimestamp(): string {
  const date = new Date()

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

function normalizePhone(phone: string) {
  let cleaned = phone.replace(/\s+/g, '');

  if (cleaned.startsWith('+254')) {
    return cleaned.substring(1);
  }

  if (cleaned.startsWith('254')) {
    return cleaned;
  }

  if (cleaned.startsWith('0')) {
    return '254' + cleaned.substring(1);
  }

  return cleaned;
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
    const normalized = normalizePhone(phone)

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

    console.log({
      shortcode,
      timestamp,
      password,
    })

    const res = await fetch(MPESA_STK_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    console.log('STK PUSH RESPONSE:', data)
    if (data.ResponseCode === '0') {
      return { success: true, checkoutRequestId: data.CheckoutRequestID }
    }
    return { success: false, error: data.errorMessage || 'STK push failed' }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}
