"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // 현재 경로를 유지하면서 쿼리 스트링만 변경합니다.
    if (keyword.trim()) {
      router.push(`${pathname}?search=${encodeURIComponent(keyword)}`);
    } else {
      router.push(pathname); // 검색어 없으면 현재 페이지의 전체 목록
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative mb-6">
      <input
        type="text"
        placeholder="제목이나 본문 내용으로 검색..."
        className="w-full p-3 pl-10 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
      <button
        type="submit"
        className="absolute right-2 top-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
      >
        검색
      </button>
    </form>
  );
}
