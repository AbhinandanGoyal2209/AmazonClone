import nodemailer from 'nodemailer'

let cachedTransport = null

async function getTransport() {
  if (cachedTransport) return cachedTransport

  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const port = Number(process.env.SMTP_PORT || 587)

  if (host && user && pass) {
    cachedTransport = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })
    return cachedTransport
  }

  const test = await nodemailer.createTestAccount()
  cachedTransport = nodemailer.createTransport({
    host: test.smtp.host,
    port: test.smtp.port,
    secure: test.smtp.secure,
    auth: { user: test.user, pass: test.pass },
  })
  cachedTransport.__ethereal = true
  return cachedTransport
}

export async function sendOrderConfirmationEmail({ to, orderId, items, subtotal }) {
  const transport = await getTransport()
  const from = process.env.MAIL_FROM || 'Amazon Clone <no-reply@amazon-clone.dev>'

  const lines = items
    .map((it) => `- ${it.product.name} x${it.quantity}`)
    .join('\n')

  const info = await transport.sendMail({
    from,
    to,
    subject: `Your Amazon Clone order #${orderId}`,
    text: `Thanks for your order!\n\nOrder ID: ${orderId}\n\nItems:\n${lines}\n\nSubtotal: ₹${Number(
      subtotal,
    ).toFixed(0)}\n\nThis is a demo email for the assignment.`,
  })

  if (transport.__ethereal) {
    const url = nodemailer.getTestMessageUrl(info)
    if (url) console.log(`Ethereal email preview: ${url}`)
  }
}

