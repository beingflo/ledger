import { Transaction } from './types';

// Execute callback function if event did not target an input
export const validateEvent = (callback: () => void) => (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
    event.preventDefault();
    callback();
  }
};

export const getNewId = () => crypto.randomUUID();

export const dateToISOLocal = (date: Date): string => {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const msLocal = date.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  const iso = dateLocal.toISOString();
  const isoLocal = iso.slice(0, 19);
  return isoLocal;
};

export const mapCSV = (csv: string): Array<Transaction> => {
  const lines = csv.split('\n').slice(1);
  const transactions: Array<Transaction> = [];

  lines.forEach(line => {
    const values = line.split(';').map(value => value.slice(1, value.length - 1));
    if (values[0] && values[1]) {
      transactions.push({
        id: getNewId(),
        date: values[0],
        amount: Number(values[1]),
        originalAmount: Number(values[2]),
        originalCurrency: values[3],
        exchangeRate: Number(values[4]),
        description: values[5],
        subject: values[6],
        originalCategory: values[7],
        tags: values[8],
        wise: values[9],
        spaces: values[10],
        category: '',
        importedAt: new Date().toDateString(),
        factor: 1.0,
      });
    }
  });

  return transactions;
};
