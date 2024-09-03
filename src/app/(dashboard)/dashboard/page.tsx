/* eslint-disable import/no-anonymous-default-export */

import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { getBalance } from "../transfer/page";

/* eslint-disable react/display-name */
export default async function () {
  const session = await getServerSession(authOptions);
  const balance = await getBalance();
  return (
    <div>
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Hello, {session.user.name}
      </div>
      <div>
        <p className="text-gray-500">Portfolio Value</p>
        <h1 className="text-4xl">
          <span className="text-gray-500">$ </span>
          {balance.amount}.00
        </h1>
      </div>
      <div></div>
    </div>
  );
}
