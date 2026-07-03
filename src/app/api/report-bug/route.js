import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

export async function POST(request) {
  try {
    const { message, digest, path, url, userAgent } = await request.json();

    if (!process.env.RESEND_API_KEY) {
      console.warn("Bug reported, but RESEND_API_KEY is not set. Details:", { message, digest, path });
      return NextResponse.json({ success: true, mock: true });
    }

    await resend.emails.send({
      from: 'Ekeson System <system@ekesongadgets.com>',
      to: ['orders@ekesongadgets.com'],
      subject: `🚨 CRITICAL BUG REPORT: ${message ? message.substring(0, 50) : 'Unknown Error'}...`,
      html: `
        <div style="font-family: sans-serif; max-w-xl mx-auto; background: #FFFDF5; padding: 40px; border-radius: 20px;">
          <h1 style="color: #FF3B30; text-transform: uppercase;">Automated Bug Report</h1>
          <p style="color: #4a4a68; font-size: 16px;">
            A user encountered a crash on your live site. Here are the details:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #FF3B30; margin-bottom: 20px;">
            <p><strong>URL / Path:</strong> <a href="${url}">${path}</a></p>
            <p><strong>Error Message:</strong> <span style="color: #FF3B30; font-family: monospace;">${message || 'N/A'}</span></p>
            <p><strong>Error Digest:</strong> <span style="font-family: monospace;">${digest || 'N/A'}</span></p>
          </div>

          <div style="background: #F5F5F7; padding: 15px; border-radius: 10px;">
            <p style="margin: 0; font-size: 12px; color: #1B1B5E;"><strong>User Agent:</strong> ${userAgent || 'Unknown'}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #1B1B5E; color: white; border-radius: 10px; text-align: center;">
            <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Ekeson Gadgets Automated System</p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send bug report via Resend:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
