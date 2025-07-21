"use client";

import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import SpotlightCard from "@/components/SpotlightCard";
import Aurora from "@/components/Aurora";

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  // const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages as boolean);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(
        axiosError.response?.data.message ?? "Failed to fetch message settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        const raw = response.data.message;

        if (Array.isArray(raw)) {
          setMessages(raw as Message[]);
        } else {
          toast("Unexpected response from server");
        }

        if (refresh) {
          toast("Refreshed Messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast(axiosError.response?.data.message ?? "Failed to fetch messages");
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(
        axiosError.response?.data.message ?? "Failed to update message settings"
      );
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast("Profile URL has been copied to clipboard.");
  };

  return (
    <div className="min-h-screen bg-black text-white antialiased ">
      <Navbar />

      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.5}
        speed={0.5}
      />
      {/* Note: The <Orb /> background would be in your layout file for consistency */}

      {/* Main Content */}

      <div className="container mx-auto max-w-6xl p-4 md:p-6 py-24">
        <div className="text-center md:text-left mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">User Dashboard</h1>
          <p className="mt-2 text-lg text-gray-400">Welcome back, {username}</p>
        </div>

        {/* Shareable Link & Message Status Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Using the SpotlightCard for the unique link */}
          <SpotlightCard className="p-6">
            <h2 className="text-lg font-semibold mb-2 text-white">
              Your Unique Link
            </h2>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-300 break-all flex-grow">
                {profileUrl}
              </p>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="border-gray-600 text-black hover:bg-gray-800 hover:text-white cursor-pointer"
              >
                Copy
              </Button>
            </div>
          </SpotlightCard>

          {/* Using the SpotlightCard for the accept messages switch */}
          <SpotlightCard className="p-6 flex items-center justify-center md:justify-start">
            <div className="flex items-center space-x-4">
              <Switch
                {...register("acceptMessages")}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                id="accept-messages"
                className="data-[state=checked]:bg-gray-600 data-[state=unchecked]:bg-gray-500"
              />
              <label
                htmlFor="accept-messages"
                className="text-lg text-white font-medium"
              >
                Accepting Messages: {acceptMessages ? "Yes" : "No"}
              </label>
            </div>
          </SpotlightCard>
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Messages Display Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Your Messages</h2>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-700 hover:bg-gray-800 hover:text-white cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.length > 0 ? (
              messages.map((message) => (
                <MessageCard
                  key={message._id as string}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400">
                  No messages to display. Share your link to get some!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
