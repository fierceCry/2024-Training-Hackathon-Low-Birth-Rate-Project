import { HTTP_STATUS } from "../constants/http-status.constant.js";

export class ChatController {
  constructor(chatService) {
    this.chatService = chatService;
  }

  handleChat = async (req, res, next) => {
    try {
      const { id } = req.user;
      const { message, isRespectful = null, chatName = null } = req.body;
      const { messageType, response } = await this.chatService.createChat({
        id,
        message,
        isRespectful,
        chatName
      });
      return res.status(HTTP_STATUS.CREATED).json({
        data: {
          messageType,
          chatResponse: response,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  chatList = async (req, res, next) => {
    try {
      const { id } = req.user;
      const result = await this.chatService.findChatUserList({ userId: id });
      return res.status(HTTP_STATUS.OK).json({ data: result });
    } catch (error) {
      next(error);
    }
  };
}
