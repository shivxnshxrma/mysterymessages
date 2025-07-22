import dbConnect from "@/lib/dbConnect";
import EventModel, { Event } from "@/model/Event"; // Make sure to export/import the Event interface
import { User } from "@/model/User";

// Define a new interface for the populated event
interface PopulatedEvent extends Omit<Event, "owner"> {
  owner: User;
}

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return Response.json(
      { success: false, message: "Event ID is required" },
      { status: 400 }
    );
  }

  try {
    // Cast the result of the query to our new, more accurate type
    const event = (await EventModel.findById(eventId).populate(
      "owner",
      "username"
    )) as PopulatedEvent | null;

    if (!event || !event.owner) {
      return Response.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    // Now, TypeScript understands the shape of event.owner
    return Response.json(
      {
        success: true,
        event: {
          name: event.name,
          username: event.owner.username,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching event details:", error);
    return Response.json(
      { success: false, message: "Error fetching event details" },
      { status: 500 }
    );
  }
}
