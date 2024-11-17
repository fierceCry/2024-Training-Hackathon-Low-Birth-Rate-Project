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

  // The format of chatHistory is [{ role: "user" | "assistant", content: string }, ...]
  // order of chatHistory is from the oldest to the latest
  async createChatResponse({ isRespectful = true, chatHistory = [], userMessage }) {
    console.log("createChatResponse", { isRespectful, chatHistory, userMessage });

    const systemPrompt = isRespectful ? respectfulPrompt : notRespectfulPrompt;

    const response = await this.client.chat.completions.create({
      model: ENV_KEY.OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory.map(({ role, message }) => ({ role, content: message })),
        { role: "user", content: userMessage },
      ],
    });
    console.log("response", response);

    const message = response.choices[0].message.content;
    console.log("message", message);

    return message;
  }

  async checkMessageType({ message, messageType }) {
    console.log("checkMessageType", message);

    const response = await this.client.chat.completions.create({
      model: ENV_KEY.OPENAI_MODEL_FOR_SMALL_TASK,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "isMessageType",
          description: `Check if the message corresponds to the ${messageType} and return true or false`,
          schema: {
            type: "object",
            properties: {
              isMessageType: { type: "boolean" },
            },
            required: ["isMessageType"],
            additionalProperties: false,
          },
          strict: true,
        },
      },
      messages: [
        {
          role: "system",
          content: `Check if the message corresponds to the ${messageType} and return true or false using json format`,
        },
        { role: "user", content: message },
      ],
    });
    console.log("response", response);

    const jsonResponse = JSON.parse(response.choices[0].message.content);
    console.log("jsonResponse", jsonResponse);

    return jsonResponse.isMessageType;
  }
}

const chatClient = new ChatClient();

export { ChatClient, chatClient };
