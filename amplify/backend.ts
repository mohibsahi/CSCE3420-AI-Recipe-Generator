import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { recipeGenerator } from './functions/recipe-generator/resource';

const backend = defineBackend({
  auth,
  data,
  recipeGenerator,
});

backend.recipeGenerator.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['bedrock:InvokeModel'],
    resources: [
      'arn:aws:bedrock:*::foundation-model/anthropic.claude-haiku-4-5-20251001-v1:0',
      'arn:aws:bedrock:us-east-2:*:inference-profile/us.anthropic.claude-haiku-4-5-20251001-v1:0',
    ],
  })
);
