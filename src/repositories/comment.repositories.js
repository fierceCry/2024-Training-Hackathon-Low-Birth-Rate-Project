import mongoose from "mongoose";

export class CommentRepository {
  constructor(commentModel) {
    this.commentModel = commentModel;
  }

  async createComment({ content, _id, communtiyId }) {
    const data = new this.commentModel({
      content,
      userId: _id,
      communtiyId: Object(communtiyId)
    });
    return await data.save();
  }
  
  async getComments({ communtiyId }) {
    return this.commentModel.find({ communtiyId });
  }

  async updateComment({ _id, communtiyId, content }) {
    return this.commentModel.findByIdAndUpdate({ _id, communtiyId, content });
  }

  async deleteComment({ _id, communtiyId }) {
    return this.commentModel.findByIdAndDelete({ _id, communtiyId });
  } 
}
