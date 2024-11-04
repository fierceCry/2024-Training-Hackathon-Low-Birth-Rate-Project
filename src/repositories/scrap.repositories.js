export class ScrapRepository {
  constructor(primsa){
    this.primsa = primsa
  }

  async createScrap(userId, birthSupportDataId){
    return this.primsa.scrap.create({
      data: {
        userId,
        birthSupportDataId
      }
    })
  }

  async getUserScraps(userId){
    return this.primsa.scrap.findMany({
      where: { userId },
      include: {
        birthSupportData: true
      }
    })
  }
}