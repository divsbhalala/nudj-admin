import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Loader2, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { challengesApi } from "@/services/challenge.service";

import { Challenge } from "../../../components/table";

interface Allocation {
  id: number;
  allocationType: string;
  supply: number;
  amountToDistribute: number;
  distributed: number;
  isShop: boolean;
  isLive: boolean;
  rewardId: number;
  name: string;
  image: string;
}

interface Reward {
  id: number | string;
  name: string;
  image: string;
  supply: number;
  distributed: number;
  amountToDistribute: number;
  details?: {
    title: string;
    bannerUrl: string;
  };
  allocations?: Allocation[];
}

export default function AllocationsTab({ challenge }: { challenge: Challenge | null }) {
  const [bonusXP, setBonusXP] = useState("34");
  const [spendablePoints, setSpendablePoints] = useState("32");
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [selectedRewards, setSelectedRewards] = useState<Allocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleAddReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (reward && !selectedRewards.find((r) => r.id === reward.id)) {
      setSelectedRewards([...selectedRewards, reward]);
    }
  };

  const handleRemoveReward = (rewardId: number) => {
    setSelectedRewards(selectedRewards.filter((r) => r.id !== rewardId));
  };

  const handleAmountChange = (rewardId: number, amount: number) => {
    setSelectedRewards(
      selectedRewards.map((reward) => (reward.id === rewardId ? { ...reward, amountToDistribute: amount } : reward)),
    );
  };

  const transformReward = (apiReward: Reward) => {
    // Transform each allocation into a separate reward entry
    return apiReward.allocations?.map((allocation) => ({
      id: allocation.id,
      name: apiReward.details?.title || "",
      image: apiReward.details?.bannerUrl || "/Person.png",
      supply: allocation.supply,
      distributed: allocation.distributed,
      amountToDistribute: allocation.amountToDistribute,
      allocationType: allocation.allocationType,
      rewardId: apiReward.id,
    }));
  };

  const fetchRewards = async () => {
    try {
      setIsLoading(true);
      const response = await challengesApi.getRewards(challenge?.communityId || "", 100, 0);
      const transformedRewards = response.edges?.map(transformReward) || [];

      const distributionRewards: any = await challengesApi.fetchDistributionRewards(challenge?.id || "");

      const selectedRewards =
        distributionRewards?.rewardsConfig?.allocations?.map((item: any) => {
          const reward = transformedRewards?.flat()?.find((r: any) => r.rewardId === item?.rewardId);
          return {
            ...item,
            name: reward?.name || "",
            image: reward?.image || "/Person.png",
          };
        }) || [];
      setSelectedRewards(selectedRewards || []);
      setRewards(transformedRewards?.flat() || []);
      setSpendablePoints(distributionRewards?.pointsToDistribute || 0);
      setBonusXP(distributionRewards?.bonusXpToDistribute || 0);
    } catch (err) {
      console.error("Failed to fetch communities:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleSave = async () => {
    try {
      if (!challenge?.id) return;
      setIsSaving(true);
      const formattedData = {
        rewardsConfig: {
          mechanism: "select",
          amountToDistribute: selectedRewards.reduce((sum, reward) => sum + (reward.amountToDistribute || 0), 0),
          allocations: selectedRewards.map((reward) => ({
            allocationType: reward.allocationType,
            amountToDistribute: reward.amountToDistribute,
            rewardId: reward.rewardId, // This comes from the transformed reward
            id: reward.id.toString(), // Get the allocation ID from the compound ID
          })),
        },
        pointsToDistribute: parseInt(spendablePoints) || 0,
        bonusXpToDistribute: parseInt(bonusXP) || 0,
      };

      const response: any = await challengesApi.assignDistribution(challenge.id, formattedData);
      if (response?.challengeId) {
        toast({
          title: "Success",
          description: "Distribution assigned successfully",
          variant: "default",
        });
        router.push("/challenges");
      } else {
        toast({
          title: "Error",
          description: "Failed to assign distribution",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to assign distribution:", error);
      toast({
        title: "Error",
        description: "Failed to assign distribution",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold">Set what you'd like to give out on challenge completion</h2>

      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-medium">Rewards</h3>
          <Select onValueChange={handleAddReward}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Search to add a reward" />
            </SelectTrigger>
            <SelectContent>
              {rewards
                .filter((reward) => !selectedRewards.find((r) => r.id === reward.id))
                .map((reward) => (
                  <SelectItem key={reward.id} value={reward.id.toString()} className="flex items-center gap-2 p-2">
                    <div className="flex w-full items-center gap-2">
                      <div className="size-8 overflow-hidden rounded-full bg-gray-100">
                        <img src={reward.image} alt={reward.name} width={32} height={32} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{reward.name}</div>
                        <div className="text-sm text-gray-500">Supply: {reward.supply}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {selectedRewards.length > 0 && (
            <Card className="mt-4 p-4">
              <div className="mb-2 grid grid-cols-[3fr,1fr,1fr,auto] gap-4 text-sm text-gray-500">
                <div>Reward</div>
                <div>Distributed</div>
                <div>Amount to Distribute</div>
                <div>Action</div>
              </div>

              {selectedRewards.map((reward) => (
                <div key={reward.id} className="grid grid-cols-[3fr,1fr,1fr,auto] items-center gap-4 border-t py-2">
                  <div className="flex items-center gap-2">
                    <div className="size-8 overflow-hidden rounded-full bg-gray-100">
                      <img src={reward.image} alt={reward.name} width={32} height={32} />
                    </div>
                    <div>
                      <div className="font-medium">{reward.name}</div>
                      <div className="text-sm text-gray-500">Supply: {reward.supply}</div>
                    </div>
                  </div>
                  <div className="text-center">{reward.distributed}</div>
                  <div>
                    <Input
                      type="number"
                      value={reward.amountToDistribute}
                      onChange={(e) => handleAmountChange(reward.id, parseInt(e.target.value) || 0)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveReward(reward.id)}>
                      <TrashIcon className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Amount of bonus XP to give out</label>
          <Input type="number" value={bonusXP} onChange={(e) => setBonusXP(e.target.value)} />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="block text-sm font-medium">How many spendable points do you want to give out?</label>
            <Button variant="ghost" size="icon" className="rounded-full">
              ?
            </Button>
          </div>
          <Input type="number" value={spendablePoints} onChange={(e) => setSpendablePoints(e.target.value)} />
        </div>
      </div>

      <div className="mt-6 flex justify-end" onClick={handleSave}>
        <Button disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</Button>
      </div>
    </div>
  );
}
