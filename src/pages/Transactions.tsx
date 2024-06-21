import { For, onMount, type Component } from 'solid-js';
import { mapCSV } from '../utils';
import { useStore } from '../store';

const Transactions: Component = () => {
  const [state, { importTransactions }] = useStore();
  let ref;

  onMount(() => {
    ref.addEventListener('change', () => {
      const reader = new FileReader();
      reader.onload = evt => {
        const trx = mapCSV(evt.target.result as string);
        importTransactions(trx);
      };
      reader.readAsText(ref.files[0]);
    });
  });

  return (
    <>
      <div class="w-full max-w-8xl mx-auto flex flex-col gap-4 p-4">
        <For each={state.transactions}>
          {transaction => (
            <div class="w-full text-sm text-gray-600 grid grid-cols-4 gap-2">
              <span>{transaction.date}</span>
              <span>{transaction.amount} CHF</span>
              <span>{transaction.description}</span>
              <span>{transaction.subject}</span>
            </div>
          )}
        </For>
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
