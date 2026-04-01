import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const alice = prisma.user.upsert({
    where: {
      number: "111111111",
    },
    update: {},
    create: {
      number: "111111111",
      password: await bcrypt.hash("alice", 10),
      name: "alice",
      Balance: {
        create: {
          amount: 2000,
          locked: 0,
        },
      },
      onRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 20000,
          token: "token__1",
          provider: "HDFC Bank",
        },
      },
    },
  });
  const bob = prisma.user.upsert({
    where: {
      number: "222222222",
    },
    update: {},
    create: {
      number: "222222222",
      password: await bcrypt.hash("bob", 10),
      name: "bob",
      Balance: {
        create: {
          amount: 20000,
          locked: 0,
        },
      },
      onRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Failure",
          amount: 2000,
          token: "token__2",
          provider: "HDFC Bank",
        },
      },
    },
  });
  console.log({alice , bob}) ;
}

main().then(async () => {
    await prisma.$disconnect();
})
