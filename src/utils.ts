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
        importedAt: Date.now(),
        modifiedAt: Date.now(),
        factor: 1.0,
      });
    }
  });

  return transactions;
};

export const filterTransactions = (
  searchTerm: string,
  transactions: Array<Transaction>,
): Array<Transaction> => {
  let filtered = transactions;
  if (searchTerm) {
    filtered = transactions.filter(
      trx =>
        trx.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.subject?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return filtered;
};
