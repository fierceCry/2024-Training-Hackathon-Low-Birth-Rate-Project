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

    // TODO: save user message

    const response = await chatClient.createChatResponse({
      isRespectful,
      chatHistory: previousChatsString,
      userMessage: message,
    });

    logger.info("response", response);

    // TODO: Save chat response
    return response;
  }

  async findChatUserList(id) {
    return this.chatRepository.findChatUserList({ userId: id });
  }
}
