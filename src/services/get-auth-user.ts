import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

import { OAuth } from 'oauth';
import * as Xml2Js from 'xml2js';

import IOptions from '../ioptions';

export default function getAuthUser(
  options: IOptions,
  event: APIGatewayEvent,
  context: Context,
  cb: Callback,
) {
  const requestBody = JSON.parse(event.body);

  console.error(requestBody);

  if (
    !requestBody ||
    !requestBody.accessToken ||
    !requestBody.accessTokenSecret
  ) {
    return cb(null, {
      body: JSON.stringify({
        message:
          'JSON body is required with `accessToken` and `accessTokenSecret` keys',
      }),
      statusCode: 400,
    });
  }

  const oa = new OAuth(
    `${options.baseUrl}${options.requestTokenUrlPath}`,
    `${options.baseUrl}${options.accessTokenUrlPath}`,
    options.clientSecret,
    options.oauthVersion,
    options.oauthVersion,
    options.redirectUri,
    options.oauthEncryption,
  );

  oa.get(
    `${options.baseUrl}/api/auth_user`,
    requestBody.accessToken,
    requestBody.accessTokenSecret,
    (err, data, response) => {
      if (err) {
        return cb(null, {
          body: JSON.stringify({
            message: `Error getting User : ${JSON.stringify(err)}`,
          }),
          statusCode: 500,
        });
      }

      const parser = new Xml2Js.Parser();

      parser.parseString(data.toString());

      parser.on('end', result => {
        cb(null, {
          body: JSON.stringify({
            message: 'User Retrieved',
            result,
          }),
          statusCode: 200,
        });
      });
    },
  );
}
