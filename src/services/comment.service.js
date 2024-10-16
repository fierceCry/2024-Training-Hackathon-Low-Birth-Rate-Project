export class CommentService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 댓글 생성
  async createComment({ content, userId, communityId }) {
    return this.prisma.comment.create({
      data: {
        content: content,
        userId: userId,
        communityId: communityId,
      },
    });
  }

  // 특정 커뮤니티에 속한 모든 댓글 가져오기
  async getAllComments({ communityId }) {
    return this.prisma.comment.findMany({
      where: {
        communityId: communityId,
      },
    });
  }

  // 댓글 업데이트
  async updateComment({ id, content }) {
    return this.prisma.comment.update({
      where: {
        id: id,
      },
      data: {
        content: content,
      },
    });
  }

  // 댓글 삭제
  async deleteComment({ id }) {
    return this.prisma.comment.delete({
      where: {
        id: id,
      },
    });
  }
}
