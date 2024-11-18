import NodeCache from "node-cache";
import getLogger from "../common/logger.js";
import { chatClient } from "../utils/chatClient.js";

const logger = getLogger("BirthSupportDataService");

export class BirthSupportDataService {
  constructor(birthSupportDataRepository, authRepository) {
    this.birthSupportDataRepository = birthSupportDataRepository;
    this.authRepository = authRepository;
    this.cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
  }

  async getAllBirthSupportData({ whereClause, limit, page, sortBy }) {
    const offset = (page - 1) * limit;
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
    console.log(result);
  
    const filteredResult = result.map(item => {
      const filteredItem = { ...item };
  
      Object.keys(filteredItem).forEach(key => {
        if (filteredItem[key] === "" || filteredItem[key] === null) {
          delete filteredItem[key];
        }
      });
  
      return filteredItem;
    });
  
    console.log(filteredResult);
  
    const currentPage = Math.floor(offset / limit) + 1;
  
    const response = {
      total,
      limit: +limit,
      page: currentPage,
      result: filteredResult,
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
    const result = await this.birthSupportDataRepository.getBirthSupportDataById({
      birthSupportDataId,
    });
    this.cache.set(cacheKey, result);
    logger.info("지원금 상세페이지 캐싱 데이터 null로 데이터베이스 결과값 반환");
    return result;
  }

  async getRecommendedBirthSupportData({ id, birthDate, childrenCount, yearsOfResidence }) {
    const { address, ageGroup } = await this.authRepository.findUserById({ id });
    console.log("address", address);
    console.log("ageGroup", ageGroup);

    // 데이터 정규화
    const normalizedChildrenCount = this.normalizeChildrenCount(childrenCount);
    const normalizedYearsOfResidence = this.normalizeYearsOfResidence(yearsOfResidence);
    let add = "경기도 안산"; // 하드코딩된 주소
    const [addressProvince, addressCity] = add.split(" "); // 예: "경기도 안산" 형식으로 가정
    console.log(addressProvince)
    console.log(addressCity)
    const userEmbedding = await chatClient.getEmbedding({
      birthDate,
      childrenCount: normalizedChildrenCount,
      yearsOfResidence: normalizedYearsOfResidence,
      addressProvince,
      addressCity,
      ageGroup,
    });

    const birthSupportData = await this.birthSupportDataRepository.findBirthSupportList();

    const recommendations = await Promise.all(
      birthSupportData.map(async (data) => {
        const isRegionMatch =
          data.addressProvince === addressProvince && data.addressCity === addressCity;

        if (!data.embedding) {
          const dataEmbedding = await chatClient.getEmbedding(data);
          await this.birthSupportDataRepository.saveEmbeddingForSupport(data.id, dataEmbedding);
          return null; // embedding 제외
        }

        const dataEmbedding = data.embedding;
        const similarity = this.calculateSimilarity(userEmbedding, dataEmbedding);
        console.log(similarity);

        // 지역이 일치하면 우선적으로 추천
        return {
          ...data,
          similarity,
          isRegionMatch, // 지역 일치 여부 추가
          embedding: undefined, // embedding 제외
        };
      }),
    );

    // 유사도 기준 설정 (예: 0.6 이상)
    const similarityThreshold = 0.5;

    // 지역 일치 항목과 비일치 항목을 분리
    const regionMatches = recommendations.filter(
      (rec) => rec && rec.isRegionMatch && rec.similarity >= similarityThreshold,
    );
    const otherRecommendations = recommendations.filter(
      (rec) => rec && !rec.isRegionMatch && rec.similarity >= similarityThreshold,
    );

    // 유사도 기준으로 정렬
    const sortedRegionMatches = regionMatches.sort((a, b) => b.similarity - a.similarity);
    const sortedOtherRecommendations = otherRecommendations.sort(
      (a, b) => b.similarity - a.similarity,
    );

    // 지역 일치 항목을 먼저 반환하고, 그 다음에 나머지 추천 항목을 반환
    return [...sortedRegionMatches, ...sortedOtherRecommendations];
  }

  // 데이터 정규화 함수
  normalizeChildrenCount(count) {
    if (count === 0) return "0명";
    if (count <= 2) return "1-2명";
    return "3명 이상";
  }

  normalizeYearsOfResidence(years) {
    if (years < 1) return "1년 미만";
    if (years <= 3) return "1-3년";
    if (years <= 5) return "3-5년";
    return "5년 이상";
  }

  calculateSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val ** 2, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val ** 2, 0));
    return dotProduct / (magnitude1 * magnitude2);
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
