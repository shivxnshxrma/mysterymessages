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
import DarkVeil from "@/components/DarkVeil";

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
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0">
        <DarkVeil />
      </div>
      <div className="relative z-10 w-full max-w-lg p-8 space-y-8 bg-gray-900/60 backdrop-blur-lg border border-gray-700 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Public Profile Link
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Send Anonymous Message to @ {username}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none bg-gray-800 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
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
                className="w-50 bg-gray-100 text-black hover:bg-gray-200 focus-visible:ring-offset-gray-900 cursor-pointer "
              >
                {isSuggestLoading ? "Loading..." : "Suggest Messages"}
              </Button>

              {isLoading ? (
                <Button
                  className="w-50 bg-gray-100 text-black hover:bg-gray-200 focus-visible:ring-offset-gray-900 cursor-pointer"
                  disabled
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  className="w-50 bg-gray-100 text-black hover:bg-gray-200 focus-visible:ring-offset-gray-900 cursor-pointer"
                  type="submit"
                  disabled={!messageContent}
                >
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>

        {/* Display Suggested Messages */}
        {suggestedMessages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-300 text-center mb-4">
              Suggested Messages
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedMessages.map((msg, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="max-w-xs h-auto whitespace-normal bg-gray-800 text-gray-200 hover:bg-gray-700 focus-visible:ring-offset-gray-400 cursor-pointer"
                  onClick={() => handleMessageClick(msg)}
                >
                  {msg}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* <Separator className="my-6" /> */}

        <div className="text-center">
          <div className="mb-4 text-gray-300">Get Your Message Board</div>
          <Link href={"/sign-up"}>
            <Button className="bg-gray-100 text-black hover:bg-gray-200 focus-visible:ring-offset-gray-900 cursor-pointer">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
