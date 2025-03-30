// src/app/api/entry/[id]/route.ts
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params before accessing its properties (Next.js 15 requirement)
    const { id } = await params;
    const docRef = doc(db, "vibes", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(docSnap.data());
  } catch (error) {
    console.error("Error fetching vibe entry:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
