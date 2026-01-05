import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "JavaScript", slug: "javascript", order: 1 },
    { name: "TypeScript", slug: "typescript", order: 2 },
    { name: "React", slug: "react", order: 3 },
    { name: "Next.js", slug: "nextjs", order: 4 },
    { name: "Database", slug: "database", order: 5 },
  ];

  console.log("Start seeding categories...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, order: category.order },
      create: category,
    });
  }

  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
