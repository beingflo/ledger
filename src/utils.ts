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
    const terms = searchTerm.split(' ');

    terms.forEach(term => {
      // Normal comparison
      if (term.startsWith('<<') || term.startsWith('>>')) {
        const value = term.slice(2);
        const num = Number(value);
        const moreThan = term[0] === '>';
        if (num === 0 || num) {
          filtered = filtered.filter(trx => {
            return moreThan ? trx.amount > num : trx.amount < num;
          });
        }
        // Absolute comparison
      } else if (term.startsWith('<') || term.startsWith('>')) {
        const value = term.slice(1);
        const num = Number(value);
        const moreThan = term[0] === '>';
        if (num === 0 || num) {
          filtered = filtered.filter(trx => {
            return moreThan ? Math.abs(trx.amount) > num : Math.abs(trx.amount) < num;
          });
        }
      } else {
        filtered = filtered.filter(
          trx =>
            trx.category?.toLowerCase().includes(term.toLowerCase()) ||
            trx.description?.toLowerCase().includes(term.toLowerCase()) ||
            trx.subject?.toLowerCase().includes(term.toLowerCase()),
        );
      }
    });
  }
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return filtered;
};
