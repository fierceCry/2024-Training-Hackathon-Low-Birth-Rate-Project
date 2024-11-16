import { HTTP_STATUS } from "../constants/http-status.constant.js";

export class ScrapController {
  constructor(scrapService) {
    this.scrapService = scrapService;
  }

  createScrap = async (req, res, next) => {
    try {
      const { id } = req.user;
      const { birthSupportDataId } = req.body;
      const result = await this.scrapService.createScrap({ id, birthSupportDataId });
      return res.status(HTTP_STATUS.CREATED).json({ data: result });
    } catch (error) {
      next(error);
    }
  };

  getScrap = async (req, res, next) => {
    try {
      const { id } = req.user;
      const result = await this.scrapService.createScrap({ id });
      return res.status(HTTP_STATUS.OK).json({ data: result});
    } catch (error) {
      next(error);
    }
  };
}
