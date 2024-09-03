import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { OnRampTransactions } from "@/app/components/OnRampTransactions";
import { BalanceCard } from "@/app/components/BalanceCard";
import { AddMoney } from "@/app/components/AddMoneyCard";

const prisma = new PrismaClient();
export interface OnRampTransaction {
  startTime: Date;
  amount: number;
  status: string;
  provider: string;
  userId: number;
}

async function getBalance() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    redirect("/");
  }
  const balance = await prisma.balance.findFirst({
    where: {
      userId: Number(session?.user?.id),
    },
  });
  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0,
  };
}

async function getOnRampTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(session?.user?.id),
    },
  });
  return txns.map((t: OnRampTransaction) => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));
}

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default async function () {
  const balance = await getBalance();
  const transactions = await getOnRampTransactions();

  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transfer
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <AddMoney />
        </div>
        <div className="">
          <BalanceCard amount={balance.amount} locked={balance.locked} />
          <div className="pt-4 ">
            <OnRampTransactions transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
