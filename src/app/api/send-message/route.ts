import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { rateLimiter } from "@/lib/rate-limiter";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose"; // Import mongoose

export async function POST(request: Request) {
  await dbConnect();

  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  
  // 1. Wrap Rate Limiter in try-catch in case Redis is down/unconfigured
  try {
    const { success } = await rateLimiter.limit(ip);
    if (!success) {
      return Response.json(
        { success: false, message: "You are being rate limited." },
        { status: 429 }
      );
    }
  } catch (error) {
    console.error("Rate Limiter Error:", error);
    // Optional: Decide if you want to allow traffic if limiter fails
  }

  const { username, content, eventId } = await request.json();

  try {
    const user = await UserModel.findOne({ username: username });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Is user accepting the messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        { success: false, message: "User is currently not accepting messages" },
        { status: 403 }
      );
    }

    // 2. Safely create the new message object
    // If your Schema expects an ObjectId for eventId, we must convert it.
    // If your Schema expects a String, you can remove the mongoose.Types.ObjectId conversion.
    const newMessage = { 
        content, 
        createdAt: new Date(), 
        // Only do this if your Schema defines eventId as ObjectId:
        eventId: new mongoose.Types.ObjectId(eventId) 
    };

    // 3. Use push within updateOne
    await UserModel.updateOne(
      { _id: user._id },
      { $push: { messages: newMessage } }
    );

    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );

  } catch (error) {
    // 4. LOG THE ACTUAL ERROR to your terminal
    console.error("Error adding message:", error);

    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    ); 
  }
}