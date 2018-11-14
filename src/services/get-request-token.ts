import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

import { OAuth } from 'oauth';

import IOptions from '../ioptions';

export default function getRequestToken(
  options: IOptions,
  event: APIGatewayEvent,
  context: Context,
  cb: Callback,
) {
  const oa = new OAuth(
    `${options.baseUrl}${options.requestTokenUrlPath}`,
    `${options.baseUrl}${options.accessTokenUrlPath}`,
    options.clientKey,
    options.clientSecret,
    options.oauthVersion,
    options.redirectUri,
    options.oauthEncryption,
  );

  oa.getOAuthRequestToken((err, oauthToken, oauthTokenSecret) => {
    if (err) {
      console.log(err);

      return cb(null, {
        body: JSON.stringify({
          message: `Error getting OAuth request token : ${JSON.stringify(err)}`,
        }),
        statusCode: 500,
      });
    }

    return cb(null, {
      body: JSON.stringify({
        message: 'Request Token Retrieved',
        result: {
          authorizeUrl: `${
            options.baseUrl
          }/oauth/authorize?oauth_token=${oauthToken}&oauth_callback=${
            options.redirectUri
          }`,
          oauthToken,
          oauthTokenSecret,
        },
      }),
      statusCode: 200,
    });
  });
}
