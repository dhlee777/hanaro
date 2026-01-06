"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownRight, Trash2, Edit2, X, Check } from "lucide-react";

interface Comment {
  id: number;
  content: string;
  authorId: number;
  parentId: number | null;
  isDeleted: boolean;
  createdAt: string;
  author: { name: string };
}

interface Props {
  postId: number;
  initialComments: Comment[];
  isLoggedIn: boolean;
  currentUserId: number | null;
  isAdmin: boolean;
}

export default function CommentSection({
  postId,
  initialComments,
  isLoggedIn,
  currentUserId,
  isAdmin,
}: Props) {
  const [content, setContent] = useState("");
  const [editContent, setEditContent] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const router = useRouter();

  // 1. 댓글/답글 등록
  const handleSubmit = async (parentId: number | null = null) => {
    if (!content.trim()) return;
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, parentId }),
    });
    if (res.ok) {
      setContent("");
      setReplyTo(null);
      router.refresh();
    }
  };

  // 2. 댓글 삭제 (isDeleted 처리)
  const handleDelete = async (commentId: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  // 3. 댓글 수정
  const handleEdit = async (commentId: number) => {
    const res = await fetch(`/api/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editContent }),
    });
    if (res.ok) {
      setEditingId(null);
      router.refresh();
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  return (
    <div className="mt-10 space-y-6">
      <h3 className="text-xl font-bold mb-4">Comments</h3>

      {/* 댓글 입력창 */}
      <div className="bg-gray-50 border rounded-xl p-4">
        <textarea
          className="w-full p-3 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
          placeholder={
            isLoggedIn ? "댓글을 입력하세요..." : "로그인이 필요합니다."
          }
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!isLoggedIn}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={() => handleSubmit(null)}
            disabled={!isLoggedIn || !content.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:bg-gray-300"
          >
            댓글 등록
          </button>
        </div>
      </div>

      {/* 댓글 리스트 */}
      <div className="space-y-4">
        {initialComments
          .filter((c) => !c.parentId)
          .map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-4">
              {/* 부모 댓글 본체 */}
              <CommentItem
                comment={comment}
                isReply={false}
                {...{
                  isLoggedIn,
                  currentUserId,
                  isAdmin,
                  editingId,
                  editContent,
                  setEditContent,
                  startEdit,
                  setEditingId,
                  handleEdit,
                  handleDelete,
                  setReplyTo,
                  replyTo,
                  content,
                  setContent,
                  handleSubmit,
                }}
              />

              {/* 대댓글 리스트 */}
              <div className="ml-10 mt-4 space-y-4">
                {initialComments
                  .filter((r) => r.parentId === comment.id)
                  .map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      isReply={true}
                      {...{
                        isLoggedIn,
                        currentUserId,
                        isAdmin,
                        editingId,
                        editContent,
                        setEditContent,
                        startEdit,
                        setEditingId,
                        handleEdit,
                        handleDelete,
                        setReplyTo,
                        replyTo,
                        content,
                        setContent,
                        handleSubmit,
                      }}
                    />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// 개별 댓글 아이템 컴포넌트 (내부 사용용)
function CommentItem({ comment, isReply, ...props }: any) {
  const isAuthor = props.currentUserId === comment.authorId;
  const canDelete = isAuthor || props.isAdmin;

  return (
    <div className={`flex gap-3 ${comment.isDeleted ? "opacity-60" : ""}`}>
      {isReply && <CornerDownRight size={16} className="text-gray-300 mt-1" />}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">{comment.author?.name}</span>
            <span className="text-[10px] text-gray-400">
              {comment.updatedAt &&
              new Date(comment.updatedAt).getTime() -
                new Date(comment.createdAt).getTime() >
                1000
                ? `${new Date(comment.updatedAt).toLocaleString()} (수정됨)`
                : new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>

          {/* 권한 버튼 (삭제되지 않았을 때만 표시) */}
          {!comment.isDeleted && (
            <div className="flex gap-2">
              {isAuthor && props.editingId !== comment.id && (
                <button
                  onClick={() => props.startEdit(comment)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  <Edit2 size={14} />
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => props.handleDelete(comment.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* 댓글 내용 (수정 모드 분기) */}
        {props.editingId === comment.id ? (
          <div className="mt-2 flex gap-2">
            <input
              className="flex-1 border-b focus:border-blue-500 outline-none text-sm py-1"
              value={props.editContent}
              onChange={(e) => props.setEditContent(e.target.value)}
            />
            <button
              onClick={() => props.handleEdit(comment.id)}
              className="text-green-500"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => props.setEditingId(null)}
              className="text-gray-400"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <p
            className={`text-sm ${
              comment.isDeleted
                ? "text-gray-400 italic"
                : "text-gray-700 leading-relaxed"
            }`}
          >
            {comment.content}
          </p>
        )}

        {/* 답글 버튼 (부모 댓글이고 삭제 안 됐을 때만) */}
        {!isReply && !comment.isDeleted && (
          <button
            onClick={() =>
              props.setReplyTo(props.replyTo === comment.id ? null : comment.id)
            }
            className="text-[11px] text-blue-600 mt-2 font-semibold"
          >
            {props.replyTo === comment.id ? "취소" : "답글 달기"}
          </button>
        )}

        {/* 답글 입력창 */}
        {props.replyTo === comment.id && (
          <div className="mt-3 flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="답글을 입력하세요..."
              value={props.content}
              onChange={(e) => props.setContent(e.target.value)}
            />
            <button
              onClick={() => props.handleSubmit(comment.id)}
              className="bg-gray-800 text-white px-3 py-1 rounded-md text-xs"
            >
              등록
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
