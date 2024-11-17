export class ScrapService {
  constructor(scrapRepository){
    this.scrapRepository = scrapRepository
  }

  async createScrap({id, birthSupportDataId}){
    return this.scrapRepository.createScrap(id, birthSupportDataId)
  }

  async getScrap({id}){
    return this.scrapRepository.getUserScraps({id})
  }
}