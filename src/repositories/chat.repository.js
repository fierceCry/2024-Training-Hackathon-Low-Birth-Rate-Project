export class ChatRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  
  async createChat({ message }) {
    console.log(message)
    return this.prisma.chat.create({
      data: {
        message
      },
    });
  }
}
