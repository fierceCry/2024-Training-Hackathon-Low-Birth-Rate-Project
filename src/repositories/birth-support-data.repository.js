export class BirthSupportDataRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAllBirthSupportData(whereClause, limit, offset) {
    return await this.prisma.birthSupportData.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
    });
  }

  async getBirthSupportDataById({ birthSupportDataId }) {
    return await this.prisma.birthSupportData.findUnique({
      where: { id: +birthSupportDataId },
    });
  }
}
