import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";

export async function GET(req) {
  try {
    const session = await auth();
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    const baseFilter =
      !session?.user?.id || session?.user?.role === "admin"
        ? {}
        : { author: new ObjectId(session.user.id) };

    const filter = { ...baseFilter };
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { authorName: { $regex: q, $options: "i" } },
      ];
    }

    const posts = await db
      .collection("posts")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(posts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { title, content } = await req.json();
    const t = (title || "").trim();
    const c = (content || "").trim();

    if (!t || !c) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const posts = db.collection("posts");

    const now = new Date();
    const doc = {
      title: t,
      content: c,
      author: new ObjectId(session.user.id),
      authorName: session?.user?.name,
      createdAt: now,
      updatedAt: now,
    };

    const { insertedId } = await posts.insertOne(doc);

    return NextResponse.json({ id: insertedId.toString(), ...doc }, { status: 200 });
  } catch (err) {
    console.error("error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
