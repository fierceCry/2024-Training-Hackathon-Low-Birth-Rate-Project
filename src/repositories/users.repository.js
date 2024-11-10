export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findUsers(id) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
