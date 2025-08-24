import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";

export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const postId = params.id;
    if (!ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const { title, content } = await req.json();
    if (!title?.trim() && !content?.trim()) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const posts = db.collection("posts");

    const post = await posts.findOne({ _id: new ObjectId(postId) });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (post.author.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await posts.updateOne(
      { _id: new ObjectId(postId) },
      {
        $set: {
          ...(title ? { title: title.trim() } : {}),
          ...(content ? { content: content.trim() } : {}),
          updatedAt: new Date(),
        },
      }
    );

    const updated = await posts.findOne({ _id: new ObjectId(postId) });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const postId = params.id;
    if (!ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const posts = db.collection("posts");

    const post = await posts.findOne({ _id: new ObjectId(postId) });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (post.author.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await posts.deleteOne({ _id: new ObjectId(postId) });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
