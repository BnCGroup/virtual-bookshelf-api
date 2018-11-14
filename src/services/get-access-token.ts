import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

import { OAuth } from 'oauth';

import IOptions from '../ioptions';

export default function getAccessToken(
  options: IOptions,
  event: APIGatewayEvent,
  context: Context,
  cb: Callback,
) {
  const requestBody = JSON.parse(event.body);

  if (
    !requestBody ||
    !requestBody.oauthToken ||
    !requestBody.oauthTokenSecret ||
    !requestBody.authorized
  ) {
    return cb(null, {
      body: JSON.stringify({
        message:
          'JSON body is required with `authorized`, `oauthToken`, and `oauthTokenSecret` keys',
      }),
      statusCode: 400,
    });
  }

  if (requestBody.authorized.toString() !== '1') {
    return cb(null, {
      body: JSON.stringify({
        message: 'You were not authorized',
      }),
      statusCode: 400,
    });
  }

  const oa = new OAuth(
    `${options.baseUrl}${options.requestTokenUrlPath}`,
    `${options.baseUrl}${options.accessTokenUrlPath}`,
    options.clientKey,
    options.clientSecret,
    options.oauthVersion,
    options.redirectUri,
    options.oauthEncryption,
  );

  oa.getOAuthAccessToken(
    requestBody.oauthToken,
    requestBody.oauthTokenSecret,
    requestBody.authorized,
    (err, accessToken, accessTokenSecret) => {
      if (err) {
        console.log(err);

        return cb(null, {
          body: JSON.stringify({
            message: `Error getting OAuth access token : ${JSON.stringify(
              err,
            )}`,
          }),
          statusCode: 500,
        });
      }

      cb(null, {
        body: JSON.stringify({
          message: 'Access Token Retrieved',
          result: {
            accessToken,
            accessTokenSecret,
            success: true,
          },
        }),
        statusCode: 200,
      });
    },
  );
}
