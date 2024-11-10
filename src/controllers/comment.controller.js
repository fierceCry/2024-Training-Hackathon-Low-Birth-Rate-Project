import { HTTP_STATUS } from "../constants/http-status.constant.js";

export class CommentController {
  constructor(commentService) {
    this.commentService = commentService;
  }

  createComment = async (req, res) => {
    const { _id } = req.user;
    const { content, communtiyId } = req.body;
    const data = await this.commentService.createComment({ content, _id, communtiyId });
    return res.status(HTTP_STATUS.CREATED).json({ message: "댓글 생성 완료되었습니다.", data });
  };

  getAllComments = async (req, res) => {
    const { communtiyId } = req.params;
    const data = await this.commentService.getAllComments({ communtiyId });
    return res.status(HTTP_STATUS.OK).json({ message: "댓글 조회 완료되었습니다.", data });
  };

  updateComment = async (req, res) => { 
    const { _id } = req.user;
    const { communtiyId } = req.params;
    const { content } = req.body;
    const data = await this.commentService.updateComment({ _id, communtiyId, content });
    return res.status(HTTP_STATUS.OK).json({ message: "댓글 수정 완료되었습니다.", data });
  };

  deleteComment = async (req, res) => {
    const { _id } = req.user;
    const { communtiyId } = req.params;
    await this.commentService.deleteComment({ _id, communtiyId });
    return res.status(HTTP_STATUS.OK).json({ message: "댓글 삭제 완료되었습니다."});
  };
}