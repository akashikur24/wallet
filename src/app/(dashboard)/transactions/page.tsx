import React from "react";
import { PrismaClient } from "@prisma/client";
import P2pCards from "@/app/components/P2pCards";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

const prisma = new PrismaClient();

async function getP2pTransfers(userId: number) {
  const transfers = await prisma.p2pTransfer.findMany({
    where: {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  return transfers.map((transfer) => ({
    ...transfer,
    isSent: transfer.fromUserId === userId,
  }));
}

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>You need to be authenticated to view this page</div>;
  }

  const p2pTransfers = await getP2pTransfers(Number(session.user.id));

  if (!p2pTransfers || p2pTransfers.length === 0) {
    return <div>No transactions found</div>;
  }

  return (
    <div className="w-full mt-4 mr-4 flex gap-y-3 flex-col">
      {p2pTransfers.map((item) => (
        <P2pCards key={item.id} item={item} />
      ))}
    </div>
  );
}
