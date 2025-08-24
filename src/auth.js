import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";
import { ObjectId } from "mongodb";

const authConfig = {
  session: { strategy: "jwt" },
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);
        const user = await db.collection("users").findOne({ email: creds.email });
        if (!user?.passwordHash) return null;
        const ok = await compare(creds.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user._id instanceof ObjectId ? user._id.toString() : String(user._id),
          name: user.name || "",
          email: user.email,
          image: user.image || null,
          role: user.role || null
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
      } else if (token?.email && !token?.role) {
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);
        const found = await db
          .collection("users")
          .findOne({ email: token.email }, { projection: { role: 1 } });
        token.role = found?.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || "user";
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export const GET = handlers.GET;
export const POST = handlers.POST;
