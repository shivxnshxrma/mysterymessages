import { Message } from "@/model/User";
import { type Event as EventModel } from "@/model/Event";
export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
  events?: Array<EventModel>;
  hasNextPage?: boolean;
}
