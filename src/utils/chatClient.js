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

  async checkMessageType({ message, messageType }) {
    console.log("checkMessageType", message);

    // TODO: Use proper prompt
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
