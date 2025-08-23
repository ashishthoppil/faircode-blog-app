import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const DB_NAME = process.env.DB_NAME;
    const db = client.db(DB_NAME);
    const users = db.collection("users");

    await users.createIndex({ email: 1 }, { unique: true });

    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await hash(password, 10);

    const { insertedId } = await users.insertOne({
      name: name || null,
      email,
      passwordHash,
      image: null,
      emailVerified: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ user: { id: insertedId.toString(), email, name } }, { status: 201 });
  } catch (err) {
    if (err?.code === 11000) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
