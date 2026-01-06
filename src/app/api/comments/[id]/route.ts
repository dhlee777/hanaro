import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. 댓글 수정 (PATCH)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });

  const { content } = await req.json();
  const { id } = await params;
  const commentId = parseInt(id);

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });

  // 본인 확인
  if (comment?.authorId !== parseInt(session.user.id)) {
    return NextResponse.json(
      { error: "본인 댓글만 수정 가능합니다." },
      { status: 403 }
    );
  }

  const updated = await prisma.comment.update({
    where: { id: commentId },
    data: {
      content,
      updatedAt: new Date(), // 수정 시간을 현재 시간으로 강제 업데이트
    },
  });

  return NextResponse.json(updated);
}

// 2. 댓글 삭제 (DELETE)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });

  const { id } = await params;
  const commentId = parseInt(id);
  const currentUserId = parseInt(session.user.id);
  const isAdmin = session.user.role === "ADMIN";

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment)
    return NextResponse.json({ error: "댓글이 없습니다." }, { status: 404 });

  try {
    // [로직 1] 작성자 본인인 경우 -> DB에서 완전히 삭제 (Hard Delete)
    if (comment.authorId === currentUserId) {
      await prisma.comment.delete({
        where: { id: commentId },
      });
      return NextResponse.json({ message: "completely deleted" });
    }

    // [로직 2] 본인은 아니지만 관리자인 경우 -> 'isDeleted' 마스킹 처리 (Soft Delete)
    if (isAdmin) {
      await prisma.comment.update({
        where: { id: commentId },
        data: {
          isDeleted: true,
          content: "삭제된 댓글입니다.",
        },
      });
      return NextResponse.json({ message: "masked by admin" });
    }

    // 그 외 (타인이 삭제 시도)
    return NextResponse.json(
      { error: "삭제 권한이 없습니다." },
      { status: 403 }
    );
  } catch (error) {
    console.error("삭제 중 오류 발생:", error);
    return NextResponse.json(
      { error: "처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
