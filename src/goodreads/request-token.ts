import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

import Goodreads from 'goodreads';

export const handle: Handler = (
  _event: APIGatewayEvent,
  _context: Context,
  cb: Callback,
) => {
  const goodreadsClient = Goodreads.client({
    key: process.env.GOODREADS_CLIENT_KEY,
    secret: process.env.GOODREADS_CLIENT_SECRET,
  });

  goodreadsClient.requestToken((result, status?: number) => {
    if (status === 500) {
      return cb(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: result,
        }),
      });
    }

    cb(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Request Token Retrieved',
        result: {
          oauthToken: result.oauthToken,
          oauthTokenSecret: result.oauthTokenSecret,
        },
      }),
    });
  });
};
