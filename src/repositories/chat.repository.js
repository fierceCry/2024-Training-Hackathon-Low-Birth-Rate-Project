import { CHAT_MAX_COUNT } from "../constants/chat.constants.js";

export class ChatRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createChat({ id, message, messageType, role, chatName }) {
    return this.prisma.chat.create({
      data: {
        userId: +id,
        message,
        role,
        messageType,
        chatName: chatName,
      },
    });
  }

  async findChatUserList({ userId, count = CHAT_MAX_COUNT }) {
    return this.prisma.chat.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: count,
    });
  }

  async findChatList({ userId }) {
    return this.prisma.chat.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  }

  async findChatName({ userId }) {
    return this.prisma.chat.findFirst({
      where: {
        userId,
        chatName: {
          not: null,
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {chatName: true}
    });
  }
}
