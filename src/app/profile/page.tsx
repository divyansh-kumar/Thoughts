// app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const storedUid = localStorage.getItem('uid');
    setUid(storedUid);
  }, []);

  if (!uid) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p>You are not logged in.</p>
      </div>
    );
  }

  // Optionally, you could fetch additional user data from your API here.
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <p>User ID: {uid}</p>
      {/* Add more profile details as needed */}
    </div>
  );
}
