import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";

export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid or missing id" }, { status: 400 });
    }

    const isAdmin = session.user.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const users = db.collection("users");
    const accounts = db.collection("accounts");
    const sessions = db.collection("sessions");
    const posts = db.collection("posts");

    const userObjectId = new ObjectId(id);

    const existing = await users.findOne({ _id: userObjectId });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await Promise.all([
      accounts.deleteMany({ userId: userObjectId }).catch(() => {}),
      sessions.deleteMany({ userId: userObjectId }).catch(() => {}),
      posts.deleteMany({ author: userObjectId }).catch(() => {}),
    ]);

    const result = await users.deleteOne({ _id: userObjectId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
