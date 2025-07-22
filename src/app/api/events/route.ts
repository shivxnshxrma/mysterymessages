// src/app/api/events/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import EventModel from "@/model/Event";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const { name } = await request.json();

  try {
    const existingEvent = await EventModel.findOne({ name, owner: user._id });

    if (existingEvent) {
      return Response.json(
        {
          success: false,
          message:
            "An event with this name already exists. Please use a different name.",
        },
        { status: 400 } // 400 Bad Request is appropriate here
      );
    }
    const newEvent = new EventModel({
      name,
      owner: user._id,
    });

    await newEvent.save();

    return Response.json(
      {
        success: true,
        message: "Event created successfully",
        event: newEvent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return Response.json(
      { success: false, message: "Error creating event" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const events = await EventModel.find({ owner: userId }).sort({
      createdAt: -1,
    });

    if (!events) {
      return Response.json(
        { success: false, message: "No events found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        events,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return Response.json(
      { success: false, message: "Error fetching events" },
      { status: 500 }
    );
  }
}
