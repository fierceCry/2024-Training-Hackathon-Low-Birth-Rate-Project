import { chatClient } from "../utils/chatClient.js";
import getLogger from "../common/logger.js";
import { messageType, checkMessageType } from "../types/messageType.js";

const logger = getLogger("chatService");
export class ChatService {
  constructor(chatRepository, userRepository) {
    this.chatRepository = chatRepository;
    this.userRepository = userRepository
  }

  async createChat({ id, message, isRespectful = null, chatName = null }) {
    logger.info("message", message);

    const user = await this.userRepository.findUserById({ id });

    const mode = isRespectful !== null ? isRespectful : user.isRespectful;

    if (isRespectful !== null && isRespectful !== user.isRespectful) {
      await this.userRepository.updateUserMode({
        id,
        isRespectful,
      });
    }
    
    let userChatName = chatName;
    if (!chatName) {
      const userChat = await this.chatRepository.findChatName({ userId: id });
      userChatName = userChat;
    }
  
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
        isRespectful: mode,
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
        chatName: chatName || userChatName.chatName
      })
      .then(() =>
        this.chatRepository.createChat({
          id,
          message: response,
          role: "assistant",
          messageType: _messageType,
        }),
      );
    console.log('result',_messageType, response)
    
    return { messageType: _messageType, response };
  }

  async findChatUserList({userId}) {
    return this.chatRepository.findChatList({ userId });
  }
}
