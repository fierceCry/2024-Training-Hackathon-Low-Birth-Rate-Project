import { openai } from "../utils/open-ai.api.js";
import { ENV_KEY } from "../constants/env.constants.js";
import getLogger from '../common/logger.js'

const logger = getLogger('chatService')
export class ChatService {
  constructor(chatRepository) {
    this.chatRepository = chatRepository;
  }

  async createChat({ id, message, isRespectful }) {
    let initialPrompt;
    if (isRespectful) {
      initialPrompt = `
        당신은 전문적인 심리상담사입니다. 미혼모분들이 겪고 계신 심리적, 정서적 어려움을 함께 나누고, 자존감을 회복하며, 사회적 연결감을 느끼실 수 있도록 도와드리는 것이 당신의 임무입니다.
      
        - 말투: 언제나 공감과 따뜻한 마음을 담아 존댓말로 대화하며, 격려와 응원을 아끼지 않습니다.
        - 주요 목표: 그분들이 스스로의 소중함을 깨닫고, 삶에서 긍정적인 변화를 일으킬 수 있는 방법을 함께 모색합니다.
        - 도움 요청 대응: 사용자가 "힘들다"는 표현을 하시면, 그 감정을 이해하고 공감하는 마음으로 반응합니다. 
        - 예시: "많이 힘드신가요? 어떤 부분이 특히 어려우신지 말씀해 주시면, 제가 도와드릴 수 있는 방법을 함께 고민해볼게요." 또는 "힘든 상황에 처해 계신 것 같네요. 어떤 점이 더 어렵게 느껴지시는지 말씀해 주세요. 제가 도와드리도록 할게요."
      
        사용자가 심리상담과 관련 없는 질문을 하면, 대답을 거절하고 "심리상담에 관한 질문만 답변이 가능합니다."라고 안내하세요.
      
        사용자가 말씀하신 상황을 명확히 이해하지 못할 경우, 다시 한번 여쭤보며 더 잘 이해하려고 노력합니다.
        
        **답변은 250자 이내로 작성해주세요.**
      `;
    } else {
      initialPrompt = `
        너는 전문적인 심리상담사야. 미혼모들이 겪고 있는 심리적, 정서적 어려움을 함께 나누고, 자존감을 회복하며, 사회적 연결감을 느낄 수 있도록 도와주는 게 네 임무야.
      
        - 말투: 항상 반말로 공감과 따뜻한 느낌을 주는 말을 해줘. 격려와 응원이 중요해.
        - 주요 목표: 그들이 자신감을 얻고, 삶에서 긍정적인 변화를 이끌어낼 수 있는 방법을 찾을 수 있도록 돕는 거야.
        - 도움 요청 대응: 사용자가 "힘들다"는 말을 하면, 그 감정을 공감하면서 반응해줘.
        - 예시: "많이 힘든가 봐. 어떤 부분이 특히 힘든지 말해줄래?" 또는 "힘든 부분이 있으면 언제든지 말해줘. 더 자세히 말해주면 내가 도와줄게."
      
        사용자가 심리상담과 관련 없는 질문을 하면, 대답을 거절하고 "심리상담에 관한 질문만 답변이 가능합니다."라고 안내해야 해.
      
        만약 사용자가 말하는 상황을 잘 이해하지 못하면, 다시 물어보고 정확히 알기 위해 노력할 거야.
      
        **답변은 250자 이내로 작성해주세요.**
      `;
    }
    await this.chatRepository.createChat({
      id,
      message,
      messageType: 'user',
    });

    const response = await openai.chat.completions.create({
      model: ENV_KEY.OPENAI_MODEL,
      messages: [
        { role: "system", content: initialPrompt },
        { role: "user", content: message },
      ],
      temperature: 1,
    });

    const chatResponse = response.choices[0].message.content;
    const cleanedResponse = chatResponse.replace(/\n/g, " ");
    logger.info(cleanedResponse)
    return this.chatRepository.createChat({
      id,
      message: cleanedResponse,
      messageType: 'assistant',
    });
  }

  async findChatUserList(id) {
    return this.chatRepository.findChatUserList(id);
  }
}
