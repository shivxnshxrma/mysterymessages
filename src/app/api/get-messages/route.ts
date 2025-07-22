import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");
  if (!eventId) {
    return Response.json(
      { success: false, message: "Event ID is required" },
      { status: 400 }
    );
  }
  try {
    // const exists = await UserModel.findById(userId);

    const userdata = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
      { $match: { "messages.eventId": new mongoose.Types.ObjectId(eventId) } },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!userdata || userdata.length == 0) {
      return Response.json(
        {
          success: true,
          message: "No messages found for this event.", // A helpful status message
          messages: [], // The empty array of data
        },
        { status: 200 }
      );
    }
    return Response.json(
      {
        success: true,
        // message: userdata[0].messages,
        message: "Messages fetched successfully", // A helpful status message
        messages: userdata[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("An unexpected error occured", error);

    return Response.json(
      {
        success: false,
        message: "An unexpected error occured",
      },
      {
        status: 500,
      }
    );
  }
}
