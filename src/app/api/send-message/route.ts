import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { rateLimiter } from "@/lib/rate-limiter";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: Request) {
  await dbConnect();
  // Rate Limiting Logic
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await rateLimiter.limit(ip);

  if (!success) {
    return new NextResponse("You are being rate limited.", { status: 429 });
  }

  const { username, content, eventId } = await request.json();
  try {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    // is user accepting the messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is currently not accepting the messages",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = { content, createdAt: new Date(), eventId };
    await UserModel.updateOne(
      { _id: user._id },
      { $push: { messages: newMessage } }
    );
    // user.messages.push(newMessage as Message);
    // await user.save();
    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error adding messages", error);

    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
