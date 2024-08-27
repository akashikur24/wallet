/* eslint-disable react/no-children-prop */
"use client";

import { Button } from "@/app/components/ui/button";
import { TextInput } from "@/app/components/ui/TextInput";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Signup = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleSumit = async () => {
    setLoading((prev) => !prev);
    const userData = {
      name,
      email,
      password,
      phone,
    };

    try {
      await axios.post("/api/signup", userData).then((res) => {
        if (res.status == 201) {
          setLoading((prev) => !prev);
          router.push("/signin");
        }
      });
    } catch (error) {
      setLoading((prev) => !prev);
      alert("Signup failed");
    }
  };
  return (
    <div className="flex justify-center items-center">
      <div className="w-1/3 flex flex-col gap-y-4">
        <TextInput
          placeholder={"Enter your name"}
          onChange={setName}
          label="Enter your name"
        />
        <TextInput
          placeholder={"Enter your Email"}
          onChange={setEmail}
          label="Enter your Email"
        />
        <TextInput
          placeholder={"Enter your Password"}
          onChange={setPassword}
          label="Enter your Password"
        />
        <TextInput
          placeholder={"Enter your Number"}
          onChange={setPhone}
          label="Enter your Number"
        />
        <Button
          children={"click"}
          onClick={handleSumit}
          loading={loading}
        ></Button>
        <p onClick={() => router.push("/signin")} className="cursor-pointer">
          Click to Signin
        </p>
      </div>
    </div>
  );
};

export default Signup;
