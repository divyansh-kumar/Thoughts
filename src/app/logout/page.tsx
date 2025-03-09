"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("userID");
    localStorage.removeItem("userID");
    localStorage.removeItem("email"); 

    router.push("/login");
  }, [router]); 

  return null; 
};

export default Logout;
