export class ChatRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createChat({ message }) {
    console.log(message);
    return this.prisma.chat.create({
      data: {
        userId: 1,
        message,
      },
    });
  }

  async findChatUserList(id) {
    return this.prisma.chat.findMany({
        where: { userId: id }
    });
  }
}
