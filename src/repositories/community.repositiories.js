export class CommunityRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async createCommunity({ userId, title, content }) {
    const data = new this.communityModel({
      userId,
      title,
      content,
    });
    return data.save();
  }

  async findAllCommunity({ page, limit }) {
    return this.prisma.birthSupportData.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc', // 내림차순 정렬
      },
    });
  }
  
  async getCommunityById({ id }) {
    return this.communityModel.findById({ _id: id });
  }

  // async updateCommunityById({ userId, id, title, content }) {
  //   const updateData = {
  //     title,
  //     content,
  //     userId,
  //   };

  //   return this.communityModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  // }

  // async deleteCommunityById({ userId, id }) {
  //   return this.communityModel.findByIdAndDelete(id, userId).exec();
  // }
}
