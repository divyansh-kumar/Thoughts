// app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase';
import query from '@/utils/db';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }
    // Sign up the user with Supabase
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    // Insert the new user into the Postgres users table
    const userId = data.user?.id;
    await query(
      "INSERT INTO users (uid, name, email) VALUES ($1, $2, $3)",
      [userId, name, email]
    );
    return NextResponse.json({ message: "User created!", user: data.user }, { status: 201 });
  } catch (err) {
    console.error("Error creating user:", err);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
