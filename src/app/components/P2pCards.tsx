import React from "react";

interface P2pCardsProps {
  item: {
    amount: number;
    timestamp: Date;
    isSent: boolean; // Added prop to determine if the transaction is sent
  };
}

const P2pCards: React.FC<P2pCardsProps> = ({ item }) => {
  const formattedDate = new Date(item.timestamp).toLocaleString();

  const amountClass = item.isSent
    ? "text-red-500" // Red for sent transactions
    : "text-green-500"; // Green for received transactions

  return (
    <div className="bg-gray-50 border flex justify-between items-center rounded-md p-2.5">
      <p className="flex flex-col">
        <span>{item.isSent ? "Sent" : "Received"}</span>
        <span className="text-sm">{formattedDate}</span>
      </p>
      <p className={amountClass}>
        {item.isSent ? `- ${item.amount}` : `+ ${item.amount}`}
      </p>
    </div>
  );
};

export default P2pCards;
