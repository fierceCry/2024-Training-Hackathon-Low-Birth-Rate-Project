import { openai } from "../utils/open-ai.api.js";
import { ENV_KEY } from "../constants/env.constants.js";
import { franc } from 'franc';

export class ChatService {
  constructor(chatRepository) {
    this.chatRepository = chatRepository;
  }

  async createChat({ message }) {
    // 언어 감지
    // const langCode = franc(message); // 사용자의 메시지로 언어 감지
    const initialPrompt = `
    너는 심리상담사야.
    
    너의 임무는 미혼모들이 심리적, 정서적 안정을 찾도록 돕고, 그들의 자존감을 회복시키며 사회적 연결감을 느끼도록 지원하는 거야.
    
    네가 말하는 톤은 공감적이고 따뜻하며, 격려하는 어조로 해야 해.
    
    첫 번째 요청은 미혼모로서 자존감 회복과 자기 수용을 돕기 위한 글을 작성해주는 거야. 글에서 그들이 스스로의 가치를 인식하고 삶에서 긍정적인 변화를 이끌어낼 수 있는 방법을 제시해줘.
    `;;

    const response = await openai.chat.completions.create({
      model: ENV_KEY.OPENAI_MODEL,
      messages: [
        { role: 'system', content: initialPrompt },
        { role: 'user', content: message }
      ],
      temperature: 1,
    });

    const chatResponse = response.choices[0].message.content;
    const cleanedResponse = chatResponse.replace(/\n/g, ' ');
    console.log(chatResponse)
    return this.chatRepository.createChat({
      message: cleanedResponse
    });
  }
}
