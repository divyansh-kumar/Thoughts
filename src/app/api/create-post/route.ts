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




xsmtpsib-d7ed8b1d0c2ab412f39c5727de4702624fd2311dd2cee44d4a7fbfc9e2ac036e-krdKMDOTGpz0bXfU


fhjbnu83yh29i8h92hi8981girubnaif8*(Uiufh99)dfsad