import { createSignal, type Component } from 'solid-js';
import { useStore } from '../store';
import { filterTransactions } from '../utils';
import { Categorization } from '../types';

const Settings: Component = () => {
  const [state, { modifyCategorizations, updateTransaction }] = useStore();
  const [categorizationJson, setCategorizationJson] = createSignal('');

  const onEditEnd = event => {
    event?.preventDefault();
    console.log(categorizationJson());
    modifyCategorizations(JSON.parse(categorizationJson() ?? ''));
  };

  const applyCategorizations = event => {
    event?.preventDefault();
    const categorizations: Array<Categorization> = JSON.parse(categorizationJson());

    categorizations.forEach(cat => {
      const filteredTransactions = filterTransactions(cat.query, [...state.transactions]);
      filteredTransactions.forEach(trx => {
        updateTransaction(trx.id, cat.category, cat.factor);
      });
      console.log(filteredTransactions.length, 'transactions updated');
    });
  };

  return (
    <>
      <div class="w-full flex flex-col p-4 gap-8 items-end">
        <textarea
          class="p-2 w-full h-96 border border-black focus:outline-none"
          placeholder="content"
          value={JSON.stringify(state.categorizations ?? [], null, 2)}
          onInput={event => setCategorizationJson(event?.currentTarget.value)}
        />
        <div class="flex flex-row gap-4">
          <button onClick={onEditEnd}>save</button>
          <button onClick={applyCategorizations}>run</button>
        </div>
      </div>
    </>
  );
};

export default Settings;
