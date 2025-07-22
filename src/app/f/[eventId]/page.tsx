"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schemas/messageSchema";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import DarkVeil from "@/components/DarkVeil";
import FuzzyText from "@/components/FuzzyText"; // Import the FuzzyText component
import Link from "next/link";

export default function EventFeedbackPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params.eventId;

  const [eventName, setEventName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [eventNotFound, setEventNotFound] = useState(false); // New state

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/api/get-event-details?eventId=${eventId}`
        );
        setEventName(response.data.event.name);
        setUsername(response.data.event.username);
        setEventNotFound(false);
      } catch (error) {
        toast.error("Event not found or has been deleted.");
        setEventNotFound(true); // Set state to true on error
      } finally {
        setIsLoading(false);
      }
    };
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    // ... (This function remains the same)
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  // If event not found, render the FuzzyText 404 page
  if (eventNotFound) {
    return (
      <div className="relative h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0">
          <DarkVeil />
        </div>
        <div className="relative z-10 font-mono text-8xl md:text-9xl">
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.5}
            enableHover={true}
          >
            404
          </FuzzyText>
        </div>
        <p className="relative z-10 text-gray-400 mt-4">
          Event not found or has been deleted.
        </p>
        <Link href="/" className="relative z-10 mt-6">
          <Button className="bg-white text-black hover:bg-gray-200 cursor-pointer">
            Go to Homepage
          </Button>
        </Link>
      </div>
    );
  }

  // Default return for a valid event
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white">
      <div className="absolute inset-0 z-0">
        <DarkVeil />
      </div>
      <div className="relative z-10 w-full max-w-2xl p-8 space-y-8 bg-gray-900/60 backdrop-blur-lg border border-gray-700 rounded-xl shadow-2xl">
        <div className="text-center">
          <p className="mb-2 text-gray-400">Sending message to @{username}</p>
          <h1 className="text-4xl font-bold mb-6">For Event: "{eventName}"</h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Write your anonymous message below
                  </FormLabel>
                  <Textarea
                    placeholder="Your feedback is anonymous."
                    {...field}
                    className="min-h-[150px] bg-gray-800/50 border-gray-600 text-gray-200"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              type="submit"
              disabled={isSendingMessage}
            >
              {isSendingMessage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
