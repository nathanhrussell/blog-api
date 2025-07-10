import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findUnique({
    where: { username: "testauthor" },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        username: "testauthor",
        password: "test123",
        role: "AUTHOR",
      },
    });
  }

  await prisma.post.create({
    data: {
      title: "Seeded Post",
      content: "This post was added via Prisma seed script.",
      published: true,
      authorId: user.id,
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error("❌ Seed error", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
