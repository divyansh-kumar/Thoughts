import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const userID = sessionStorage.getItem('userID');
    if (!userID) {
      const rememberedUserID = localStorage.getItem('userID');
      if (rememberedUserID) {
        sessionStorage.setItem('userID', rememberedUserID);
        const email = localStorage.getItem('email');
        if (email) {
          sessionStorage.setItem('email', email);
        }
      } else {
        router.push('/login');
      }
    }
  }, [router]);
};