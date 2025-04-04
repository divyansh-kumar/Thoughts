// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    const uid = data.user?.id;
    const token = data.session?.access_token;
    return NextResponse.json({ token, userID: uid });
  } catch (err) {
    console.error("Error logging in:", err);
    return NextResponse.json({ error: "Error logging in" }, { status: 500 });
  }
}
