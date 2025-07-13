import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const author = await prisma.user.create({
    data: {
      username: "Editor",
      password: hashedPassword,
      role: "AUTHOR",
    },
  });

  console.log("Editor created:", author);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
