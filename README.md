# Virtual Bookshelf API

## Deploying

1. Run `yarn`
1. Copy `env.yml.template` to `env.yml`
1. Configure values in `env.yml`
1. Make sure your aws creds are configured correctly
1. Run `yarn deploy` or `serverless deploy` or `sls deploy`
1. Test it out

## Goodreads

- Get your keys: `https://www.goodreads.com/api/keys`
- OAuth info: `https://www.goodreads.com/api/oauth_example`
- Node package: `https://github.com/bdickason/node-goodreads`

## Serverless Framework

- Template: `https://github.com/serverless/serverless/tree/master/lib/plugins/create/templates/aws-nodejs-typescript`
- Docs: `https://serverless.com/framework/docs/`
- Dev flow: `https://github.com/dherault/serverless-offline`

## TODO

- Custom domain: `https://serverless.com/blog/serverless-api-gateway-domain/`
- GraphQL: `https://github.com/serverless/serverless-graphql`
- OAuth2 Server: Auth0? DynamoDB backed?
  - This would just make mobile auth easier to deal with. And lock it down a bit more
