const { Configuration, OpenAIApi } = require("openai");

import type { NextApiRequest, NextApiResponse } from "next";

type OpenAIChoice = {
  text: string;
  index: number;
  logprobs: any;
  finish_reason: string;
};

type OpenAIUsage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

type Data = {
  choices: OpenAIChoice[];
  usage: OpenAIUsage;
};

type Error = {
  msg: string;
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  if (req.method !== 'POST'){
    res.status(400).json({
      msg: "Only POST method is available",
    });
    return;
  }
  const body = JSON.parse(req.body);
  const { query } = body;
  if (!query) {
    res.status(400).json({
      msg: "Missing query"
    });
    return;
  }
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: query,
    temperature: 0,
    max_tokens: 100,
  });
  res.status(200).json({
    choices: response.data.choices,
    usage: response.data.usage,
  });
}
