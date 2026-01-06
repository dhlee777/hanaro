"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 왼쪽 상단: 블로그 이름 */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tighter hover:text-blue-600 transition-colors"
        >
          HanaBlog
        </Link>

        {/* 오른쪽 상단: 인증 관련 메뉴 */}
        <div className="flex items-center gap-4">
          {session ? (
            /* 로그인 상태 */
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                <span className="font-bold text-black">
                  {session.user?.name}
                </span>
                님
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-xs bg-gray-100 px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-200 transition-all font-medium"
              >
                로그아웃
              </button>
            </div>
          ) : (
            /* 비로그인 상태 */
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-all"
              >
                로그인
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition-all shadow-sm"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
