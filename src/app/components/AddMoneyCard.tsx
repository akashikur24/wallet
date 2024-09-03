"use client";

import { useState } from "react";
import { createOnRampTransaction } from "../lib/actions/createOnrampTransaction";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Select } from "./ui/Select";
import { TextInput } from "./ui/TextInput";
import { useRouter } from "next/navigation";

const SUPPORTED_BANKS = [
  {
    name: "HDFC Bank",
    redirectUrl: "/",
  },
  {
    name: "Axis Bank",
    redirectUrl: "/",
  },
];

export const AddMoney = () => {
  const [redirectUrl, setRedirectUrl] = useState(
    SUPPORTED_BANKS[0]?.redirectUrl
  );
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
  const [loading, setIsloading] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const route = useRouter();

  return (
    <Card title="Add Money">
      <div className="w-full">
        <TextInput
          value={value}
          label={"Amount"}
          placeholder={"Amount"}
          onChange={(val) => {
            setValue(val);
          }}
        />
        <div className="py-4 text-left">Bank</div>
        <Select
          onSelect={(value) => {
            setRedirectUrl(
              SUPPORTED_BANKS.find((x) => x.name === value)?.redirectUrl || ""
            );
            setProvider(
              SUPPORTED_BANKS.find((x) => x.name === value)?.name || ""
            );
          }}
          options={SUPPORTED_BANKS.map((x) => ({
            key: x.name,
            value: x.name,
          }))}
        />
        <div className="flex justify-center pt-4">
          <Button
            onClick={async () => {
              setIsloading((prev) => !prev);
              await createOnRampTransaction(provider, Number(value));
              route.push("./bank");
              setIsloading((prev) => !prev);
            }}
            loading={loading}
          >
            Add Money
          </Button>
        </div>
      </div>
    </Card>
  );
};
