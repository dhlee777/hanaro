"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Heart, MessageCircle, Clock } from "lucide-react";

// 임시 데이터 타입 정의
interface Post {
  id: number;
  title: string;
  content: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { ref, inView } = useInView();

  // 임시 데이터 생성 (실제로는 API에서 가져오게 됩니다)
  useEffect(() => {
    const mockPosts = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      title: `${i + 1}번째 게시글 제목입니다.`,
      content:
        "이것은 게시글의 미리보기 내용입니다. 여러 줄이 보일 수 있도록 구현합니다. 사용자가 작성한 소중한 지식이 담겨 있습니다...",
      likesCount: Math.floor(Math.random() * 20),
      commentsCount: Math.floor(Math.random() * 10),
      createdAt: "2024-03-21",
    }));
    setPosts(mockPosts);
  }, []);

  // 스크롤이 바닥에 닿았을 때(inView) 데이터 추가 로드 로직
  useEffect(() => {
    if (inView) {
      console.log("다음 페이지 로드 중...");
      // 여기에 추가 API 호출 로직이 들어갑니다.
    }
  }, [inView]);

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="p-6 bg-white border rounded-xl hover:shadow-md transition-shadow cursor-pointer"
        >
          <h3 className="text-xl font-bold mb-2 text-gray-900">{post.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {post.content}
          </p>

          <div className="flex items-center gap-4 text-gray-500 text-xs">
            <div className="flex items-center gap-1">
              <Heart size={14} className="text-red-500" />
              <span>{post.likesCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={14} />
              <span>{post.commentsCount}</span>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <Clock size={14} />
              <span>{post.createdAt}</span>
            </div>
          </div>
        </article>
      ))}

      {/* 무한 스크롤 감지 포인트 */}
      <div
        ref={ref}
        className="h-10 flex items-center justify-center text-gray-400 text-sm"
      >
        {inView ? "데이터를 불러오는 중..." : "더 이상 게시글이 없습니다."}
      </div>
    </div>
  );
}
