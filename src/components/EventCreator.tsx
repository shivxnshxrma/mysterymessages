import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateEventSchema } from "@/schemas/createEventSchema";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

type EventCreatorProps = {
  handleCreateEvent: (data: { name: string }) => Promise<void>;
  isCreatingEvent: boolean;
};

export function EventCreator({
  handleCreateEvent,
  isCreatingEvent,
}: EventCreatorProps) {
  const form = useForm({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: { name: "" },
  });

  return (
    <SpotlightCard className="p-6">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Create New Event
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateEvent)}
          className="flex items-center gap-4"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-grow">
                <Input
                  placeholder="Your new event name..."
                  {...field}
                  className="bg-gray-800/50 border-gray-600 text-gray-200"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isCreatingEvent}
            className="bg-gray-200 hover:bg-gray-400 text-black cursor-pointer"
          >
            {isCreatingEvent ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </form>
      </Form>
    </SpotlightCard>
  );
}
