"use client";
import { useState, useEffect } from "react";
import axios from "axios";

import "./style.css";
import { TextInput } from "@/app/components/ui/TextInput";
import { Button } from "@/app/components/ui/button";
import { SendCard } from "@/app/components/SendCard";
// Define a type for user data
interface User {
  id: string;
  name: string;
  email: string;
  number: string;
}

export default function UserSearchComponent() {
  const [search, setSearch] = useState<string>("");
  const [allUserData, setAllUserData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentModal, setPaymentModal] = useState<boolean>(false);
  const [paymentNumber, setPaymentNumber] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/user");
        setAllUserData(response.data);
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = allUserData?.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`w-full mt-4 mr-4 flex gap-y-3 flex-col ${
        paymentModal ? "overflow-hidden" : ""
      }`}
    >
      <div>
        <TextInput
          value={search}
          placeholder={"Search the person name or phone number"}
          onChange={setSearch}
          label=""
        />
      </div>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {filteredUsers && filteredUsers.length > 0 ? (
        filteredUsers.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-gray-50 border border-gray-300 p-2.5 rounded-md"
          >
            <div>
              <h1>{item.name}</h1>
              <p className="text-sm text-gray-400">{item.number}</p>
            </div>
            <Button
              onClick={() => {
                setPaymentModal((prev) => !prev);
                setPaymentNumber(item.number);
              }}
              loading={loading}
            >
              {"Pay"}
            </Button>
          </div>
        ))
      ) : (
        <div>No users found</div>
      )}
      {paymentModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setPaymentModal(false)}
          />
          <div className="modal-content">
            <SendCard
              setPaymentModal={setPaymentModal}
              paymentNumber={paymentNumber}
            />
          </div>
        </>
      )}
    </div>
  );
}
