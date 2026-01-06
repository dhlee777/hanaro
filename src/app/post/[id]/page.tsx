import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Heart, MessageCircle, User, Calendar } from "lucide-react";
import LikeButton from "@/components/LikeButton";
const prisma = new PrismaClient();

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // 1. 타입을 Promise로 변경
}) {
  // 2. params를 await로 기다려서 받아옵니다.
  const resolvedParams = await params;
  const postId = parseInt(resolvedParams.id);
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id ? parseInt(session.user.id) : null;
  // 3. postId가 제대로 숫자인지 체크 (디버깅용)
  if (isNaN(postId)) {
    console.error("잘못된 게시글 ID입니다:", resolvedParams.id);
    return notFound();
  }

  // 4. 이제 Prisma 호출
  const post = await prisma.post.findUnique({
    where: {
      id: postId, // 이제 정확한 숫자가 들어갑니다.
    },
    include: {
      author: true,
      category: true,
      likes: true, // 좋아요 목록 가져오기
    },
  });

  if (!post) return notFound();
  // 현재 유저가 이 글에 좋아요를 눌렀는지 확인
  // 수정된 판별 로직: 반드시 타입을 맞춰서 비교 (숫자 vs 숫자)
  const isLiked = currentUserId
    ? post.likes.some((like) => like.userId === currentUserId)
    : false;
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 카테고리 & 날짜 */}
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
          {post.category?.name}
        </span>
        <div className="flex items-center text-gray-400 text-sm">
          <Calendar size={14} className="mr-1" />
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* 제목 */}
      <h1 className="text-4xl font-bold mb-8 text-gray-900 leading-tight">
        {post.title}
      </h1>

      {/* 작성자 정보 */}
      <div className="flex items-center justify-between p-6 border-y mb-10 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
            <User size={20} />
          </div>
          <div>
            <p className="font-bold text-gray-800">{post.author?.name}</p>
            <p className="text-xs text-gray-500">{post.author?.email}</p>
          </div>
        </div>

        {/* 좋아요/댓글 요약 (클라이언트 컴포넌트로 분리 예정) */}
        <div className="flex gap-4">
          <LikeButton
            postId={post.id}
            initialLikes={post.likes.length}
            isLiked={isLiked}
            isLoggedIn={!!session}
          />
          <div className="flex items-center gap-1 text-gray-500">
            <MessageCircle size={20} />
            <span className="text-sm font-medium">0</span>
          </div>
        </div>
      </div>

      {/* 본문 내용 */}
      <div className="prose prose-lg max-w-none mb-16 text-gray-800 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>

      {/* 댓글 영역 (컴포넌트 추가 예정) */}
      <section className="border-t pt-10">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
          Comments <span className="text-blue-600 text-lg">0</span>
        </h3>
        {/* 여기에 CommentSection 컴포넌트 삽입 */}
        <div className="p-8 bg-gray-50 rounded-xl text-center text-gray-500 border-2 border-dashed">
          댓글 기능이 곧 업데이트됩니다!
        </div>
      </section>
    </div>
  );
}
