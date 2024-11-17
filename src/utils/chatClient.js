import OpenAI from "openai";
import { ENV_KEY } from "../constants/env.constants.js";
import { respectfulPrompt, notRespectfulPrompt } from "../prompts/chatResponse.js";

class ChatClient {
  constructor() {
    this.client = new OpenAI({
      apiKey: ENV_KEY.OPENAI_API_KEY,
      organization: ENV_KEY.OPENAI_ORGANIZATION,
    });
  }

  // TODO: temperature 등 Parameter 조절
  // TODO: use json output mode
  async createChatResponse({ isRespectful = true, chatHistory, userMessage }) {
    console.log("createChatResponse", { isRespectful, chatHistory, userMessage });

    const initialPrompt = isRespectful ? respectfulPrompt : notRespectfulPrompt;

    const response = await this.client.chat.completions.create({
      model: ENV_KEY.OPENAI_MODEL,
      messages: [{ role: "user", content: message }],
    });

    console.log("response", response);

    return response.choices[0].message.content;
  }

  async checkMessageType(message) {
    console.log("checkMessageType", message);

    // TODO: Use proper prompt
    const response = await this.client.chat.completions.create({
      model: ENV_KEY.OPENAI_MODEL_FOR_SMALL_TASK,
      messages: [{ role: "user", content: message }],
    });

    console.log("response", response);

    return response.choices[0].message.content;
  }
}

const chatClient = new ChatClient();

export { ChatClient, chatClient };
