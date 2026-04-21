import { NextResponse } from "next/server";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firestore";

export async function POST(req: Request) {

  const { id, name } = await req.json();

  await setDoc(
    doc(db, "robotMaps", id),
    {
      name,
      createdAt: Date.now()
    }
  );

  return NextResponse.json({ success: true });
}