import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;

  if (!session || !_user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(_user._id);
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "9", 10);

  if (!eventId) {
    return Response.json(
      { success: false, message: "Event ID is required" },
      { status: 400 }
    );
  }

  try {
    const skip = (page - 1) * limit;

    // Aggregation to get total message count for the event
    const totalMessagesAggregation = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $match: { "messages.eventId": new mongoose.Types.ObjectId(eventId) } },
      { $count: "total" },
    ]);

    const totalMessages =
      totalMessagesAggregation.length > 0
        ? totalMessagesAggregation[0].total
        : 0;

    // Aggregation to get paginated messages
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $match: { "messages.eventId": new mongoose.Types.ObjectId(eventId) } },
      { $sort: { "messages.createdAt": -1 } },
      { $skip: skip },
      { $limit: limit },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    const messages = user.length > 0 ? user[0].messages : [];
    const hasNextPage = page * limit < totalMessages;

    return Response.json(
      {
        messages,
        success: true,
        hasNextPage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
