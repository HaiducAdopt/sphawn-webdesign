// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      console.error("Missing SMTP env vars");
      return NextResponse.json(
        { success: false, error: "Email configuration missing." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,      // smtp.zoho.eu
      port: Number(process.env.SMTP_PORT), // 587
      secure: false, // IMPORTANT pentru 587
      auth: {
        user: process.env.SMTP_USER,   // support@sphawn.nl
        pass: process.env.SMTP_PASS,   // parola/app password Zoho
      },
    });

    await transporter.sendMail({
      from: `Studio Sphawn <${process.env.CONTACT_FROM_EMAIL}>`,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New message from ${name}: ${subject}`,
      text: `
New contact form submission:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("SMTP error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message." },
      { status: 500 }
    );
  }
}
