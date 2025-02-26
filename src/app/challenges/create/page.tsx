"use client";

import { useState } from "react";

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

const formSchema = z.object({
  details: z.object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    description: z.string().min(10, {
      message: "description must be at least 10 characters.",
    }),
    bannerUrl: z.string().url({
      message: "Please enter a valid URL.",
    }),
  }),
  status: z.enum(["archived", "draft", "expired", "live", "scheduled"]),
});

export default function CreateChallengePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { activeTeam } = useTeam();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      details: {
        title: "",
        description: "",
        bannerUrl: "",
      },
      status: "draft",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (activeTeam?.id) {
        setIsSubmitting(true);
        const payload = {
          communityId: activeTeam.id || "",
          status: values.status,
          enabledForSingleView: false,
          tags: [],
          campaigns: [],
          startsAt: null,
          expiresAt: null,
          isSkippable: false,
          additionalCommunityIds: [],
          details: {
            title: values.details.title,
            description: values.details.description,
            bannerUrl: values.details.bannerUrl,
            subtitle: "",
            summary: "",
            richContent: "",
            logoUrl: "",
            iconUrl: "",
          },
        };
        console.log("activeTeam?.id", activeTeam.id);
        const response: any = await challengesApi.createChallenge(payload);
      }

      router.push("/challenges");
    } catch (error) {
      console.error("Error creating challenge:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container ml-1 pb-10 pl-2">
      <div className="mb-2 flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="size-4" />
          <span>Back</span>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Challenge</CardTitle>
        </CardHeader>
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
                    <FormDescription>The title of your challenge.</FormDescription>
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
                      <Textarea placeholder="Enter challenge description" {...field} />
                    </FormControl>
                    <FormDescription>A brief description of the challenge.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="details.bannerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter banner URL" {...field} />
                    </FormControl>
                    <FormDescription>URL for the challenge banner image.</FormDescription>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormDescription>The current status of the challenge.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Challenge"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
