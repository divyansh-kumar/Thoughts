import { NextRequest, NextResponse } from "next/server";
import query from "@/utils/db";

export async function POST(req: NextRequest) {
  try {
    const { followerId, followingId, action } = await req.json();
    if (!followerId || !followingId || !action) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }
    
    if (action === "follow") {
      // Update the current user's following array.
      // If no row exists for the current user, insert one with following_id as an array with the followed user id.
      // If a row exists, use COALESCE to treat a null following_id as an empty array, then append the new id.
      await query(
        `
        INSERT INTO follows (user_id, followers_id)
        VALUES ($1, ARRAY[$2]::uuid[])
        ON CONFLICT (user_id) DO UPDATE
          SET followers_id = COALESCE(follows.followers_id, '{}') || $2
        `,
        [followerId, followingId]
      );

      // Update the followed user's followers array.
      await query(
        `
        INSERT INTO follows (user_id, following_id)
        VALUES ($1, ARRAY[$2]::uuid[])
        ON CONFLICT (user_id) DO UPDATE
          SET followers_id = COALESCE(follows.following_id, '{}') || $2
        `,
        [followingId, followerId]
      );

      return NextResponse.json({ message: "Followed" }, { status: 200 });
      
    } else if (action === "unfollow") {
      // Remove followingId from current user's following array.
      await query(
        `
        UPDATE follows
        SET followers_id = array_remove(COALESCE(followers_id, '{}'), $2)
        WHERE user_id = $1
        `,
        [followerId, followingId]
      );

      // Remove followerId from the followed user's followers array.
      await query(
        `
        UPDATE follows
        SET following_id = array_remove(COALESCE(following_id, '{}'), $1)
        WHERE user_id = $2
        `,
        [followerId, followingId]
      );

      return NextResponse.json({ message: "Unfollowed" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
