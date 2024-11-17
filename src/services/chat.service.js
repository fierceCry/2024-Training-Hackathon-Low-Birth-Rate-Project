import { chatClient } from "../utils/chatClient.js";
import getLogger from "../common/logger.js";

const logger = getLogger("chatService");
export class ChatService {
  constructor(chatRepository) {
    this.chatRepository = chatRepository;
  }

  async createChat({ id, message, isRespectful }) {
    logger.info("message", message);

    const previousChats = await this.chatRepository.findChatUserList({
      userId: id,
    });
    logger.info("previousChats", previousChats);

    const previousChatsString = previousChats
      .map((chat) => `${chat.sender}: ${chat.message}`)
      .join("\n");
    logger.info("previousChatsString", previousChatsString);

    const [messageType, response] = await Promise.all([
      chatClient.checkMessageType(message),
      chatClient.createChatResponse({
        isRespectful,
        chatHistory: previousChatsString,
        userMessage: message,
      }),
    ]);
    logger.info("messageType", messageType);
    logger.info("response", response);

    await Promise.all([
      this.chatRepository.createChat({
        id,
        message,
        sender: "user",
        messageType,
      }),
      this.chatRepository.createChat({
        id,
        message: response,
        sender: "assistant",
        messageType,
      }),
    ]);
    return { messageType, response };
  }

  async findChatUserList(id) {
    return this.chatRepository.findChatUserList({ userId: id });
  }
}
