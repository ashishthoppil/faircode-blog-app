import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(session.user.id) },
      { projection: { passwordHash: 0 } }
    );

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
