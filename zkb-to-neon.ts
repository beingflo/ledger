const file = Bun.file('./zkb_account_statement.csv');

const contents = await file.text();

const lines = contents.split('\n').slice(1);

const zkb = [];

lines.forEach(l => {
  const values = l.split(';').map(value => value.slice(1, value.length - 1));
  if (values.length <= 1) return;
  const trx: ZKBTransaction = {
    date: values[0],
    booking_text: values[1],
    curr: values[2],
    amount_details: values[3],
    zkb_ref: values[4],
    reference_number: values[5],
    debit_chf: values[6],
    credit_chf: values[7],
    value_date: values[8],
    balance_chf: values[9],
    payment_purpose: values[10],
    details: values[11],
  };
  zkb.push(trx);
});

const neon: Array<NeonTransaction> = zkb.map((trx: ZKBTransaction) => {
  const dateParts = trx.date.split('.');
  return {
    //change this
    date: `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`,
    amount: trx.credit_chf || `-${trx.debit_chf}`,
    original_amount: '',
    original_currency: '',
    exchange_rate: '',
    description: trx.booking_text,
    subject: '',
    category: '',
    tags: '',
    wise: '',
    spaces: '',
  };
});

type ZKBTransaction = {
  date: string;
  booking_text: string;
  curr: string;
  amount_details: string;
  zkb_ref: string;
  reference_number: string;
  debit_chf: string;
  credit_chf: string;
  value_date: string;
  balance_chf: string;
  payment_purpose: string;
  details: string;
};

type NeonTransaction = {
  date: string;
  amount: string;
  original_amount?: string;
  original_currency?: string;
  exchange_rate?: string;
  description: string;
  subject?: string;
  category?: string;
  tags?: string;
  wise?: string;
  spaces?: string;
};

neon.forEach((n: NeonTransaction) => {
  console.log(
    `"${n.date}";"${n.amount}";"${n.original_amount}";"${n.original_currency}";"${n.exchange_rate}";"${n.description}";"${n.subject}";"${n.category}";"${n.tags}";"${n.wise}";"${n.spaces}"`,
  );
});

export {};
