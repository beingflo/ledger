import {
  For,
  Show,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  type Component,
} from 'solid-js';
import { mapCSV, validateEvent } from '../utils';
import { useStore } from '../store';
import { tinykeys } from 'tinykeys';
import { Transaction } from '../types';

const Transactions: Component = () => {
  const [state, { importTransactions, updateTransaction }] = useStore();
  const [searchTerm, setSearchTerm] = createSignal('');
  const [editFactorIdx, setEditFactorIdx] = createSignal(null);
  const [editCategoryIdx, setEditCategoryIdx] = createSignal(null);
  const [newFactorValue, setNewFactorValue] = createSignal('');
  const [newCategoryValue, setNewCategoryValue] = createSignal('');
  let ref;
  let searchInputRef;
  let categoryInputRef;
  let factorInputRef;

  const filteredTransactions = createMemo((): Array<Transaction> => {
    let filtered = [...state.transactions];
    if (searchTerm()) {
      filtered = state.transactions.filter(
        trx =>
          trx.category?.toLowerCase().includes(searchTerm().toLowerCase()) ||
          trx.description?.toLowerCase().includes(searchTerm().toLowerCase()) ||
          trx.subject?.toLowerCase().includes(searchTerm().toLowerCase()),
      );
    }
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return filtered;
  });

  const aggregations = createMemo(() => {
    if (searchTerm()) {
      return {
        num: filteredTransactions().length,
        total: filteredTransactions()
          .map(t => t.amount)
          .reduce((a, b) => a + b, 0),
        avg:
          filteredTransactions()
            .map(t => t.amount)
            .reduce((a, b) => a + b, 0) / (filteredTransactions().length || 1),
      };
    }
    return null;
  });

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

  const cleanup = tinykeys(window, {
    '$mod+k': validateEvent(() => {
      searchInputRef.focus();
    }),
    Escape: () => {
      setEditCategoryIdx(null);
      setEditFactorIdx(null);
      searchInputRef.blur();
    },
  });

  onCleanup(cleanup);

  const onEditCategoryEnd = event => {
    event?.preventDefault();
    updateTransaction(editCategoryIdx(), newCategoryValue(), null);
    setEditCategoryIdx(null);
  };

  const onEditFactoryEnd = event => {
    event?.preventDefault();
    const num = Number(newFactorValue());

    if (num >= -1 && num <= 1) {
      updateTransaction(editFactorIdx(), null, num);
      setEditFactorIdx(null);
    }
  };

  return (
    <>
      <div class="w-full max-w-8xl mx-auto flex flex-col gap-0.5 p-4">
        <form onSubmit={event => event.preventDefault()}>
          <input
            type="text"
            ref={searchInputRef}
            class="focus:outline-none w-full text-md placeholder:font-thin block mb-4 border-0 focus:ring-0"
            placeholder="Search"
            value={searchTerm()}
            onInput={event => {
              setSearchTerm(event?.currentTarget?.value);
            }}
          />
        </form>
        <Show when={aggregations()}>
          <div class="flex flex-row gap-4 mb-4">
            <span>number: {aggregations()?.num}</span>
            <span class={aggregations()?.total < 0 ? 'text-red-600' : 'text-green-600'}>
              total: CHF {aggregations()?.total.toFixed(2)}
            </span>
            <span class={aggregations()?.avg < 0 ? 'text-red-600' : 'text-green-600'}>
              average: CHF {aggregations()?.avg.toFixed(2)}
            </span>
          </div>
        </Show>
        <For each={filteredTransactions()}>
          {transaction => (
            <div
              class={
                'w-full text-sm text-gray-500 grid grid-cols-8 gap-8 py-1 ' +
                (!transaction.category && 'bg-red-50')
              }
            >
              <span class="text-gray-700">{transaction.date}</span>
              <span class="col-span-2">{transaction.description}</span>
              <span class="col-span-2">{transaction.subject}</span>
              <span
                class={
                  'text-right ' +
                  (transaction.amount < 0 ? 'text-red-600' : 'text-green-600')
                }
              >
                CHF {transaction.amount.toFixed(2)}
              </span>
              <Show
                when={editCategoryIdx() === transaction.id}
                fallback={
                  <span
                    class="cursor-pointer"
                    onClick={() => {
                      setEditCategoryIdx(transaction.id);
                      categoryInputRef.focus();
                    }}
                  >
                    {transaction.category || 'uncategorized'}
                  </span>
                }
              >
                <form onSubmit={onEditCategoryEnd}>
                  <input
                    autofocus
                    class="w-full"
                    ref={categoryInputRef}
                    value={transaction.category}
                    onInput={event => setNewCategoryValue(event?.currentTarget.value)}
                  />
                </form>
              </Show>
              <Show
                when={editFactorIdx() === transaction.id}
                fallback={
                  <span
                    class="text-right cursor-pointer"
                    onClick={() => {
                      setEditFactorIdx(transaction.id);
                      factorInputRef.focus();
                    }}
                  >
                    {transaction?.factor?.toFixed(1)}
                  </span>
                }
              >
                <form onSubmit={onEditFactoryEnd}>
                  <input
                    autofocus
                    ref={factorInputRef}
                    class="text-right w-full"
                    value={transaction.factor}
                    onInput={event => setNewFactorValue(event?.currentTarget.value)}
                  />
                </form>
              </Show>
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
