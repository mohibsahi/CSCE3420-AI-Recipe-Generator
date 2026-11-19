import type { Schema } from '../../data/resource';
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from '@aws-sdk/client-bedrock-runtime';

const client = new BedrockRuntimeClient({
  region: 'us-east-2',
});

export const handler: Schema['generateRecipe']['functionHandler'] = async (event) => {
  const ingredients = event.arguments.ingredients;

  if (!ingredients?.trim()) {
    throw new Error('Please provide some ingredients.');
  }

  const response = await client.send(
    new ConverseCommand({
      modelId: 'us.anthropic.claude-haiku-4-5-20251001-v1:0',
      messages: [
        {
          role: 'user',
          content: [
            {
              text: `Create a detailed, easy-to-follow recipe using these ingredients: ${ingredients}. Include a recipe name, ingredients, cooking instructions, and estimated cooking time.`,
            },
          ],
        },
      ],
      inferenceConfig: {
        maxTokens: 1000,
        temperature: 0.7,
      },
    })
  );

  return response.output?.message?.content
    ?.map((item) => item.text ?? '')
    .join('\n') ?? 'No recipe generated.';
};
