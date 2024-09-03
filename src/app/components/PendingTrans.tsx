"use client";
import React from "react";
import axios from "axios";

type Transaction = {
  id: string;
  token: string;
  amount: number;
  status: string;
};

type Session = {
  user?: {
    id: string;
  };
};

interface PendingTransProps {
  transaction: Transaction;
  session: Session;
}

const PendingTrans: React.FC<PendingTransProps> = ({
  transaction,
  session,
}) => {
  async function handleTrans() {
    try {
      const response = await axios.post(`/api/bank-webhook`, {
        token: transaction.token,
        user_identifier: Number(session?.user?.id),
        amount: transaction.amount,
      });
      console.log(response);
      if (response.data.message === "Captured") {
        alert("Transaction completed");
        window.location.reload();
      } else {
        alert("Transaction not captured");
      }
    } catch (error) {
      console.error("Transaction error:", error);
      alert("An error occurred while processing the transaction.");
    }
  }

  return (
    <tr key={transaction.id} className="text-center bg-white">
      <td className="px-4 py-2">{transaction.token}</td>
      <td className="px-4 py-2">{transaction.amount}</td>
      <td className="px-4 py-2">
        <button
          className="bg-green-400 px-2 py-1 rounded-md text-white hover:bg-green-700"
          onClick={handleTrans}
        >
          {transaction.status}
        </button>
      </td>
    </tr>
  );
};

export default PendingTrans;
