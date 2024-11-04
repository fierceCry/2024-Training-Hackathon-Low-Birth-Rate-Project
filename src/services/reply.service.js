export class ReplyService {
  constructor(replyRepository) {
    this.replyRepository = replyRepository;
  }

  // 답글 생성
  async createReply({ id, content, commentId }) {
    return this.replyRepository({ id, content, commentId });
  }

  // 답글 업데이트
  async updateReply({ id, replyId, content }) {
    return this.replyRepository({ id, replyId, content });
  }

  // 답글 삭제
  async deleteReply({ id, replyId }) {
    return this.replyRepository({ id, replyId });
  }
}
