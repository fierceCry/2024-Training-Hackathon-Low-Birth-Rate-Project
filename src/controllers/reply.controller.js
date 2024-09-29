import { HTTP_STATUS } from "../constants/http-status.constant.js";

export class ReplyController {
  constructor(replyService) {
    this.replyService = replyService;
  }

  createReply = async (req, res) =>{
    const { _id } = req.user;
    const { content, commentId } = req.body;
    const reply = await this.replyService.createReply({ _id, content, commentId });
    return res.status(HTTP_STATUS.CREATED).json(reply);
  }

  updateReply = async (req, res) => {
    const { _id } = req.user;
    const { replyId } = req.params;
    const { content } = req.body;
    const reply = await this.replyService.updateReply({ _id, replyId, content });
    return res.status(HTTP_STATUS.OK).json(reply);
  }  

  deleteReply = async (req, res) => {
    const { _id } = req.user;
    const { replyId } = req.params;
    await this.replyService.deleteReply({ _id, replyId });
    return res.status(HTTP_STATUS.OK).json({ message: "대댓글 삭제 완료되었습니다." });
  }
  
} 