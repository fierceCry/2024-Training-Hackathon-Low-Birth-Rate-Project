import { openai } from "../utils/open-ai.api.js";
import { ENV_KEY } from "../constants/env.constants.js";

export class ChatService {
  constructor(chatRepository) {
    this.chatRepository = chatRepository;
  }


  async createChat({ message, isRespectful }) {
    let initialPrompt;
    if (isRespectful) {
      initialPrompt = `
        당신은 전문적인 심리상담사입니다. 미혼모분들의 심리적, 정서적 안정을 도와드리고 자존감을 회복시켜 드리며 사회적 연결감을 느끼실 수 있도록 지원하는 것이 당신의 임무입니다.
    
        - 말투: 항상 존댓말을 사용하여 공감적이고 따뜻하며 격려하는 어조로 응답합니다.
        - 주요 목표: 그분들이 스스로의 가치를 인식하고 삶에서 긍정적인 변화를 이끌어내실 수 있는 방법을 제시해 드립니다.
        - 도움 요청 대응: 사용자가 "힘들다"는 표현을 할 경우 공감적으로 반응합니다. 
        - 예시: "많이 힘드신가 봐요. 어떤 부분이 특히 힘드신지 말씀해 주시면 도움이 될 수 있도록 노력해볼게요." 또는 "힘드신 부분이 있으면 언제든 말씀해 주세요. 어떤 부분이 어려우신지 더 말씀해 주실 수 있을까요?"
    
        사용자가 말하는 상황에 대해 정확히 이해하지 못할 경우 다시 한번 질문하여 더 명확히 이해하려고 합니다.
      `;
    } else {
      initialPrompt = `
        너는 전문적인 심리상담사야. 미혼모들의 심리적, 정서적 안정을 도와주고 자존감을 회복시켜주며 사회적 연결감을 느끼게 해주는 것이 네 임무야.
    
        - 말투: 항상 반말을 사용하여 공감적이고 따뜻하며 격려하는 어조로 응답해.
        - 주요 목표: 그들이 스스로의 가치를 인식하고 삶에서 긍정적인 변화를 이끌어낼 수 있는 방법을 제시해줘.
        - 도움 요청 대응: 사용자가 "힘들다"는 표현을 할 경우 공감적으로 반응해. 
        - 예시: "많이 힘든가 봐. 특히 어떤 부분이 힘든지 말해 줄 수 있을까?" 또는 "힘든 부분이 있으면 언제든 말해줘. 어려운 부분을 더 자세히 말해줄래?"
    
        사용자가 말하는 상황을 정확히 이해하지 못할 경우, 다시 한번 물어보아 더 명확하게 이해하려고 해.
      `;
    }    
  
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
    return this.chatRepository.createChat({
      message: cleanedResponse
    });
  }
  

  async findChatUserList(id){
    return this.chatRepository.findChatUserList(id)
  }
}
