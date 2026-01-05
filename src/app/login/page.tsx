"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div>
      <button onClick={() => signIn("github")}>GitHub 로그인</button>

      <button
        onClick={() =>
          signIn("credentials", {
            email: "admin@hanaro.com",
            password: "admin1234",
            callbackUrl: "/",
          })
        }
      >
        이메일 로그인
      </button>
    </div>
  );
}
