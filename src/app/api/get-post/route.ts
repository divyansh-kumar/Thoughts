import query from '../../../utils/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        posts.id, 
        posts.title, 
        posts.description, 
        posts.image_url, 
        posts.user_id, 
        users.name, 
        posts.likes, 
        posts.comments, 
        posts.created_at 
      FROM posts
      JOIN users ON posts.user_id = users.uid
      ORDER BY posts.created_at DESC
    `);
    
    console.log(result.rows);
    
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, comment } = body;

    if (comment) {
      // Append comment to the comments array
      const result = await query(
        `UPDATE posts SET comments = array_append(comments, $1) WHERE id = $2 RETURNING comments;`,
        [comment, postId]
      );
      if (result.rowCount === 0) {
        return new Response(JSON.stringify({ error: 'Post not found' }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(result.rows[0]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Increment likes by 1
      const result = await query(
        `UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING likes;`,
        [postId]
      );
      if (result.rowCount === 0) {
        return new Response(JSON.stringify({ error: 'Post not found' }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(result.rows[0]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
