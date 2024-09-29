export class CommentRepository {
  constructor(commentModel, replyModel) {
    this.commentModel = commentModel;
    this.replyModel = replyModel;
  }

  async createComment({ content, _id, communtiyId }) {
    const data = new this.commentModel({
      content,
      userId: _id,
      communtiyId: Object(communtiyId)
    });
    return await data.save();
  }

  async getAllComments({ communtiyId }) {
    const comments = await this.commentModel.find({ communtiyId });

    const replies = await this.replyModel.find({ commentId: { $in: comments.map(comment => comment._id) } });

    comments.forEach(comment => {
      comment.replies = replies.filter(reply => reply.commentId.equals(comment._id));
    });

    return comments;
  }

  async updateComment({ _id, communtiyId, content }) {
    return this.commentModel.findByIdAndUpdate({ _id, communtiyId, content });
  }

  async deleteComment({ _id, communtiyId }) {
    return this.commentModel.findByIdAndDelete({ _id, communtiyId });
  }
}
