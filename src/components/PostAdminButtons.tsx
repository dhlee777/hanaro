"use client";

import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";

export default function PostAdminButtons({
  postId,
  isAuthor,
}: {
  postId: number;
  isAuthor: boolean;
}) {
  const router = useRouter();

  const onDelete = async () => {
    if (
      !confirm(
        "정말 이 게시글을 삭제하시겠습니까? 관련 댓글도 모두 삭제됩니다."
      )
    )
      return;

    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (res.ok) {
      alert("삭제되었습니다.");
      router.push("/");
      router.refresh();
    } else {
      alert("삭제 실패");
    }
  };

  return (
    <div className="flex gap-2">
      {isAuthor && (
        <button
          onClick={() => router.push(`/write?edit=${postId}`)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 border px-3 py-1 rounded"
        >
          <Edit size={14} /> 수정
        </button>
      )}
      <button
        onClick={onDelete}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 border px-3 py-1 rounded"
      >
        <Trash2 size={14} /> 삭제
      </button>
    </div>
  );
}
