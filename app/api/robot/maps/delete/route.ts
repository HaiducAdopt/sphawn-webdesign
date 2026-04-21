import { NextResponse } from "next/server";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firestore";

export async function POST(req: Request) {

  const { id } = await req.json();

  await deleteDoc(doc(db, "robotMaps", id));

  return NextResponse.json({ success: true });
}