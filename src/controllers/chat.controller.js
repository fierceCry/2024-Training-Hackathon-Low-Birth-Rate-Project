import { HTTP_STATUS } from "../constants/http-status.constant.js";

export class ChatController {
  constructor(chatService) {
    this.chatService = chatService;
  }

  handleChat = async (req, res, next) => {
    try {
      // const { id } = req.user
      const { message, isRespectful= true } = req.body;
      const chatResponse = await this.chatService.createChat({
        // id,
        message,
        isRespectful,
      });
      return res.status(HTTP_STATUS.CREATED).json({ data: chatResponse });
    } catch (error) {
      next(error);
    }
  };

  chatList = async (req, res, next) => {
    try {
      const { id } = req.user
      const result = await this.chatService.findChatUserList(id)
      return res.status(HTTP_STATUS.OK).json({ data: result})
    } catch (error) {
      next(error);
    }
  };
}
