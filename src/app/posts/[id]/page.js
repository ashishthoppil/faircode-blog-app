import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Image from "next/image";

export default async function PostPage({ params }) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const post = await db.collection("posts").aggregate([
    { $match: { _id: new ObjectId(params.id) } },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorInfo",
        pipeline: [{ $project: { name: 1, email: 1, image: 1 } }],
      },
    },
    {
      $addFields: {
        author: { $first: "$authorInfo" },
      },
    },
    { $project: { authorInfo: 0 } },
  ]).next();

  if (!post) {
    return <div className="p-8">Post not found.</div>;
  }

  const date = new Date(post.updatedAt || post.createdAt).toLocaleDateString(
    "en-US",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <article className="max-w-3xl mx-auto px-5 py-10 prose prose-neutral mt-14">
      <header className="mb-8">
        <h1 className="!mb-2">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Image src={post?.author?.image || "/user.png"} alt="author" width={32} height={32} className="rounded-full" />
          <span>{post?.author?.name || "Unknown Author"}</span>
          <span>•</span>
          <time>{date}</time>
        </div>
      </header>

      <Image
        src={"/blog-img.png"}
        alt="cover"
        width={1200}
        height={630}
        className="w-full h-64 object-cover rounded-xl mb-8"
      />

      <div className="whitespace-pre-wrap leading-7 text-gray-800">
        {post.content}
      </div>
    </article>
  );
}
