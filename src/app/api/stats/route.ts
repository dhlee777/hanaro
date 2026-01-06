import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { startOfYear, endOfYear } from "date-fns";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const startDate = startOfYear(new Date(2026, 0, 1));
    const endDate = endOfYear(new Date(2026, 11, 31));

    // 2026년의 모든 게시물 가져오기
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { createdAt: { gte: startDate, lte: endDate } },
          { updatedAt: { gte: startDate, lte: endDate } },
        ],
      },
      select: { createdAt: true, updatedAt: true },
    });

    // 날짜별 활동량 카운트 (YYYY-MM-DD 형식 키 사용)
    const stats: Record<string, number> = {};

    posts.forEach((post) => {
      const createdKey = post.createdAt.toISOString().split("T")[0];
      const updatedKey = post.updatedAt.toISOString().split("T")[0];

      stats[createdKey] = (stats[createdKey] || 0) + 1;
      // 생성일과 수정일이 다를 때만 수정일도 카운트 (중복 방지)
      if (createdKey !== updatedKey) {
        stats[updatedKey] = (stats[updatedKey] || 0) + 1;
      }
    });

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "통계를 가져오지 못했습니다." },
      { status: 500 }
    );
  }
}
