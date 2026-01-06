import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  Heart,
  MessageCircle,
  User,
  Calendar,
  MoreVertical,
} from "lucide-react";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";
import PostAdminButtons from "@/components/PostAdminButtons"; // 추가된 버튼 컴포넌트

const prisma = new PrismaClient();

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const postId = parseInt(resolvedParams.id);
  const session = await getServerSession(authOptions);

  // 현재 유저 정보 및 관리자 여부 확인
  const currentUserId = session?.user?.id ? parseInt(session.user.id) : null;
  const isAdmin = session?.user?.role === "ADMIN";

  if (isNaN(postId)) {
    console.error("잘못된 게시글 ID입니다:", resolvedParams.id);
    return notFound();
  }

  // 데이터 가져오기 (댓글 정보 포함)
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      category: true,
      likes: true,
      comments: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) return notFound();

  // 권한 확인: 작성자 본인인가?
  const isAuthor = currentUserId === post.authorId;
  // 수정/삭제 권한이 있는가? (본인 혹은 관리자)
  const canManage = isAuthor || isAdmin;

  // 좋아요 여부 판별
  const isLiked = currentUserId
    ? post.likes.some((like) => like.userId === currentUserId)
    : false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 상단: 카테고리, 날짜 및 관리 버튼 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
            {post.category?.name}
          </span>
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar size={14} className="mr-1" />
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* 수정/삭제 버튼: 권한이 있을 때만 노출 */}
        {canManage && <PostAdminButtons postId={post.id} isAuthor={isAuthor} />}
      </div>

      {/* 제목 */}
      <h1 className="text-4xl font-bold mb-8 text-gray-900 leading-tight">
        {post.title}
      </h1>

      {/* 작성자 및 통계 정보 */}
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

        <div className="flex gap-4">
          <LikeButton
            postId={post.id}
            initialLikes={post.likes.length}
            isLiked={isLiked}
            isLoggedIn={!!session}
          />
          <div className="flex items-center gap-1 text-gray-500">
            <MessageCircle size={20} />
            <span className="text-sm font-medium">{post.comments.length}</span>
          </div>
        </div>
      </div>

      {/* 본문 내용 */}
      <div className="prose prose-lg max-w-none mb-16 text-gray-800 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>

      {/* 댓글 영역 */}
      <section className="border-t pt-10">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
          Comments{" "}
          <span className="text-blue-600 text-lg">{post.comments.length}</span>
        </h3>

        <CommentSection
          postId={post.id}
          initialComments={post.comments.map((c) => ({
            ...c,
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
          }))}
          isLoggedIn={!!session}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
        />
      </section>
    </div>
  );
}
