import fetchAdapter from "@vespaiach/axios-fetch-adapter"
import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  baseOptions: { adapter: fetchAdapter },
})
const createOpenaiClient = () => new OpenAIApi(configuration)

export { createOpenaiClient }
