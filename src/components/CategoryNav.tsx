"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CategoryNav() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const params = useParams();
  const currentCategory = params.name
    ? decodeURIComponent(params.name as string)
    : "전체보기";

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <nav className="space-y-1">
      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Categories
      </h3>

      {/* 전체보기 버튼 */}
      <Link
        href="/"
        className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          !params.name
            ? "bg-blue-100 text-blue-700"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        전체보기
      </Link>

      {/* DB에서 가져온 실제 카테고리 목록 */}
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.name}`}
          className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            currentCategory === category.name
              ? "bg-blue-100 text-blue-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
