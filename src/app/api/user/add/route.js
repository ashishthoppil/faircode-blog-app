export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { auth } from "@/auth";
import { hash } from "bcryptjs";


export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, email, password } = await req.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = (name || "").trim();

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const users = db.collection("users");

    await users.createIndex({ email: 1 }, { unique: true });

    const existing = await users.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await hash(password, 10);

    const now = new Date();
    const doc = {
      name: cleanName || null,
      email: cleanEmail,
      passwordHash,
      role: 'user',
      image: null,
      createdAt: now,
      updatedAt: now,
    };

    const { insertedId } = await users.insertOne(doc);

    return NextResponse.json(
      {
        id: insertedId.toString(),
        name: doc.name,
        email: doc.email,
        role: doc.role,
        createdAt: doc.createdAt,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err?.code === 11000) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    console.error("error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
