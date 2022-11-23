// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Configuration, OpenAIApi } from "openai";

export default async function requestImages(req, res) {
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createImage({
    prompt: req.prompt,
    n: 3,
    size: req.size,
  });

  const prompt = req.prompt;
  const size = req.size;

  res.status(200).json(response);
}