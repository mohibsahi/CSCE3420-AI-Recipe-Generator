import { defineFunction } from '@aws-amplify/backend';

export const recipeGenerator = defineFunction({
  name: 'recipe-generator',
  entry: './handler.ts',
  timeoutSeconds: 30,
});
