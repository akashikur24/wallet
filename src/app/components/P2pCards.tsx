import React from "react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getToUser(userId: number) {
  const toUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return toUser;
}

interface P2pCardsProps {
  item: {
    amount: number;
    toUserId: number;
    timestamp: Date;
  };
}

const P2pCards: React.FC<P2pCardsProps> = async ({ item }) => {
  const toUser = await getToUser(item.toUserId);
  const formattedDate = new Date(item.timestamp).toLocaleString();
  if (!toUser) {
    return (
      <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border flex justify-between items-center rounded-md p-2.5 ">
      <p className="flex flex-col">
        <span>{toUser.name}</span>
        <span className="text-sm">{formattedDate}</span>
      </p>
      <p>{item.amount}</p>
    </div>
  );
};

export default P2pCards;
