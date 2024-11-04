export class CommentService {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  // 댓글 생성
  async createComment({ content, userId, communityId }) {
    return this.commentRepository({ content, userId, communityId });
  }

  // 특정 커뮤니티에 속한 모든 댓글 가져오기
  async getAllComments({ communityId }) {
    return this.commentRepository({ communityId });
  }

  // 댓글 업데이트
  async updateComment({ id, content }) {
    return this.commentRepository({ id, content });
  }

  // 댓글 삭제
  async deleteComment({ id }) {
    return this.commentRepository({ id });
  }
}
