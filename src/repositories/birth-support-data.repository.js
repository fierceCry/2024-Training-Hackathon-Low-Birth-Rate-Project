export class BirthSupportDataRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAllBirthSupportData({ whereClause, limit, offset, orderBy }) {
    return this.prisma.birthSupportData.findMany({
      where: whereClause,
      skip: offset,
      take: +limit,
      orderBy: orderBy,
    });
  }
  
  async getBirthSupportDataById({ birthSupportDataId }) {
    return await this.prisma.birthSupportData.findUnique({
      where: { id: +birthSupportDataId },
    });
  }

  async incrementViewCountAndGetData(id) {
    return this.prisma.birthSupportData.update({
      where: { id: +id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }
}
