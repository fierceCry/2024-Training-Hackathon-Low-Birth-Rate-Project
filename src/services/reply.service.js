export class ReplyService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 답글 생성
  async createReply({ _id, content, commentId }) {
    return this.prisma.reply.create({
      data: {
        userId: _id,
        content: content,
        commentId: commentId,
      },
    });
  }

  // 답글 업데이트
  async updateReply({ _id, replyId, content }) {
    return this.prisma.reply.update({
      where: {
        id: replyId,
      },
      data: {
        userId: _id,
        content: content,
      },
    });
  }

  // 답글 삭제
  async deleteReply({ _id, replyId }) {
    return this.prisma.reply.delete({
      where: {
        id: replyId,
      },
    });
  }
}
