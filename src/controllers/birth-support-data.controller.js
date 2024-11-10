import { HTTP_STATUS } from "../constants/http-status.constant.js";

export class BirthSupportDataController {
  constructor(birthSupportDataService) {
    this.birthSupportDataService = birthSupportDataService;
  }

  getAllBirthSupportData = async (req, res, next) => {
    try {
      const { addressProvince, addressCity, page = 1, limit = 10, sortBy = "desc" } = req.query;

      const offset = (page - 1) * limit;

      const whereClause = {};
      if (addressProvince) {
        whereClause.addressProvince = addressProvince;
      }
      if (addressCity) {
        whereClause.addressCity = addressCity;
      }

      const result = await this.birthSupportDataService.getAllBirthSupportData({
        whereClause,
        limit,
        offset,
        sortBy,
      });

      return res.status(HTTP_STATUS.OK).json({ data: result });
    } catch (error) {
      next(error);
    }
  };

  getBirthSupportDataById = async (req, res, next) => {
    try {
      const { birthSupportDataId } = req.params;
      const result = await this.birthSupportDataService.getBirthSupportDataById({
        birthSupportDataId,
      });
      return res.status(HTTP_STATUS.OK).json({ data: result });
    } catch (error) {
      next(error);
    }
  };
}
