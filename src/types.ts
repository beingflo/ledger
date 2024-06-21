export type Screens = 'help' | 'config' | 'app' | 'feedback';

export type Transaction = {
  date: string;
  amount: number;
  originalAmount?: number;
  originalCurrency?: string;
  exchangeRate?: number;
  description: string;
  subject?: string;
  category: string;
  tags?: string;
  wise: string;
  spaces: string;
};

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
