import { CHAT_MAX_COUNT } from "../constants/chat.constants.js";

export class ChatRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createChat({ id, message, messageType }) {
    return this.prisma.chat.create({
      data: {
        userId: id,
        message,
        messageType
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
}
