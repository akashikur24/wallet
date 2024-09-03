"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Center } from "./ui/Center";
import { TextInput } from "./ui/TextInput";
import { p2pTransfer } from "../lib/actions/p2pTransfer";

interface SendCardProps {
  setPaymentModal: React.Dispatch<React.SetStateAction<boolean>>;
  paymentNumber: string;
}

export function SendCard({ setPaymentModal, paymentNumber }: SendCardProps) {
  const [number, setNumber] = useState<string>(paymentNumber);
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      await p2pTransfer(number, Number(amount) * 100);
    } catch (error) {
      console.error("Error during transfer:", error);
    } finally {
      setLoading(false);
      setPaymentModal(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50 z-10"
        onClick={() => setPaymentModal(false)}
      />
      <div className="relative z-20">
        <Center>
          <Card title="Send">
            <div className="min-w-72 pt-2">
              <TextInput
                placeholder="Number"
                label="Number"
                onChange={setNumber}
                value={number}
              />
              <TextInput
                placeholder="Amount"
                label="Amount"
                onChange={setAmount}
                value={amount}
              />
              <div className="pt-4 flex justify-center">
                <Button loading={loading} onClick={handleSend}>
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </Center>
      </div>
    </div>
  );
}
