import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const SENDER_EMAIL = 'ekesontechgroup@gmail.com'; // User requested this sender

export const sendPaymentConfirmationEmail = async ({ toEmail, orderId, amount, paymentMethod }) => {
  if (!resend) {
    console.warn('RESEND_API_KEY is not configured. Email not sent to:', toEmail);
    return { success: false, error: 'Resend API key missing' };
  }

  if (!toEmail) {
    console.warn('No email address provided for payment confirmation.');
    return { success: false, error: 'No email address provided' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `Ekeson Gadgets <${SENDER_EMAIL}>`,
      to: [toEmail],
      subject: `Payment Confirmed - Order #${orderId.substring(0, 8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1B1B5E; margin: 0;">Payment Confirmed</h1>
            <p style="color: #666; font-size: 14px;">Thank you for your purchase from Ekeson Gadgets!</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="font-size: 16px; margin-top: 0; color: #333;">Order Details</h2>
            <p><strong>Order ID:</strong> ${orderId.substring(0, 8)}</p>
            <p><strong>Amount Paid:</strong> ₦${amount.toLocaleString()}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod || 'Online Payment'}</p>
            <p><strong>Status:</strong> <span style="color: green; font-weight: bold;">Paid</span></p>
          </div>

          <p style="color: #444; line-height: 1.6;">
            We have successfully received your payment and are now processing your order. You can track your order status in your account dashboard.
          </p>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea;">
            <p style="color: #888; font-size: 12px;">Ekeson Gadgets - Building Wealth Through Technology</p>
            <p style="color: #888; font-size: 12px;">Need help? Contact our support team.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send payment confirmation email:', error);
      return { success: false, error };
    }

    console.log(`Payment confirmation email sent successfully to ${toEmail}`);
    return { success: true, data };
  } catch (err) {
    console.error('Error sending payment confirmation email:', err);
    return { success: false, error: err.message };
  }
};
