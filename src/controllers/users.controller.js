import { HTTP_STATUS } from "../constants/http-status.constant.js";

export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  findUsers = async (req, res, next) => {
    try {
      const { id } = req.user;
      const result = await this.usersService.findUsers(id);
      return res.status(HTTP_STATUS.OK).json({ data: result });
    } catch (error) {
      next(error);
    }
  };
}
