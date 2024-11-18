export class ScrapRepository {
  constructor(prisma){
    this.prisma = prisma
  }

  async createScrap(userId, birthSupportDataId) {
    const existingScrap = await this.prisma.scrap.findFirst({
      where: {
        userId: userId,
        birthSupportDataId: +birthSupportDataId,
        deletedAt: null,
      },
    });
  
    if (existingScrap) {
      await this.prisma.scrap.update({
        where: { id: existingScrap.id },
        data: {
          deletedAt: new Date(),
        },
      });
  
      await this.prisma.birthSupportData.update({
        where: {
          id: +birthSupportDataId,
        },
        data: {
          scrapCount: {
            decrement: 1,
          },
        },
      });
  
      return existingScrap;
    } else {
      await this.prisma.birthSupportData.update({
        where: {
          id: +birthSupportDataId,
        },
        data: {
          scrapCount: {
            increment: 1,
          },
        },
      });
  
      return this.prisma.scrap.create({
        data: {
          userId,
          birthSupportDataId,
        },
      });
    }
  }

  async getUserScraps({ id }) {
    return this.prisma.scrap.findMany({
      where: {
        userId: +id,
        deletedAt: null,
      },
      include: {
        birthSupportData: true,
      },
    });
  }  
}