"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";
import { toast } from "sonner";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar).map((msg) => msg.trim());
};

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast(response.data.message);
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message ?? "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const res = await axios.post("/api/suggest-messages");
      const raw = res.data?.output;
      const parsed = parseStringMessages(raw || "");
      setSuggestedMessages(parsed);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      toast("Failed to fetch suggested messages");
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              type="button"
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
            >
              {isSuggestLoading ? "Loading..." : "Suggest Messages"}
            </Button>

            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={!messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* Display Suggested Messages */}
      {suggestedMessages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-center">
            Suggested Messages
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestedMessages.map((msg, idx) => (
              <Button
                key={idx}
                variant="outline"
                className=" truncate text-sm overflow-hidden text-ellipsis whitespace-nowrap"
                title={msg} // Tooltip on hover
                onClick={() => handleMessageClick(msg)}
              >
                {msg}
              </Button>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-6" />

      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
