"use client";

import { useSession } from "next-auth/react";

export default function TestPage() {
  const { data, status } = useSession();

  console.log("session:", data);

  return (
    <div>
      <p>status: {status}</p>
      <pre>{JSON.stringify(data?.user, null, 2)}</pre>
    </div>
  );
}
