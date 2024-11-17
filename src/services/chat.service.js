import { chatClient } from "../utils/chatClient.js";
import getLogger from "../common/logger.js";
import { messageType, checkMessageType } from "../types/messageType.js";

const logger = getLogger("chatService");
export class ChatService {
  constructor(chatRepository) {
    this.chatRepository = chatRepository;
  }

  async createChat({ id, message, isRespectful = false }) {
    logger.info("message", message);

    const previousChats = await this.chatRepository.findChatUserList({
      userId: id,
    });
    logger.info("previousChats", previousChats);

    previousChats.sort((a, b) => a.createdAt - b.createdAt);

    const [relatedToSuicide, askingGovernmentHelp, response] = await Promise.all([
      chatClient.checkMessageType({ message, messageType: messageType.relatedToSuicide }),
      chatClient.checkMessageType({
        message,
        messageType: messageType.askingGovernmentHelp,
      }),
      chatClient.createChatResponse({
        isRespectful,
        chatHistory: previousChats,
        userMessage: message,
      }),
    ]);
    console.log({ relatedToSuicide, askingGovernmentHelp, response });

    const _messageType = checkMessageType({ relatedToSuicide, askingGovernmentHelp });

    await this.chatRepository
      .createChat({
        id,
        message,
        role: "user",
        messageType: _messageType,
      })
      .then(() =>
        this.chatRepository.createChat({
          id,
          message: response,
          role: "assistant",
          messageType: _messageType,
        }),
      );
    return { messageType: _messageType, response };
  }

  async findChatUserList(id) {
    return this.chatRepository.findChatUserList({ userId: id });
  }
}
