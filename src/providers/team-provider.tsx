"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Team {
  id: string;
  name: string;
  logo: string;
  plan: string;
}

interface TeamContextType {
  activeTeam: Team | null;
  setActiveTeam: (team: Team) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);

  console.log({ activeTeam });

  return <TeamContext.Provider value={{ activeTeam, setActiveTeam }}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
}
