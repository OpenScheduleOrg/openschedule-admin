export type CredentialModel = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export type TokenResult = {
  access_token: string;
  session_token?: string;
};
