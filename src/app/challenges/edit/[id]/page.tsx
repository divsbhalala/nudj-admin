"use client";

import React from "react";

import ChallengeEditForm from "./components/challengeEditForm";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4">
        <div className="flex-col items-center justify-between space-y-2 md:flex md:flex-row">
          <h2 className="text-3xl font-bold tracking-tight">Challenges</h2>
        </div>
        <ChallengeEditForm id={id} />
      </div>
    </div>
  );
}
