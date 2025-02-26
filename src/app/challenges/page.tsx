"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { ChallengesTable } from "./components/table";

export default function Page() {
  const router = useRouter();
  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4">
        <div className="flex-col items-center justify-between space-y-2 md:flex md:flex-row">
          <h2 className="text-3xl font-bold tracking-tight">Challenges</h2>
          <div className="flex-col items-center space-y-2 md:flex md:flex-row md:space-x-2 md:space-y-0">
            <Button className="w-full" onClick={() => router.push("/challenges/create")}>
              Create Challenge
            </Button>
          </div>
        </div>
        <ChallengesTable />
      </div>
    </div>
  );
}
