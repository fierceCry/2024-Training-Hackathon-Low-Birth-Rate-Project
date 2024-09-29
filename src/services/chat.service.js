import { openai } from "../utils/open-ai.api.js";
import { ENV_KEY } from "../constants/env.constants.js";

export class ChatService {
  constructor(chatRepository) {
    this.chatRepository = chatRepository;
  }

  async createChat({ message }) {
    const response = await openai.chat.completions.create({
      model: ENV_KEY.OPENAI_MODEL,
      messages: [{ role: 'user', content: message }],
    });
    const chatResponse = response.choices[0].message.content;
    const cleanedResponse = chatResponse.replace(/\n/g, ' ');
    return this.chatRepository.createChat({
      message: cleanedResponse
    });
  }
}
