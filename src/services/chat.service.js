import { chatClient } from "../utils/chatClient.js";
import getLogger from "../common/logger.js";
import { messageType, checkMessageType } from "../types/messageType.js";

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

    const [relatedToSuicide, askingGovernmentHelp, response] = await Promise.all([
      chatClient.checkMessageType({ message, messageType: messageType.relatedToSuicide }),
      chatClient.checkMessageType({
        message,
        messageType: messageType.askingGovernmentHelp,
      }),
      chatClient.createChatResponse({
        isRespectful,
        chatHistory: previousChatsString,
        userMessage: message,
      }),
    ]);
    logger.info({ relatedToSuicide, askingGovernmentHelp, response });

    const _messageType = checkMessageType({ relatedToSuicide, askingGovernmentHelp });

    await Promise.all([
      this.chatRepository.createChat({
        id,
        message,
        sender: "user",
        messageType: _messageType,
      }),
      this.chatRepository.createChat({
        id,
        message: response,
        sender: "assistant",
        messageType: _messageType,
      }),
    ]);
    return { messageType, response };
  }

  async findChatUserList(id) {
    return this.chatRepository.findChatUserList({ userId: id });
  }
}
