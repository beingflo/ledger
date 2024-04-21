export type Screens = 'help' | 'config' | 'app' | 'feedback';

export type S3Data = {
  endpoint: string;
  region: string;
  apiKey: string;
  apiSecretKey: string;
};

export type State = {
  screen: Screens;
  s3?: S3Data;
};
