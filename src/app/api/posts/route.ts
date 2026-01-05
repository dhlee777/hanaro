import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // 1. 보안 체크: 로그인 여부와 관리자 권한 확인
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  try {
    const { title, content, categoryId } = await req.json();

    // 2. DB에 게시글 생성
    const post = await prisma.post.create({
      data: {
        title,
        content,
        categoryId: parseInt(categoryId),
        authorId: session.user.id, // 현재 로그인한 관리자 ID
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "글 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
