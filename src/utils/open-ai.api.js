import OpenAI from "openai";
import { ENV_KEY } from "../constants/env.constants.js";

class OpenAiClient {
  constructor() {
    this.client = new OpenAI({
      apiKey: ENV_KEY.OPENAI_API_KEY,
      organization: ENV_KEY.OPENAI_ORGANIZATION,
    });
  }

  async createChatResponse(message) {
    console.log("createChatResponse", message);

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

const openAiClient = new OpenAiClient();

export { OpenAiClient, openAiClient };
