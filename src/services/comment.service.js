export class CommentService {
  constructor(CommentRepository) {
    this.commentRepository = CommentRepository;
  }

  async createComment({ content, _id, communtiyId }) {
    const data = await this.commentRepository.createComment({ content, _id, communtiyId });
    return data;
  }

  async getComments({ communtiyId }) {
    return this.commentRepository.getComments({ communtiyId });
  }
  
  async updateComment({ _id, communtiyId, content }) {
    return this.commentRepository.updateComment({ _id, communtiyId, content });
  }
  
  async deleteComment({ _id, communtiyId }) {
    return this.commentRepository.deleteComment({ _id, communtiyId });
  } 
}
