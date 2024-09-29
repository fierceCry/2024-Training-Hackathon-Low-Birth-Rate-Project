export class ChatRepository {
  constructor(chatModel) {
    this.chatModel = chatModel;
  }

  async createChat({ message }) {
    const data = new this.chatModel({ 
      messages: message
    });
    return await data.save();
  }
}
