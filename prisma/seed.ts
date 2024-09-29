import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tables = [1, 2, 3, 4, 5].map(num => {
    return prisma.table.create({
      data: {
        seats: 4 // Predefine 4 seats for each table
      }
    });
  });

  await Promise.all(tables);
  console.log("Tables have been seeded.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
