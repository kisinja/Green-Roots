import QRCode from 'qrcode';

export async function generateQRCode() {

    return QRCode.toDataURL(
        process.env.WHATSAPP_CHANNEL!
    )
}