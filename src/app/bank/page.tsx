import React from "react";
import { authOptions } from "../lib/auth";
import { getServerSession } from "next-auth";
import prisma from "../db";
import PendingTrans from "../components/PendingTrans";

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div>
        <h1>You need to be authenticated to view this page</h1>
      </div>
    );
  }

  const pendingTransactions = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(session.user.id),
      status: "Processing",
    },
  });

  return (
    <div className="mx-10">
      <h1 className="text-3xl text-[#6a51a6] font-bold pt-8 mb-8">
        Pending Transactions
      </h1>
      {pendingTransactions.length > 0 ? (
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th>Token</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingTransactions.map((transaction: any) => (
              <PendingTrans
                key={transaction.id}
                transaction={transaction}
                session={session}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending transactions found.</p>
      )}
    </div>
  );
};

export default Page;
