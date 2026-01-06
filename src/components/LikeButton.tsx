"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  postId: number;
  initialLikes: number;
  isLiked: boolean;
  isLoggedIn: boolean;
}

export default function LikeButton({
  postId,
  initialLikes,
  isLiked,
  isLoggedIn,
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(isLiked);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLike = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 기능입니다.");
      router.push("/auth/login");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      const data = await res.json();

      if (data.message === "liked") {
        setLiked(true);
        setLikes((prev) => prev + 1);
      } else if (data.message === "unliked") {
        setLiked(false);
        setLikes((prev) => prev - 1);
      }

      // 서버 데이터 동기화를 위해 백그라운드에서 리프레시
      router.refresh();
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-1 transition-all active:scale-125 ${
        liked ? "text-red-500" : "text-gray-500 hover:text-red-400"
      }`}
    >
      <Heart size={20} fill={liked ? "currentColor" : "none"} />
      <span className="text-sm font-medium">{likes}</span>
    </button>
  );
}
