import { createEffect, createSignal, onMount, type Component } from 'solid-js';
import { mapCSV } from '../utils';

const Transactions: Component = () => {
  const [transactions, setTransactions] = createSignal([]);
  let ref;

  onMount(() => {
    ref.addEventListener('change', () => {
      const reader = new FileReader();
      reader.onload = evt => {
        const trx = mapCSV(evt.target.result as string);
        setTransactions(trx);
      };
      reader.readAsText(ref.files[0]);
    });
  });

  createEffect(() => console.log(transactions()));

  return (
    <>
      <div class="w-full max-w-8xl mx-auto grid grid-cols-12 gap-4 p-4 pt-2">
        transactions
      </div>
      <div class="fixed bottom-2 right-4 font-light text-sm">
        <label class="cursor-pointer" for="file">
          import
        </label>
        <input ref={ref} type="file" id="file" class="hidden" />
      </div>
    </>
  );
};

export default Transactions;
