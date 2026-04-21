import { NextResponse } from "next/server"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firestore"

export async function GET() {

  try {

    const snapshot = await getDocs(
      collection(db,"robotMaps")
    )

    if(snapshot.empty){
      return NextResponse.json([])
    }

    const maps = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(maps)

  } catch (error) {

    console.error("MAP LIST ERROR:", error)

    return NextResponse.json([], { status:200 }) // NU mai returnăm 500

  }

}