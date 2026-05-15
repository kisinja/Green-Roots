"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const BackBtn = () => {
  const nav = useRouter();
  const back = () => {
    nav.back();
  };
  return (
    <div
      onClick={back}
      className="inline-flex items-center gap-2 text-sm text-black/60 transition hover:text-[var(--green-700)] cursor-pointer px-4 py-2 sm:px-6 lg:px-8"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </div>
  );
};

export default BackBtn;
