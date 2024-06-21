export type Screens = 'help' | 'config' | 'app' | 'feedback';

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  originalAmount?: number;
  originalCurrency?: string;
  exchangeRate?: number;
  description: string;
  subject?: string;
  originalCategory: string;
  category?: string;
  tags?: string;
  wise: string;
  spaces: string;
  importedAt: string;
  factor: number;
};

export type S3Data = {
  endpoint: string;
  region: string;
  apiKey: string;
  apiSecretKey: string;
};

export type State = {
  screen: Screens;
  transactions: Array<Transaction>;
  s3?: S3Data;
};
