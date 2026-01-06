import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. 게시글 수정 (PATCH)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );

  const { title, content, categoryId } = await req.json();
  const { id } = await params;
  const postId = parseInt(id);

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (post?.authorId !== parseInt(session.user.id)) {
    return NextResponse.json(
      { error: "수정 권한이 없습니다." },
      { status: 403 }
    );
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { title, content, categoryId: parseInt(categoryId) },
  });

  return NextResponse.json(updatedPost);
}

// 2. 게시글 삭제 (DELETE)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );

  const { id } = await params;
  const postId = parseInt(id);

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post)
    return NextResponse.json(
      { error: "포스트를 찾을 수 없습니다." },
      { status: 404 }
    );

  // 작성자 본인 또는 관리자만 삭제 가능
  if (
    post.authorId !== parseInt(session.user.id) &&
    session.user.role !== "ADMIN"
  ) {
    return NextResponse.json(
      { error: "삭제 권한이 없습니다." },
      { status: 403 }
    );
  }

  await prisma.post.delete({ where: { id: postId } });
  return NextResponse.json({ message: "성공적으로 삭제되었습니다." });
}

// GET: 수정 페이지에서 기존 데이터를 불러오기 위함
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
  });
  return NextResponse.json(post);
}
