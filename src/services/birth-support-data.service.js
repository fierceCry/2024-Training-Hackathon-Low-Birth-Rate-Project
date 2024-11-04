export class BirthSupportDataService {
  constructor(birthSupportDataRepository) {
    this.birthSupportDataRepository = birthSupportDataRepository;
  }

  async getAllBirthSupportData(whereClause, limit, offset) {
    return await this.birthSupportDataRepository.getAllBirthSupportData(whereClause, limit, offset);
  }

  async getBirthSupportDataById({ birthSupportDataId }) {
    return this.birthSupportDataRepository.getBirthSupportDataById({ birthSupportDataId });
  }
}
