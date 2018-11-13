import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

import Goodreads from 'goodreads';

export const handle: Handler = (
  event: APIGatewayEvent,
  context: Context,
  cb: Callback,
) => {
  const goodreadsClient = Goodreads.client({
    callback: event.queryStringParameters.redirect,
    key: process.env.GOODREADS_CLIENT_KEY,
    secret: process.env.GOODREADS_CLIENT_SECRET,
  });

  switch (
    `${event.requestContext.httpMethod.toUpperCase()}:${event.requestContext.resourcePath.toLowerCase()}`
  ) {
    case 'POST:/v1/goodreads/request-token':
      goodreadsClient.requestToken((result, status?: number) => {
        if (status === 500) {
          return cb(null, {
            body: JSON.stringify({
              message: result,
            }),
            statusCode: 500,
          });
        }

        cb(null, {
          body: JSON.stringify({
            message: 'Request Token Retrieved',
            result: {
              authorizeUrl: result.url,
              oauthToken: result.oauthToken,
              oauthTokenSecret: result.oauthTokenSecret,
            },
          }),
          statusCode: 200,
        });
      });
      break;

    case 'POST:/v1/goodreads/access-token':
      goodreadsClient.processCallback((result, status?: number) => {
        if (status === 500) {
          return cb(null, {
            body: JSON.stringify({
              message: result,
            }),
            statusCode: 500,
          });
        }

        cb(null, {
          body: JSON.stringify({
            _result: result,
            message: 'Access Token Retrieved',
          }),
          statusCode: 200,
        });
      });
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
