import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SearchInput from "@/components/SearchInput"; // 이미 만든 검색창 재사용

const prisma = new PrismaClient();

export default async function AdminUserPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const session = await getServerSession(authOptions);

  // 관리자 권한 체크
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  const { search } = await searchParams;

  const users = await prisma.user.findMany({
    where: search
      ? {
          OR: [{ name: { contains: search } }, { email: { contains: search } }],
        }
      : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold">회원 관리</h1>
          <p className="text-gray-500">전체 사용자 목록을 관리합니다.</p>
        </div>
        <div className="w-64">
          <SearchInput /> {/* 회원 검색창 */}
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                이름
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                이메일
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                권한
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">
                가입일
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-bold ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            사용자를 찾을 수 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
