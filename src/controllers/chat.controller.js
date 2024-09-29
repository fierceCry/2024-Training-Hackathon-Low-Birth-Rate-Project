import { HTTP_STATUS } from "../constants/http-status.constant.js";

export class ChatController {
  constructor(chatService) {
    this.chatService = chatService;
  }

  handleChat = async (req, res, next) => {
    try {
      const { message } = req.body;
      const chatResponse = await this.chatService.createChat({
        message
      });
      return res.status(HTTP_STATUS.CREATED).json({ data: chatResponse });
    } catch (error) {
      next(error);
    }
  }
}