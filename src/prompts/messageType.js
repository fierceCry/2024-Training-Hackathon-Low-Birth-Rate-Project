import { messageType } from "../types/messageType.js";

// const askingGovernmentHelpPrompt = `Check if the message corresponds to the 'government help' and return true or false using json format`;
// const relatedToSuicidePrompt = `Check if the message corresponds to the 'suicide' and return true or false using json format`;

const askingGovernmentHelpPrompt = `Determine if the following message relates to 'government help'. Return the result as a JSON object with a boolean value. Example: {"result": true} or {"result": false}. Message: {message}`;
const relatedToSuicidePrompt = `Determine if the following message relates to 'suicide'. Return the result as a JSON object with a boolean value. Example: {"result": true} or {"result": false}. Message: {message}`;

export const prompts = {
  [messageType.relatedToSuicide]: relatedToSuicidePrompt,
  [messageType.askingGovernmentHelp]: askingGovernmentHelpPrompt,
};
