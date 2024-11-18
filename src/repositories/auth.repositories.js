import getLogger from "../common/logger.js";

const logger = getLogger('AuthRepository')

export class AuthRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findUserByEmail({ email }) {
    return this.prisma.user.findUnique({
      where: {
        email
      },
    });
  }

  async findByUserName({ name }) {
    logger.info('name', name)
    return this.prisma.user.findFirst({
      where: {
        name
      },
    });
  }

  async createUser({ email, hashedPassword, name }) {
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
    });
  }

  async createToken({ userId, hashRefreshToken }) {
    return this.prisma.refreshToken.upsert({
      where: {
        userId: userId,
      },
      update: {
        token: hashRefreshToken,
      },
      create: {
        userId: userId,
        token: hashRefreshToken,
      },
    });
  }  

  async findUserById({ id }) {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findByToken(id) {
    return await this.prisma.refreshToken.findUnique({
      where: { userId: id },
    });
  }

  async updateUserMode({ id, isRespectful, chatName }) {
    return this.prisma.user.update({
      where: { id },
      data: { isRespectful, chatName },
    });
  }
}
