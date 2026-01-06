import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import ContributionGraph from "@/components/ContributionGraph";
import CategoryNav from "@/components/CategoryNav";
import PostList from "@/components/PostList";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";

// 1. Prisma 클라이언트 생성 (데이터베이스 연결)
const prisma = new PrismaClient();

// 2. 게시글 데이터를 가져오는 비동기 함수
async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        category: true, // 카테고리 이름 표시를 위해 포함
        author: {
          // 작성자 정보 포함
          select: { name: true },
        },
        _count: {
          select: {
            likes: true, // 좋아요 개수를 가져옴
            comments: true, // 댓글 개수를 가져옴
          },
        },
      },
      orderBy: {
        createdAt: "desc", // 최신순 정렬
      },
    });
    return posts;
  } catch (error) {
    console.error("데이터를 불러오는 중 오류 발생:", error);
    return [];
  }
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  // 3. 실제 DB 데이터 가져오기
  const posts = await getPosts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 1. 잔디밭 */}
      <section className="mb-8 p-6 bg-white border rounded-xl shadow-sm">
        <h2 className="text-lg font-bold mb-4">Activity Records</h2>
        <ContributionGraph />
      </section>

      {/* 2. 관리자 전용 버튼 */}
      {isAdmin && (
        <div className="flex gap-2 mb-6">
          <Link
            href="/write"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            게시글 작성
          </Link>
          <Link
            href="/admin/users"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
          >
            회원 관리
          </Link>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* 3. 사이드바 - 카테고리 목록 */}
        <aside className="w-full md:w-48 shrink-0">
          <CategoryNav />
        </aside>

        {/* 4. 메인 게시판 영역 */}
        <section className="flex-1">
          <div className="mb-6">
            <input
              type="text"
              placeholder="제목 + 내용 검색"
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* 4. 가져온 데이터를 PostList에 posts라는 이름으로 전달 */}
          <PostList posts={posts} />
        </section>
      </div>
    </div>
  );
}
