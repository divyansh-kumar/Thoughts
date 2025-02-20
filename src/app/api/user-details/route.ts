// app/api/user-details/route.ts
import query from "../../../utils/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");
  if (!uid) {
    return new Response(JSON.stringify({ error: "uid is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    // Get user info
    const userRes = await query(
      "SELECT uid, name, email FROM users WHERE uid = $1",
      [uid]
    );
    if (userRes.rowCount === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    const user = userRes.rows[0];

    // Get posts count (using column 'user_id' in posts table)
    const postsRes = await query(
      "SELECT COUNT(*) as count FROM posts WHERE user_id = $1",
      [uid]
    );
    const postsCount =
      postsRes.rowCount > 0 && postsRes.rows[0].count
        ? postsRes.rows[0].count
        : 0;

    // Get following count (number of users this user is following)
    const followingRes = await query(
      "SELECT COALESCE(array_length(following_id, 1), 0) AS following_count FROM follows WHERE user_id = $1",
      [uid]
    );
    const followingCount =
      followingRes.rowCount > 0 && followingRes.rows[0].following_count !== null
        ? followingRes.rows[0].following_count
        : 0;

    // Get followers count (number of users following this user)
    const followersRes = await query(
      "SELECT COALESCE(array_length(followers_id, 1), 0) AS followers_count FROM follows WHERE user_id = $1",
      [uid]
    );
    const followersCount =
      followersRes.rowCount > 0 && followersRes.rows[0].followers_count !== null
        ? followersRes.rows[0].followers_count
        : 0;

    return new Response(
      JSON.stringify({
        uid: user.uid,
        name: user.name,
        email: user.email,
        postsCount,
        followingCount,
        followersCount,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
