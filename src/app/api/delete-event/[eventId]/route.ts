import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import EventModel from "@/model/Event";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  // FIX: Correctly type the second argument as a context object
  context: { params: { eventId: string } }
) {
  const eventId = context.params.eventId; // Access eventId from context.params
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    // Step 1: Pull all messages associated with the event
    await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { eventId: eventId } } }
    );

    // Step 2: Delete the event itself
    const deleteResult = await EventModel.deleteOne({
      _id: eventId,
      owner: user._id,
    });

    if (deleteResult.deletedCount === 0) {
      return Response.json(
        { message: "Event not found or you are not the owner", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      {
        message: "Event and associated messages deleted successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return Response.json(
      { message: "Error deleting event", success: false },
      { status: 500 }
    );
  }
}
