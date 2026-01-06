import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );

  const { content, parentId } = await req.json();
  const resolvedParams = await params;
  const postId = parseInt(resolvedParams.id);
  const authorId = parseInt(session.user.id);

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
        parentId: parentId ? parseInt(parentId) : null, // 답글인 경우 부모 ID 저장
      },
      include: {
        author: { select: { name: true, image: true } },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: "댓글 작성 실패" }, { status: 500 });
  }
}
