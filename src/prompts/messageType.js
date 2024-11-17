import { messageType } from "../types/messageType";

const askingGovernmentHelpPrompt = `Check if the message corresponds to the 'government help' and return true or false using json format`;
const relatedToSuicidePrompt = `Check if the message corresponds to the 'suicide' and return true or false using json format`;

export const prompts = {
  [messageType.relatedToSuicide]: relatedToSuicidePrompt,
  [messageType.askingGovernmentHelp]: askingGovernmentHelpPrompt,
};
