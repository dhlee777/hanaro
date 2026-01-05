"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("회원가입 성공! 로그인 페이지로 이동합니다.");
        router.push("/login");
      } else {
        setError(data.message || "오류가 발생했습니다.");
      }
    } catch (err) {
      setError("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">계정 생성</h1>
          <p className="mt-2 text-sm text-gray-600">
            Hana Blog에 오신 것을 환영합니다
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              이름
            </label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="홍길동"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="example@email.com"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {error && <p className="text-sm font-medium text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isLoading ? "처리 중..." : "가입하기"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="font-bold text-blue-600 hover:underline"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
