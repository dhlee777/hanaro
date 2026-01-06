import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// params 타입을 Promise로 정의합니다.
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

  // 1. params를 await로 기다린 후 id를 추출합니다.
  const resolvedParams = await params;
  const postId = parseInt(resolvedParams.id);
  const userId = parseInt(session.user.id);

  try {
    // 2. 이미 좋아요를 눌렀는지 확인
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      // 이미 있다면 좋아요 취소 (삭제)
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json({ message: "unliked" });
    } else {
      // 없다ve면 좋아요 추가 (생성)
      await prisma.like.create({
        data: { userId, postId },
      });
      return NextResponse.json({ message: "liked" });
    }
  } catch (error) {
    console.error("좋아요 처리 에러:", error);
    return NextResponse.json(
      { error: "좋아요 처리 중 오류 발생" },
      { status: 500 }
    );
  }
}
