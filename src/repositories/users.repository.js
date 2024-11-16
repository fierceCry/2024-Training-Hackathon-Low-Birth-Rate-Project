export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findUserId(id) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
