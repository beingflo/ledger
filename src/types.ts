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
  importedAt: number;
  modifiedAt: number;
  factor: number;
};

export type Categorization = {
  id: string;
  name: string;
  query: string;
  category: string;
  factor: number;
  createdAt: number;
  modifiedAt: number;
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
  categorizations: Array<Categorization>;
  s3?: S3Data;
};
