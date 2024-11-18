export class BirthSupportDataRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getBirthSupportList({ whereClause, limit, offset, orderBy }) {
    const excludeAllEmptyCondition = {
      NOT: {
        AND: [
          { supportTarget: { equals: "" } },
          { supportContent: { equals: "" } },
          { inquiryContact: { equals: "" } },
          { inquiryDetail: { equals: "" } },
          { applicationMethod: { equals: "" } },
          { requiredDocuments: { equals: "" } },
          { source: { equals: "" } },
          { eligibility: { equals: "" } },
          { supportAmount: { equals: "" } },
          { applicationPeriod: { equals: "" } },
          { applicationMethodDetail: { equals: "" } },
          { supportItems: { equals: "" } },
        ],
      },
    };

    const finalWhereClause = {
      ...whereClause,
      ...excludeAllEmptyCondition,
    };

    return this.prisma.birthSupportData.findMany({
      where: finalWhereClause,
      skip: offset,
      take: +limit,
      orderBy,
    });
  }

  async findBirthSupportList() {
    const excludeAllEmptyCondition = {
      NOT: {
        AND: [
          { supportTarget: { equals: "" } },
          { supportContent: { equals: "" } },
          { inquiryContact: { equals: "" } },
          { inquiryDetail: { equals: "" } },
          { applicationMethod: { equals: "" } },
          { requiredDocuments: { equals: "" } },
          { source: { equals: "" } },
          { eligibility: { equals: "" } },
          { supportAmount: { equals: "" } },
          { applicationPeriod: { equals: "" } },
          { applicationMethodDetail: { equals: "" } },
          { supportItems: { equals: "" } },
        ],
      },
    };

    return this.prisma.birthSupportData.findMany({
      where: excludeAllEmptyCondition
    });
  } 
  async getTotalCount(whereClause) {
    const excludeAllEmptyCondition = {
      NOT: {
        AND: [
          { supportTarget: { equals: "" } },
          { supportContent: { equals: "" } },
          { inquiryContact: { equals: "" } },
          { inquiryDetail: { equals: "" } },
          { applicationMethod: { equals: "" } },
          { requiredDocuments: { equals: "" } },
          { source: { equals: "" } },
          { eligibility: { equals: "" } },
          { supportAmount: { equals: "" } },
          { applicationPeriod: { equals: "" } },
          { applicationMethodDetail: { equals: "" } },
          { supportItems: { equals: "" } },
        ],
      },
    };

    const finalWhereClause = {
      ...whereClause,
      ...excludeAllEmptyCondition,
    };

    return this.prisma.birthSupportData.count({
      where: finalWhereClause,
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

  async saveEmbeddingForSupport(supportId, embedding) {
    console.log('supportId', supportId);
    await this.prisma.birthSupportData.update({
      where: { id: +supportId },
      data: { embedding: embedding }
    });
  }
  
}
