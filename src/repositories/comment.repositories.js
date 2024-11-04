export class CommentRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 댓글 생성
  async createComment({ content, userId, communityId }) {
    return await this.prisma.comment.create({
      data: {
        content,
        userId,
        communityId,
      },
    });
  }

  // 특정 커뮤니티의 모든 댓글과 답글 가져오기
  async getAllComments({ communityId }) {
    const comments = await this.prisma.comment.findMany({
      where: { communityId },
      include: {
        replies: true, // Prisma는 관계된 데이터를 쉽게 가져올 수 있습니다.
      },
    });
    return comments;
  }

  // 댓글 업데이트
  async updateComment({ id, content }) {
    return await this.prisma.comment.update({
      where: { id },
      data: { content },
    });
  }

  // 댓글 삭제
  async deleteComment({ id }) {
    return await this.prisma.comment.delete({
      where: { id },
    });
  }
}
