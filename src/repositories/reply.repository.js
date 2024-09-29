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

  async updateReply({ _id, replyId, content }) {  
    return this.replyModel.findByIdAndUpdate({ _id, replyId, content });
  }

  async deleteReply({ _id, replyId }) {
    return this.replyModel.findByIdAndDelete({ _id, replyId });
  }
}