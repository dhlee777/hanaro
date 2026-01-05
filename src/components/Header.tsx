"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 왼쪽 상단: 블로그 이름 */}
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          HanaBlog
        </Link>

        {/* 오른쪽 상단: 로그인/사용자 이름 */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                <span className="font-bold">{session.user?.name}</span>님
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-xs text-gray-500 hover:underline"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition-all"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
