"use client";

import { Heart, MessageCircle, Clock } from "lucide-react";
import Link from "next/link";

// 1. 실제 데이터에 맞는 타입 정의
interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: Date | string;
  category?: { name: string };
  author?: { name: string | null };
  _count?: {
    likes: number; // 실제 DB에 좋아요/댓글 기능이 있다면 사용
    comments: number;
  };
}

// 2. 부모(page.tsx)로부터 posts 데이터를 받음
export default function PostList({ posts }: { posts: Post[] }) {
  // 데이터가 없을 때 처리
  if (!posts || posts.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed">
        아직 작성된 게시글이 없습니다. 첫 글을 작성해보세요!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        // 3. 상세 페이지로 이동할 수 있게 Link 추가
        <Link href={`/post/${post.id}`} key={post.id}>
          <article className="p-6 bg-white border rounded-xl hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group">
            {/* 카테고리 뱃지 */}
            {post.category && (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-3 inline-block">
                {post.category.name}
              </span>
            )}

            <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h3>

            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {post.content}
            </p>

            <div className="flex items-center gap-4 text-gray-500 text-xs">
              <div className="flex items-center gap-1">
                <Heart size={14} className="text-gray-400" />
                <span>{post._count?.likes || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={14} />
                <span>{post._count?.comments || 0}</span>
              </div>

              {/* 작성자 이름 표시 */}
              <div className="ml-4 border-l pl-4">
                By{" "}
                <span className="font-medium text-gray-700">
                  {post.author?.name || "익명"}
                </span>
              </div>

              <div className="flex items-center gap-1 ml-auto">
                <Clock size={14} />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </article>
        </Link>
      ))}

      {/* 무한 스크롤 UI는 유지하되, 현재는 데이터가 적으므로 안내 문구만 표시 */}
      <div className="h-20 flex items-center justify-center text-gray-400 text-sm italic">
        검색 결과의 마지막입니다.
      </div>
    </div>
  );
}
