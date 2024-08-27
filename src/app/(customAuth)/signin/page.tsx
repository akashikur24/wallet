"use client";

import { Button } from "@/app/components/ui/button";
import { TextInput } from "@/app/components/ui/TextInput";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Signin = () => {
  const [number, setNumber] = useState<string>();
  const [password, setPassword] = useState<String>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading((prev) => !prev);
    const result = await signIn("credentials", {
      redirect: false,
      phone: Number(number),
      password,
    });
    if (result?.ok) {
      setLoading((prev) => !prev);
      router.push("/dashboard");
    } else {
      setLoading((prev) => !prev);
      alert("Error while fetching data");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-1/3 flex flex-col gap-y-4">
        <TextInput
          placeholder={"Enter your number"}
          onChange={setNumber}
          label="Enter your number"
        />
        <TextInput
          placeholder={"Enter your password"}
          onChange={setPassword}
          label="Enter your password"
        />

        <Button onClick={handleSubmit} loading={loading}>
          {"click"}
        </Button>
        <p onClick={() => router.push("/signup")} className="cursor-pointer">
          Click to signup
        </p>
      </div>
    </div>
  );
};

export default Signin;
