export class ReplyService {
  constructor(replyRepository) {
    this.replyRepository = replyRepository;
  }

  async createReply({ _id, content, commentId }) {
    return this.replyRepository.createReply({ _id, content, commentId });
  } 

  async updateReply({ _id, replyId, content }) {
    return this.replyRepository.updateReply({ _id, replyId, content });
  }

  async deleteReply({ _id, replyId }) {
    return this.replyRepository.deleteReply({ _id, replyId });
  } 
}