import { Schema, model } from "mongoose";

const chatSchema = new Schema({
  messages: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
 }
);

const Chat = model("Chat", chatSchema);

export default Chat;