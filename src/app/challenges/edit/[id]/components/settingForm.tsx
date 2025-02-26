"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTeam } from "@/providers/team-provider";
import { challengesApi } from "@/services/challenge.service";

import { Challenge } from "../../../components/table";

const formSchema = z.object({
  // communityId: z.string().min(1, "Community ID is required"),
  communityId: z.string().nullable(),
  details: z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(10, {
      message: "description must be at least 10 characters.",
    }),
    subtitle: z.string().nullable(),
    summary: z.string().nullable(),
    richContent: z.string().nullable(),
    logoUrl: z.string().url().nullable(),
    bannerUrl: z.string().url().nullable(),
    iconUrl: z.string().url().nullable(),
  }),
  status: z.enum(["archived", "draft", "expired", "live", "scheduled"]),
  enabledForSingleView: z.boolean().nullable(),
  tags: z.array(z.string()),
  campaigns: z.array(z.string()),
  startsAt: z.string().nullable(),
  expiresAt: z.string().nullable(),
  isSkippable: z.boolean().nullable(),
  additionalCommunityIds: z.array(z.string()),
});

export default function SettingForm({ challenge }: { challenge: Challenge | null }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState<File | string>(challenge?.details.bannerUrl || "");

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBanner(e.target.files[0]);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      communityId: challenge?.communityId ?? "",
      details: {
        title: challenge?.details.title ?? "",
        subtitle: null,
        summary: null,
        description: challenge?.details.description ?? "",
        richContent: null,
        logoUrl: null,
        bannerUrl: null,
        iconUrl: null,
      },
      status: (challenge?.status as "archived" | "draft" | "expired" | "live" | "scheduled") || "draft",
      enabledForSingleView: null,
      tags: [],
      campaigns: [],
      startsAt: null,
      expiresAt: null,
      isSkippable: null,
      additionalCommunityIds: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const payload: any = {
        communityId: challenge?.communityId ?? "",
        details: {
          title: values.details.title,
          description: values.details.description,
          bannerUrl: values.details.bannerUrl,
        },
        status: values.status,
      };
      const response: any = await challengesApi.updateChallenge(challenge?.id ?? "", payload);
      console.log("response 222", response);
      console.log("response?.data?.edges", response?.data?.edges);
      router.push("/challenges");
    } catch (error) {
      console.error("Error updating challenge:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (challenge) {
      //  Use setValue instead of reset to maintain form state
      form.setValue("details.title", challenge.details.title || "");
      form.setValue("details.description", challenge.details.description || "");
      form.setValue("details.bannerUrl", challenge.details.bannerUrl || "");
      form.setValue("status", challenge.status as "archived" | "draft" | "expired" | "live" | "scheduled");

      //  Update banner state
      //  setBanner(challenge.details?.bannerUrl || null);
    }
  }, [challenge, form]);

  return (
    <div className="mx-auto mt-6 max-w-4xl">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="details.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter challenge title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter challenge description" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="archived">Archived</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <label className="block text-sm font-medium">Banner</label>
              <Input type="file" onChange={handleBannerChange} />
              {banner && (
                <div className="mt-4 flex items-center gap-4">
                  <img
                    src={typeof banner === "string" ? banner : URL.createObjectURL(banner)}
                    alt="Banner Preview"
                    className="h-16 rounded-lg"
                  />
                  <Button variant="destructive" onClick={() => setBanner("")}>
                    Remove
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
