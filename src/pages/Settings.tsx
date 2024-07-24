import { createSignal, type Component } from 'solid-js';
import { useStore } from '../store';
import { filterTransactions } from '../utils';
import { Categorization } from '../types';

const Settings: Component = () => {
  const [state, { modifyCategorizations, updateTransactions }] = useStore();
  const [categorizationJson, setCategorizationJson] = createSignal(
    JSON.stringify(state.categorizations ?? [], null, 2),
  );

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
      updateTransactions(
        filteredTransactions?.map(trx => ({
          id: trx.id,
          category: cat.category,
          factor: cat.factor,
        })),
      );
      console.log(filteredTransactions.length, 'transactions updated');
    });
    console.log('done');
  };

  return (
    <>
      <div class="w-full flex flex-col p-4 gap-8 items-end">
        <textarea
          class="p-2 w-full h-96 border border-black focus:outline-none"
          placeholder="content"
          value={categorizationJson()}
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
