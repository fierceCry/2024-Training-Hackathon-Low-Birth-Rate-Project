import { openai } from "../utils/open-ai.api.js";
import { ENV_KEY } from "../constants/env.constants.js";
import { franc } from 'franc';

export class ChatService {
  constructor(chatRepository) {
    this.chatRepository = chatRepository;
  }

  async createChat({ message }) {
    // 언어 감지
    const langCode = franc(message); // 사용자의 메시지로 언어 감지
    let initialPrompt;

    // 감지된 언어에 따라 초기 프롬프트 설정
    if (langCode === 'kor') {
      initialPrompt = "당신은 미혼모를 위한 지원 상담사입니다. 공감과 이해로 응답하고, 문제에 대한 실질적인 해결책도 제시하세요.";
    } else if (langCode === 'eng') {
      initialPrompt = "You are a supportive counselor for single mothers. Respond with empathy and understanding, and provide practical solutions to their problems.";
    } else {
      initialPrompt = "You are a supportive counselor for single mothers. Respond with empathy and understanding, and provide practical solutions to their problems."; // 기본 영어 프롬프트
    }

    const response = await openai.chat.completions.create({
      model: ENV_KEY.OPENAI_MODEL,
      messages: [
        { role: 'system', content: initialPrompt }, // 초기 프롬프트
        { role: 'user', content: message } // 사용자의 메시지
      ],
      max_tokens: 150, // 응답 길이 제한
      temperature: 0.5, // 응답의 다양성 조정
    });

    const chatResponse = response.choices[0].message.content;
    const cleanedResponse = chatResponse.replace(/\n/g, ' ');
    console.log(chatResponse)
    return this.chatRepository.createChat({
      message: cleanedResponse
    });
  }
}
