/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react/jsx-key */
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import P2pCards from "@/app/components/P2pCards";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function p2pTrans() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    console.error("User not authenticated");
    return [];
  }
  const p2p = await prisma.p2pTransfer.findMany({
    where: {
      fromUserId: Number(session?.user?.id),
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  return p2p;
}

// eslint-disable-next-line react/display-name
export default async function () {
  const p2pTransaction = await p2pTrans();

  if (!p2pTransaction || p2pTransaction.length === 0) {
    return <div>No transactions found</div>;
  }

  return (
    <div className="w-full mt-4 mr-4 flex gap-y-3 flex-col">
      {p2pTransaction.map((item: any) => (
        <P2pCards item={item} />
      ))}
    </div>
  );
}
