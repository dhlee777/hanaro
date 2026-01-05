"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

// 임시 데이터 (나중에 DB에서 가져오도록 수정할 예정입니다)
const categories = [
  { name: "전체보기", slug: "all" },
  { name: "JavaScript", slug: "javascript" },
  { name: "TypeScript", slug: "typescript" },
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextjs" },
];

export default function CategoryNav() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  return (
    <nav className="space-y-1">
      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Categories
      </h3>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={category.slug === "all" ? "/" : `/?category=${category.slug}`}
          className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            currentCategory === category.slug
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
