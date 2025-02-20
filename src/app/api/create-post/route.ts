// app/api/create-post/route.ts
import { NextRequest, NextResponse } from "next/server";
import query from '@/utils/db';

export async function POST(req: NextRequest) {
  try {
    const { title, description, imageUrl, userId } = await req.json();
    // Generate a UUID for the post (Node 18+ supports crypto.randomUUID)
    const id = crypto.randomUUID();

    const result = await query(
      "INSERT INTO posts (id, title, description, image_url, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, title, description, imageUrl, userId]
    );

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
