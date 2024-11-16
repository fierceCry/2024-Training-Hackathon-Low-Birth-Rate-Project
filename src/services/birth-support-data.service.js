import NodeCache from "node-cache";
import getLogger from "../common/logger.js";

const logger = getLogger('BirthSupportDataService')

export class BirthSupportDataService {
  constructor(birthSupportDataRepository) {
    this.birthSupportDataRepository = birthSupportDataRepository;
    this.cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
  }

  async getAllBirthSupportData({ whereClause, limit, page, sortBy }) {
    const offset = (page - 1) * limit
    const cacheKey = `birthSupportData_${JSON.stringify(whereClause)}_${limit}_${offset}_${sortBy}`;
      
    const cachedData = this.cache.get(cacheKey);
    if (cachedData) {
      logger.info("지원금 전체리스트 캐싱 데이터 반환");
      return cachedData;
    }
  
    const orderBy = this.getOrderBy(sortBy);

    const [result, total] = await Promise.all([
      this.birthSupportDataRepository.getBirthSupportList({ whereClause, limit, offset, orderBy }),
      this.birthSupportDataRepository.getTotalCount(whereClause),
    ]);

    const currentPage = Math.floor(offset / limit) + 1;
  
    const response = {
      total,
      limit: +limit,
      page: currentPage,
      result,
    };
    this.cache.set(cacheKey, response);
  
    logger.info("지원금 전체리스트 캐싱 데이터 null로 데이터베이스 결과값 반환");
    return response;
  }

  async getBirthSupportDataById({ birthSupportDataId }) {
    const cacheKey = `birthSupportDataId_${birthSupportDataId}`;

    let cachedData = this.cache.get(cacheKey);
    if (cachedData) {
      logger.info("지원금 상세페이지 캐싱 데이터 반환");
      return cachedData;
    }

    await this.birthSupportDataRepository.incrementViewCountAndGetData(birthSupportDataId);
    const result = await this.birthSupportDataRepository.getBirthSupportDataById({ birthSupportDataId });
    this.cache.set(cacheKey, result);
    logger.info("지원금 상세페이지 캐싱 데이터 null로 데이터베이스 결과값 반환");
    return result;
  }

  getOrderBy(sortBy) {
    switch (sortBy) {
      case "viewCount":
        return { viewCount: "desc" };
      case "scrapCount":
        return { scrapCount: "desc" };
      case "asc":
        return { createdAt: "asc" };
      case "desc":
      default:
        return { createdAt: "desc" };
    }
  }
}
