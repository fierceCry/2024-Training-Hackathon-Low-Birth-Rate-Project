import OpenAI from "openai";
import { ENV_KEY } from '../constants/env.constants.js';

const openai = new OpenAI({
  apiKey: ENV_KEY.OPENAI_API_KEY,
  organization: ENV_KEY.OPENAI_ORGANIZATION,
});

export { openai };