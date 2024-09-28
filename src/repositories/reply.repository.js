export class ReplyRepository {
  constructor(replyModel) {
    this.replyModel = replyModel;
  }

  async createReply({ _id, content, commentId }) {
    const data = new this.replyModel({
      text: content,
      userId: _id,
      commentId: Object(commentId)
    });
    return await data.save();
  }
}
