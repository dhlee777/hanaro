"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/?search=${encodeURIComponent(keyword)}`);
    } else {
      router.push("/"); // 검색어 없으면 전체보기
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
