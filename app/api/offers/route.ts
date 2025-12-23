// app/api/offers/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function safeFileName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_.]/g, "");
}

function initAdmin() {
  if (getApps().length) return;

  // FIREBASE_ADMIN_SERVICE_ACCOUNT trebuie să fie JSON STRING (un singur rând)
  // Exemplu: {"type":"service_account",...}
  const svcRaw = mustEnv("FIREBASE_ADMIN_SERVICE_ACCOUNT");
  const serviceAccount = JSON.parse(svcRaw);

  // AICI trebuie bucket-ul real (ex: sphawn-webdesign-prod.firebasestorage.app sau xxx.appspot.com)
  const bucketName = mustEnv("FIREBASE_ADMIN_STORAGE_BUCKET");

  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: bucketName,
  });
}

async function uploadToStorage(file: File, path: string) {
  initAdmin();
  const bucket = getStorage().bucket();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const token = crypto.randomUUID();
  const fileRef = bucket.file(path);

  await fileRef.save(buffer, {
    contentType: file.type || "application/octet-stream",
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
    resumable: false,
  });

  const bucketName = bucket.name;
  const encodedPath = encodeURIComponent(path);
  const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media&token=${token}`;

  return { downloadUrl, storagePath: path };
}

export async function POST(req: Request) {
  try {
    initAdmin();
    const db = getFirestore();

    // multipart/form-data
    const form = await req.formData();

    const websiteType = String(form.get("websiteType") || "");
    const companyName = String(form.get("companyName") || "");
    const slogan = String(form.get("slogan") || "");
    const industry = String(form.get("industry") || "");
    const menuItemsRaw = String(form.get("menuItems") || "");
    const goals = String(form.get("goals") || "");
    const brandStyle = String(form.get("brandStyle") || "");
    const budget = String(form.get("budget") || "");
    const contactName = String(form.get("contactName") || "");
    const email = String(form.get("email") || "");

    const logoFile = form.get("logoFile");
    const heroFile = form.get("heroFile");

    if (!companyName.trim() || !contactName.trim() || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const idBase = safeFileName(companyName || "company");
    const ts = Date.now();
    const folder = `offers/${idBase}-${ts}`;

    let logoUrl: string | null = null;
    let heroUrl: string | null = null;
    let logoStoragePath: string | null = null;
    let heroStoragePath: string | null = null;

    if (logoFile instanceof File && logoFile.size > 0) {
      const ext = safeFileName(logoFile.name).split(".").pop() || "png";
      const up = await uploadToStorage(logoFile, `${folder}/logo.${ext}`);
      logoUrl = up.downloadUrl;
      logoStoragePath = up.storagePath;
    }

    if (heroFile instanceof File && heroFile.size > 0) {
      const ext = safeFileName(heroFile.name).split(".").pop() || "jpg";
      const up = await uploadToStorage(heroFile, `${folder}/hero.${ext}`);
      heroUrl = up.downloadUrl;
      heroStoragePath = up.storagePath;
    }

    const menuItems = menuItemsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // 1) save Firestore
    const docRef = await db.collection("offers").add({
      createdAt: new Date(),

      websiteType,
      companyName: companyName.trim(),
      slogan: slogan.trim(),
      industry: industry.trim(),
      menuItems,

      goals: goals.trim(),
      brandStyle: brandStyle.trim(),
      budget: budget.trim(),

      contactName: contactName.trim(),
      email: email.trim().toLowerCase(),

      assets: { logoUrl, heroUrl },
      logoStoragePath,
      heroStoragePath,

      status: "new",
      source: "offers-page",
    });

    // 2) send email Zoho SMTP
    const transporter = nodemailer.createTransport({
      host: mustEnv("SMTP_HOST"),
      port: Number(mustEnv("SMTP_PORT")),
      secure: false,
      auth: {
        user: mustEnv("SMTP_USER"),
        pass: mustEnv("SMTP_PASS"),
      },
    });

    await transporter.sendMail({
      from: `Studio Sphawn <${mustEnv("CONTACT_FROM_EMAIL")}>`,
      to: mustEnv("CONTACT_TO_EMAIL"),
      replyTo: email,
      subject: `🟢 New Offer Request: ${companyName}`,
      text: `
New offer request received:

Company: ${companyName}
Contact: ${contactName}
Email: ${email}
Website type: ${websiteType || "-"}
Budget: ${budget || "-"}

Offer ID: ${docRef.id}

Logo: ${logoUrl || "-"}
Hero: ${heroUrl || "-"}

Menu: ${menuItems.length ? menuItems.join(", ") : "-"}
Goals: ${goals || "-"}
Brand style: ${brandStyle || "-"}
      `.trim(),
    });

    return NextResponse.json({ success: true, offerId: docRef.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    console.error("Offers API error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
