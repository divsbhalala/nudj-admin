import * as React from "react";
import { useEffect, useState } from "react";

import { TeamSwitcher } from "@/app/dashboard/components/sidebar/team-switcher";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";
import { communityApi } from "@/services/community.service";

import SidebarNavigation from "./sidebar-navigation";

interface CommunityStyle {
  lightMode: {
    logo: string;
    banner: string;
  };
  darkMode: {
    logo: string;
    banner: string;
  };
  general: any;
}

interface Community {
  id: string;
  organisationId: string;
  name: string;
  slug: string;
  description: string;
  communityType: string;
  access: string;
  status: string;
  style: CommunityStyle;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AppSidebarProps {
  user: any;
  sidebarItems: any[];
}

export function AppSidebar({ ...props }: AppSidebarProps) {
  const [teams, setTeams] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setIsLoading(true);
        const response = await communityApi.getCommunities(1, 100);
        setTeams(response.edges || []);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to fetch communities:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  // Error state
  if (error) {
    console.error("Failed to fetch communities:", error);
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={teams.map((team: { name: any; style: { lightMode: { banner: any } }; slug: any; id: any }) => ({
            name: team.name,
            logo: team.style.lightMode.banner,
            plan: team.slug,
            id: team.id,
          }))}
          isLoading={isLoading}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation sidebarItems={sidebarItems} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
