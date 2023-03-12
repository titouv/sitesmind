import { Configuration, OpenAIApi } from "openai";
import fetchAdapter from "@vespaiach/axios-fetch-adapter";
const configurationWithAdapter = () => {
  return new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    baseOptions: { adapter: fetchAdapter },
  });
};

const createOpenaiClient = () => new OpenAIApi(configurationWithAdapter());

export { createOpenaiClient };
