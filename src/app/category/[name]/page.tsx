// src/app/category/[name]/page.tsx
import { PrismaClient } from "@prisma/client";
import PostList from "@/components/PostList";
import CategoryNav from "@/components/CategoryNav";
import ContributionGraph from "@/components/ContributionGraph";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  // 해당 카테고리 글만 가져오기
  const posts = await prisma.post.findMany({
    where: {
      category: { name: decodedName },
    },
    include: {
      category: true,
      author: { select: { name: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // 카테고리가 아예 없는 경우 404
  const categoryExists = await prisma.category.findUnique({
    where: { name: decodedName },
  });
  if (!categoryExists) return notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <section className="mb-8 p-6 bg-white border rounded-xl shadow-sm">
        <h2 className="text-lg font-bold mb-4">Activity Records</h2>
        <ContributionGraph />
      </section>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-48 shrink-0">
          <CategoryNav />
        </aside>

        <section className="flex-1">
          <h1 className="text-2xl font-bold mb-6">
            #{decodedName} ({posts.length})
          </h1>
          <PostList posts={posts} />
        </section>
      </div>
    </div>
  );
}
