import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(rquest: Request) {
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
  try {
    const exists = await UserModel.findById(userId);

    const userdata = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!userdata || userdata.length == 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 401,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: userdata[0].messages,
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
