import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTeam } from "@/providers/team-provider";
import { challengesApi } from "@/services/challenge.service";

import { Challenge } from "../../../components/table";

import ActionsTab from "./actionsTab";
import AllocationsTab from "./allocationsTab";
import SettingForm from "./settingForm";

export default function ChallengeEditForm({ id }: { id: string }) {
  const router = useRouter();
  const { activeTeam } = useTeam();
  const [error, setError] = useState<Error | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        if (activeTeam?.id) {
          const response: any = await challengesApi.getChallenge(id);
          setChallenge(response || {});
        }
      } catch (err) {
        setError(err as Error);
        console.error("Failed to fetch communities:", err);
      }
    };
    fetchChallenges();
  }, [activeTeam?.id]);

  return (
    <div className="mx-auto mt-6 max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="size-4" />
          <span>{challenge?.details.title}</span>
        </Button>
      </div>

      <Card>
        <Tabs defaultValue="settings" className="w-full">
          <div className="border-b bg-gray-50">
            <TabsList className="h-auto w-full rounded-lg bg-gray-200 p-1">
              <div className="flex w-full gap-1">
                <TabsTrigger
                  value="settings"
                  className="flex-1 rounded-md border-none bg-transparent py-2 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  Settings
                </TabsTrigger>
                <TabsTrigger
                  value="actions"
                  className="flex-1 rounded-md border-none bg-transparent py-2 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  Actions
                </TabsTrigger>
                <TabsTrigger
                  value="allocations"
                  className="flex-1 rounded-md border-none bg-transparent py-2 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  Allocations
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          <TabsContent value="settings">
            {/* <SettingTab challenge={challenge} /> */}
            <SettingForm challenge={challenge} />
          </TabsContent>
          <TabsContent value="actions">
            <ActionsTab challenge={challenge} />
          </TabsContent>
          <TabsContent value="allocations">
            <AllocationsTab challenge={challenge} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
