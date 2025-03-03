import { NextRequest, NextResponse } from "next/server";
import query from '@/utils/db';

export async function POST(req: NextRequest) {
  try {
    const { title, description, imageUrl, userId, tags } = await req.json();
    const id = crypto.randomUUID();

    const result = await query(
      `INSERT INTO posts (id, title, description, image_url, user_id, tags)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, title, description, imageUrl, userId, tags]
    );

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}