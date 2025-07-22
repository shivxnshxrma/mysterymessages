import mongoose, { Schema, Document } from "mongoose";

export interface Event extends Document {
  name: string;
  owner: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const EventSchema: Schema<Event> = new Schema({
  name: {
    type: String,
    required: [true, "Event name is required"],
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const EventModel =
  (mongoose.models.Event as mongoose.Model<Event>) ||
  mongoose.model<Event>("Event", EventSchema);

export default EventModel;
