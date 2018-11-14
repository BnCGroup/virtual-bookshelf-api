export default interface IOptions {
  clientKey: string;
  clientSecret: string;
  redirectUri: string;

  baseUrl: string;
  oauthEncryption: string;
  oauthVersion: string;

  requestTokenUrlPath: string;
  accessTokenUrlPath: string;
}
