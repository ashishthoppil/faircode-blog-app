import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const role = (searchParams.get("role") || "").trim();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    let user;
    if (role === 'admin') {
      user = await db.collection("users").find({}).toArray();
    } else {
      user = await db.collection("users").findOne(
        { _id: new ObjectId(session.user.id) },
        { projection: { passwordHash: 0 } }
      );
    }
console.log('useruser', user);
    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
