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
} 