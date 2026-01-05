import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import ContributionGraph from "@/components/ContributionGraph";
import CategoryNav from "@/components/CategoryNav";
import PostList from "@/components/PostList";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* 1. 잔디밭 (상단 고정 영역) */}
      <section className="mb-8 p-6 bg-white border rounded-xl shadow-sm">
        <h2 className="text-lg font-bold mb-4">Activity Records</h2>
        <ContributionGraph />
      </section>

      {/* 2. 관리자 전용 버튼 (관리자일 때만 노출) */}
      {isAdmin && (
        <div className="flex gap-2 mb-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            게시글 작성
          </button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
            회원 관리
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* 3. 사이드바 - 카테고리 목록 */}
        <aside className="w-full md:w-48 shrink-0">
          <CategoryNav />
        </aside>

        {/* 4. 메인 게시판 영역 (무한스크롤 + 검색) */}
        <section className="flex-1">
          <div className="mb-6">
            <input
              type="text"
              placeholder="제목 + 내용 검색"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <PostList /> {/* 여기서 무한 스크롤 구현 */}
        </section>
      </div>
    </div>
  );
}
