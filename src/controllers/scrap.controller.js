import { HTTP_STATUS } from "../constants/http-status.constant.js";

export class ScrapController {
  constructor(scrapService) {
    this.scrapService = scrapService;
  }

  createScrap = async (req, res, next) => {
    try {
      const { id } = req.user;
      const { content, commentId } = req.body;
      const reply = await this.scrapService.createScrap({ id, content });
      return res.status(HTTP_STATUS.CREATED).json(reply);
    } catch (err) {
      next(err);
    }
  };

  getScrap = async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { replyId } = req.params;
      const { content } = req.body;
      const reply = await this.scrapService.createScrap({ id, replyId, content });
      return res.status(HTTP_STATUS.OK).json(reply);
    } catch (err) {
      next(err);
    }
  };
}
