"use client";

import { ReactNode } from "react";
import { RiseLoader } from "react-spinners";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  loading: boolean;
}

export const Button = ({ onClick, children, loading }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
    >
      {loading ? (
        <RiseLoader color="rgba(255, 252, 255, 1)" size={5} />
      ) : (
        children
      )}
    </button>
  );
};
