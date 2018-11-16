import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

import IOptions from './ioptions';

import getBooksOwned from './services/books/get-owned';
import getAccessToken from './services/get-access-token';
import getAuthUser from './services/get-auth-user';
import getRequestToken from './services/get-request-token';

export const handle: Handler = (
  event: APIGatewayEvent,
  context: Context,
  cb: Callback,
) => {
  event.queryStringParameters = event.queryStringParameters || {};
  event.body = event.body || '{}';

  const options: IOptions = {
    clientKey: process.env.GOODREADS_CLIENT_KEY,
    clientSecret: process.env.GOODREADS_CLIENT_SECRET,
    redirectUri: event.queryStringParameters.redirect,

    baseUrl: 'https://goodreads.com',
    oauthEncryption: 'HMAC-SHA1',
    oauthVersion: '1.0',

    accessTokenUrlPath: '/oauth/access_token',
    requestTokenUrlPath: '/oauth/request_token',
  };

  switch (
    `${event.requestContext.httpMethod.toUpperCase()}:${event.requestContext.resourcePath.toLowerCase()}`
  ) {
    case 'POST:/v1/goodreads/request-token':
      getRequestToken(options, event, context, cb);
      break;

    case 'POST:/v1/goodreads/access-token':
      getAccessToken(options, event, context, cb);
      break;

    case 'POST:/v1/goodreads/me':
      getAuthUser(options, event, context, cb);
      break;

    case 'POST:/v1/goodreads/books/owned':
      getBooksOwned(options, event, context, cb);
      break;

    default:
      cb(null, {
        body: JSON.stringify({
          message: 'Not Found',
        }),
        statusCode: 404,
      });
  }
};
