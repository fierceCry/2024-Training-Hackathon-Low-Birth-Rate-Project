export class CommunityRepository {
  constructor(communityModel) {
    this.communityModel = communityModel;
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
    return this.communityModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async getCommunityById({ id }) {
    return this.communityModel.findById({ _id: id });
  }

  async updateCommunityById({ userId, id, title, content }) {
    const updateData = {
      title,
      content,
      userId,
    };

    return this.communityModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteCommunityById({ userId, id }) {
    return this.communityModel.findByIdAndDelete(id, userId).exec();
  }
}
