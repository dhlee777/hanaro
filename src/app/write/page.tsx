"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// useSearchParams를 사용하는 부분은 Suspense로 감싸는 것이 Next.js 권장 사항입니다.
function WriteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit"); // URL에서 ?edit=ID 추출

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  // 1. 초기 데이터 로드 (카테고리 목록 + 수정 시 기존 글 내용)
  useEffect(() => {
    // 카테고리 로드
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    // 수정 모드인 경우 기존 글 데이터 로드
    if (editId) {
      fetch(`/api/posts/${editId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setTitle(data.title);
            setContent(data.content);
            setCategoryId(data.categoryId.toString());
          }
        })
        .catch((err) => console.error("기존 글 로딩 실패:", err));
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 수정 모드면 PATCH, 새 글이면 POST
    const url = editId ? `/api/posts/${editId}` : "/api/posts";
    const method = editId ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          categoryId: parseInt(categoryId), // 숫자로 변환하여 전송
        }),
      });

      if (response.ok) {
        alert(
          editId
            ? "글이 성공적으로 수정되었습니다!"
            : "글이 성공적으로 등록되었습니다!"
        );
        // 수정 완료 후에는 해당 글로, 새 글 등록 후에는 메인으로
        router.push(editId ? `/post/${editId}` : "/");
        router.refresh();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "문제가 발생했습니다.");
      }
    } catch (error) {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">
        {editId ? "게시글 수정" : "새 글 작성"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2">카테고리</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="">카테고리 선택</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border rounded-lg h-96 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="내용을 입력하세요"
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition shadow-md"
          >
            {isLoading ? "처리 중..." : editId ? "수정 완료" : "등록하기"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Next.js App Router에서 useSearchParams를 쓰려면 Suspense로 감싸야 빌드 에러가 안 납니다.
export default function WritePage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <WriteForm />
    </Suspense>
  );
}
