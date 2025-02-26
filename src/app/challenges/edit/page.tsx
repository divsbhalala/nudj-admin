"use client";

import React from "react";

import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4">
        <div className="flex-col items-center justify-between space-y-2 md:flex md:flex-row">
          <h2 className="text-3xl font-bold tracking-tight">Edit Challenges</h2>
          <div className="flex-col items-center space-y-2 md:flex md:flex-row md:space-x-2 md:space-y-0">
            <Button className="w-full">Create Challenge</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
