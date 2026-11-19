import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { recipeGenerator } from '../functions/recipe-generator/resource';

const schema = a.schema({
  generateRecipe: a
    .query()
    .arguments({
      ingredients: a.string().required(),
    })
    .returns(a.string())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(recipeGenerator)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
