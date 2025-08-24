import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";

export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { name, email, id } = await req.json();
    if (!name && !email) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const users = db.collection("users");


    if (email) {
      const existing = await users.findOne({
        email: email,
        _id: { $ne: new ObjectId(id ? id : session.user.id) },
      });
      if (existing) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
    }

    await users.updateOne(
      { _id: new ObjectId(id ? id : session.user.id) },
      { $set: { ...(name && { name }), ...(email && { email }), updatedAt: new Date() } }
    );

    const updatedUser = await users.findOne(
      { _id: new ObjectId(id ? id : session.user.id) },
      { projection: { passwordHash: 0 } }
    );

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error("Update user error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
