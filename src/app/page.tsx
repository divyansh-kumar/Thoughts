"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("userID");
    if (token) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, [router]);

  return null;
}
