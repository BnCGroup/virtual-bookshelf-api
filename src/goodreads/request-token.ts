import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

export const handle: Handler = (
  _event: APIGatewayEvent,
  _context: Context,
  cb: Callback,
) => {
 cb(null, {statusCode: 200, body: JSON.stringify({message: 'Success'})});
};
