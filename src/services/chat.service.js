import { openAiClient } from "../utils/open-ai.api.js";
import getLogger from "../common/logger.js";

const logger = getLogger('chatService')
export class ChatService {
  constructor(chatRepository) {
    this.chatRepository = chatRepository;
  }
  // TODO: Retrieve latest x(count with input) messages from database

  async createChat({ id, message, isRespectful }) {
    logger.info("message", message);

    const initialPrompt = isRespectful ? respectfulPrompt : notRespectfulPrompt;

    // await this.chatRepository.createChat({
    //   id,
    //   message,
    //   messageType: 'user',
    // });

      // TODO: 1. Move this prompt to separate json file
      // TODO: 2. use json output mode
      // TODO: 3. include previous conversation
      // TODO: 4. Limit chat output
      // TODO: 5. Save chat response

    const response = await openAiClient.createChatResponse(message);
    // TODO: temperature 등 Parameter 조절
    // TODO: use json output

    const chatResponse = response.choices[0].message.content;
    const cleanedResponse = chatResponse.replace(/\n/g, " ");
    logger.info(cleanedResponse)
    return cleanedResponse

    // TODO: save chat response correctly

    // return this.chatRepository.createChat({
    //   id,
    //   message: cleanedResponse,
    //   messageType: 'assistant',
    // });
  }

  async findChatUserList(id) {
    return this.chatRepository.findChatUserList(id);
  }
}
