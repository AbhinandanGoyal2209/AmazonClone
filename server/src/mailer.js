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
  try {
    const transport = await getTransport()
    const from = process.env.MAIL_FROM || 'Amazon Clone <no-reply@amazon-clone.dev>'

    const itemsHTML = items
      .map((it) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <strong>${it.product.name}</strong>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
            ${it.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
            ₹${Number(it.product.price * it.quantity).toFixed(0)}
          </td>
        </tr>
      `)
      .join('')

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #131921; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #fff; padding: 20px; border: 1px solid #ddd; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
          .order-summary { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .order-id { font-size: 18px; font-weight: bold; color: #c60; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .total-row { background: #fff3cd; font-weight: bold; }
          .total-row td { padding: 12px; border-top: 2px solid #ffc107; }
          .button { display: inline-block; background: #ff9900; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
          .icon { font-size: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="font-size: 28px; font-weight: bold;">
              <span style="color: #ff9900;">amazon</span><span style="color: #ff9900;">.</span><span>clone</span>
            </div>
            <div style="font-size: 14px; margin-top: 10px; opacity: 0.9;">Order Confirmation</div>
          </div>

          <div class="content">
            <h2 style="color: #131921;">Thank you for your order! 🎉</h2>
            
            <p>Hi there,</p>
            <p>Your order has been successfully placed and is being prepared for shipment.</p>

            <div class="order-summary">
              <div style="margin-bottom: 10px;">
                <strong>Order ID:</strong>
                <div class="order-id">#${orderId}</div>
              </div>
            </div>

            <h3 style="color: #131921;">Order Details</h3>
            <table>
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 12px; text-align: left;">Product</th>
                  <th style="padding: 12px; text-align: center;">Qty</th>
                  <th style="padding: 12px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
                <tr class="total-row">
                  <td style="padding: 12px;"></td>
                  <td style="padding: 12px; text-align: center;"></td>
                  <td style="padding: 12px; text-align: right;">
                    Order Total: ₹${Number(subtotal).toFixed(0)}
                  </td>
                </tr>
              </tbody>
            </table>

            <p style="background: #e8f5e9; padding: 12px; border-radius: 4px; border-left: 4px solid #4caf50;">
              ✓ <strong>Free delivery</strong> on all orders
            </p>

            <a href="https://amazon-clone.dev/orders/${orderId}" class="button">
              Track Your Order
            </a>

            <h3 style="color: #131921; margin-top: 30px;">What's Next?</h3>
            <ul>
              <li>Your order will be shipped within 24-48 hours</li>
              <li>You'll receive tracking information via email</li>
              <li>Free returns within 30 days</li>
              <li>24/7 customer support available</li>
            </ul>

            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 13px; color: #666;">
              If you have any questions, please don't hesitate to contact our customer support team.
            </p>
          </div>

          <div class="footer">
            <p style="margin: 0;">© 2026 Amazon Clone. All rights reserved.</p>
            <p style="margin: 5px 0;">This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const info = await transport.sendMail({
      from,
      to,
      subject: `🎉 Order Confirmation #${orderId} - Amazon Clone`,
      html: htmlContent,
      text: `Thanks for your order!\n\nOrder ID: ${orderId}\n\nItems:\n${items.map((it) => `- ${it.product.name} x${it.quantity}`).join('\n')}\n\nSubtotal: ₹${Number(subtotal).toFixed(0)}`,
    })

    console.log(`✓ Order confirmation email sent to ${to} (Order #${orderId})`)

    if (transport.__ethereal) {
      const url = nodemailer.getTestMessageUrl(info)
      if (url) console.log(`📧 Ethereal email preview: ${url}`)
    }

    return true
  } catch (error) {
    console.error(`✗ Failed to send email to ${to}:`, error.message)
    return false
  }
}

