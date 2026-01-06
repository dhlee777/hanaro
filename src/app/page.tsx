import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import ContributionGraph from "@/components/ContributionGraph";
import CategoryNav from "@/components/CategoryNav";
import PostList from "@/components/PostList";
import SearchInput from "@/components/SearchInput"; // 검색 입력 컴포넌트 추가
import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 2. 검색어를 인자로 받아 필터링하는 함수로 수정
async function getPosts(search?: string) {
  try {
    const posts = await prisma.post.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search } }, // 제목에 포함
              { content: { contains: search } }, // 내용에 포함
            ],
          }
        : {},
      include: {
        category: true,
        author: {
          select: { name: true },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts;
  } catch (error) {
    console.error("데이터를 불러오는 중 오류 발생:", error);
    return [];
  }
}

// Next.js 15+ 규격에 맞춰 searchParams를 Promise로 처리
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  // URL에서 검색어 추출 (/?search=키워드)
  const resolvedParams = await searchParams;
  const searchTerm = resolvedParams.search;

  // 검색어를 반영하여 데이터 가져오기
  const posts = await getPosts(searchTerm);

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
          {/* 검색창: 기존 input 대신 제작한 SearchInput 컴포넌트 사용 */}
          <div className="mb-6">
            <SearchInput />
          </div>

          {/* 검색 결과 안내 문구 */}
          {searchTerm && (
            <div className="mb-4 text-gray-600 animate-in fade-in">
              <span className="font-bold text-blue-600">"{searchTerm}"</span>에
              대한 검색 결과 ({posts.length}건)
            </div>
          )}

          {/* 게시글 리스트 */}
          {posts.length > 0 ? (
            <PostList posts={posts} />
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed text-gray-400">
              {searchTerm
                ? "검색 결과가 없습니다. 다른 키워드로 검색해보세요!"
                : "등록된 게시글이 없습니다."}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
