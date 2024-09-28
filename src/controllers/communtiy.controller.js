import { HTTP_STATUS } from "../constants/http-status.constant.js";

export class CommunityController {
  constructor(communityServices) {
    this.communityServices = communityServices;
  }

  createCommunity = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { title, content } = req.body;
      const data = await this.communityServices.createCommunity({
        userId,
        title,
        content,
      });
      return res.status(HTTP_STATUS.CREATED).json({ data });
    } catch (error) {
      next(error);
    }
  };

  getAllcreateCommunity = async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const data = await this.communityServices.getAllcreateCommunity({
        page,
        limit,
      });
      return res.status(HTTP_STATUS.OK).json({ data });
    } catch (error) {
      next(error);
    }
  };

  getCommunityById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await this.communityServices.getCommunityById({id});
      return res.status(HTTP_STATUS.OK).json({ data });
    } catch (error) {
      next(error);
    }
  };

  updateCommunity = async (req, res, next)=> {
    try {
      const userId = req.user._id
      const { id } = req.params; 
      const {title, content} = req.body;

      const updatedCommunity = await this.communityServices.updateCommunity({userId, id, title, content});
      return res.status(HTTP_STATUS.OK).json({message: "성공적으로 업데이트 되었습니다.",updatedCommunity});
    } catch (error) {
      next(error);
    }
  }

  deleteCommunity= async (req, res, next) =>{
    try {
      const userId = req.user._id
      const { id } = req.params;

      await this.communityServices.deleteCommunity({userId, id});
      return res.status(HTTP_STATUS.OK).json({ message: '성공적으로 삭제되었습니다.' });
    } catch (error) {
      next(error);
    }
  }
}
