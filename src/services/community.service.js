import { HttpError } from "../errors/http.error.js";

export class CommunityServices {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 커뮤니티 생성
  async createCommunity({ userId, title, content }) {
    return this.prisma.community.create({
      data: {
        userId,
        title,
        content,
      },
    });
  }

  // 모든 커뮤니티 가져오기 (페이지네이션 지원)
  async getAllcreateCommunity(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.prisma.community.findMany({
      skip,
      take: limit,
    });
  }

  // 특정 커뮤니티 ID로 커뮤니티 가져오기
  async getCommunityById({ id }) {
    const data = await this.prisma.community.findUnique({
      where: {
        id: id,
      },
    });

    if (!data) {
      throw new HttpError.BadRequest("community가 없습니다.");
    }
    return data;
  }

  // 커뮤니티 업데이트
  async updateCommunity({ userId, id, title, content }) {
    return this.prisma.community.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        content: content,
      },
    });
  }

  // 커뮤니티 삭제
  async deleteCommunity({ userId, id }) {
    return this.prisma.community.delete({
      where: {
        id: id,
        userId: userId,
      },
    });
  }
}
