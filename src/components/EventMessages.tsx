import React from "react";
import { Message } from "@/model/User";
import { Event } from "@/model/Event";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { MessageCard } from "./MessageCard";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type EventMessagesProps = {
  events: Event[];
  messages: Message[];
  selectedEventId: string | null;
  setSelectedEventId: (id: string) => void;
  isLoading: boolean;
  isDeleting: boolean;
  fetchMessages: (refresh: boolean, eventId: string) => void;
  copyToClipboard: (link: string) => void;
  handleDeleteEvent: (eventId: string) => void;
  handleDeleteMessage: (messageId: string) => void;
  baseUrl: string;
};

export function EventMessages({
  events,
  messages,
  selectedEventId,
  setSelectedEventId,
  isLoading,
  isDeleting,
  fetchMessages,
  copyToClipboard,
  handleDeleteEvent,
  handleDeleteMessage,
  baseUrl,
}: EventMessagesProps) {
  const selectedEvent = events.find((e) => e._id === selectedEventId);

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Your Events</h2>
        {events.length > 0 && (
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Select
              value={selectedEventId || ""}
              onValueChange={setSelectedEventId}
            >
              <SelectTrigger className="w-full md:w-[280px] bg-black/30 backdrop-blur-lg border-gray-700 cursor-pointer">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent className="bg-black/30 backdrop-blur-lg border-gray-700 text-white">
                {events.map((event) => (
                  <SelectItem
                    key={event._id as string}
                    value={event._id as string}
                    className="cursor-pointer"
                  >
                    <span className="cursor-pointer">{event.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="border-gray-600 text-black hover:bg-gray-800 hover:text-white p-2 cursor-pointer"
              onClick={() => fetchMessages(true, selectedEventId!)}
              disabled={isLoading || !selectedEventId}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <RefreshCcw className="h-5 w-5" />
              )}
            </Button>
          </div>
        )}
      </div>

      {selectedEvent && (
        <div className="mb-8 p-4 bg-gray-900/40 rounded-lg border border-gray-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              Share link for selected event:
              <code className="font-mono bg-zinc-800 p-1 rounded ml-2 break-all">{`${baseUrl}/f/${selectedEventId}`}</code>
            </p>
            <div className="flex gap-2 shrink-0">
              <Button
                onClick={() =>
                  copyToClipboard(`${baseUrl}/f/${selectedEventId}`)
                }
                variant="ghost"
                size="sm"
                className="hover:bg-gray-700 hover:text-white text-white cursor-pointer"
              >
                Copy Link
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  >
                    Delete Event
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete Event: "{selectedEvent?.name}"?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      This action cannot be undone. This will permanently delete
                      this event and **all of its messages**.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 border-gray-600">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteEvent(selectedEventId!)}
                      disabled={isDeleting}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
          </div>
        ) : events.length > 0 ? (
          messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id as string}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No messages found for this event.</p>
            </div>
          )
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400">
              No events created yet. Create an event to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
