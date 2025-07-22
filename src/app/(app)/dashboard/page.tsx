"use client";

import { Separator } from "@/components/ui/separator";
import { Message } from "@/model/User";
import { type Event as EventModel } from "@/model/Event";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { CreateEventSchema } from "@/schemas/createEventSchema";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Aurora from "@/components/Aurora";
import { EventCreator } from "@/components/EventCreator";
import { DashboardSettings } from "@/components/DashboardSettings";
import { EventMessages } from "@/components/EventMessages";

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<EventModel[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  // const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };
  const handleDeleteEvent = async (eventId: string) => {
    setIsDeleting(true);
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-event/${eventId}`
      );
      toast.success(response.data.message);

      // Refresh the events list to remove the deleted one from the UI
      await fetchEvents();
      // Optionally, clear messages if the deleted event was the selected one
      if (selectedEventId === eventId) {
        setSelectedEventId(null);
        setMessages([]);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Failed to delete event"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });
  const eventForm = useForm({
    resolver: zodResolver(CreateEventSchema),
    // Initialize the text input's value to an empty string
    defaultValues: {
      name: "",
    },
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
    async (refresh: boolean = false, eventId: string) => {
      setIsLoading(true);
      try {
        const pageToFetch = refresh ? 1 : page;
        const response = await axios.get<ApiResponse>(
          `/api/get-messages?eventId=${eventId}&page=${pageToFetch}`
        );
        const newMessages = response.data.messages || [];

        if (refresh || pageToFetch === 1) {
          setMessages(newMessages); // Replace messages on refresh or first page
        } else {
          setMessages((prev) => [...prev, ...newMessages]); // Append for "Load More"
        }

        setHasNextPage(response.data.hasNextPage || false);

        if (refresh) {
          toast.success("Refreshed Messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message ?? "Failed to fetch messages"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [page]
  );
  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/events");
      const fetchedEvents = response.data.events || [];
      setEvents(fetchedEvents);
      if (fetchedEvents.length > 0 && !selectedEventId) {
        setSelectedEventId(fetchedEvents[0]._id as string);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Failed to fetch events"
      );
    }
  }, [selectedEventId]);

  const handleCreateEvent = async (data: { name: string }) => {
    setIsCreatingEvent(true);
    try {
      await axios.post<ApiResponse>("/api/events", { name: data.name });
      toast.success("Event created successfully!");
      eventForm.reset({ name: "" });
      await fetchEvents();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? "Failed to create event"
      );
    } finally {
      setIsCreatingEvent(false);
    }
  };
  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    // fetchMessages();

    fetchAcceptMessages();

    fetchEvents();
  }, [
    session,
    setValue,
    toast,
    fetchAcceptMessages,
    // fetchMessages,
    fetchEvents,
  ]);

  useEffect(() => {
    if (selectedEventId) {
      setPage(1); // Reset page to 1 when a new event is selected
      fetchMessages(true, selectedEventId); // Fetch first page for the new event
    }
  }, [selectedEventId]);

  const handleLoadMore = () => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };
  useEffect(() => {
    if (page > 1 && selectedEventId) {
      fetchMessages(false, selectedEventId);
    }
  }, [page, selectedEventId, fetchMessages]);

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

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Link has been copied to clipboard.");
  };

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <Navbar />
      <Aurora colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} />

      <div className="container mx-auto max-w-6xl p-4 md:p-6 py-24 relative z-10">
        <div className="text-center md:text-left mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">User Dashboard</h1>
          <p className="mt-2 text-lg text-gray-400">Welcome back, {username}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <EventCreator
            handleCreateEvent={handleCreateEvent}
            isCreatingEvent={isCreatingEvent}
          />
          <DashboardSettings
            acceptMessages={acceptMessages}
            isSwitchLoading={isSwitchLoading}
            handleSwitchChange={handleSwitchChange}
            register={register}
          />
        </div>
        <Separator className="my-8 bg-gray-700" />
        <EventMessages
          events={events}
          messages={messages}
          selectedEventId={selectedEventId}
          setSelectedEventId={setSelectedEventId}
          isLoading={isLoading}
          isDeleting={isDeleting}
          fetchMessages={fetchMessages}
          copyToClipboard={copyToClipboard}
          handleDeleteEvent={handleDeleteEvent}
          handleDeleteMessage={handleDeleteMessage}
          baseUrl={baseUrl}
          // Pass the new props for pagination
          hasNextPage={hasNextPage}
          handleLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
}

export default UserDashboard;
