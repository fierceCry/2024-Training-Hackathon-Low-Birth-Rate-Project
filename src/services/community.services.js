import { HttpError } from "../errors/http.error.js";

export class CommunityServices {
  constructor(communityRepository) {
    this.communityRepository = communityRepository;
  }

  async createCommunity({ userId, title, content }) {
    return this.communityRepository.createCommunity({ userId, title, content });
  }

  async getAllcreateCommunity(page, limit) {
    return this.communityRepository.findAllCommunity({ page, limit });
  }

  async getCommunityById({ id }) {
    const data = await this.communityRepository.getCommunityById({ id });
    if (!data) {
      throw new HttpError.BadRequest("communtiy가 없습니다.");
    }
    return data;
  }

  async updateCommunity({userId, id, title, content}) {
    return this.communityRepository.updateCommunityById({userId, id, title, content});
  }

  async deleteCommunity({userId, id}) {
    return this.communityRepository.deleteCommunityById({userId, id});
  }
}
