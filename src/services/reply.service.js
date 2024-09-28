export class ReplyService {
  constructor(replyRepository) {
    this.replyRepository = replyRepository;
  }

  async createReply({ _id, content, commentId }) {
    return this.replyRepository.createReply({ _id, content, commentId });
  } 
}