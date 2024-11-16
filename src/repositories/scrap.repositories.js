export class ScrapRepository {
  constructor(prisma){
    this.prisma = prisma
  }

  async createScrap(userId, birthSupportDataId){
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
        birthSupportDataId
      }
    })
  }

  async getUserScraps({id}){
    return this.prisma.scrap.findMany({
      where: { userId: id },
      include: {
        birthSupportData: true
      }
    })
  }
}