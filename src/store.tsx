import { createContext, createEffect, useContext } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { Categorization, S3Data, Screens, State, Transaction } from './types';
import { s3Sync } from './s3-utils';
import { setEphemeralStore } from './EphemeralStore';

export const storeName = 'store';

const StoreContext = createContext({});

const localState: string = localStorage.getItem(storeName);

const parsedState: State = localState
  ? (JSON.parse(localState) as State)
  : { screen: 'help', transactions: [], categorizations: [] };

export const [state, setState] = createStore(parsedState);

export function StoreProvider(props) {
  createEffect(() => localStorage.setItem(storeName, JSON.stringify(state)));

  const store = [
    state,
    {
      cycleScreen(screen: Screens) {
        const currentScreen = state.screen;
        let newScreen: Screens = 'app';
        if (currentScreen !== screen) {
          newScreen = screen;
        }
        setState({ screen: newScreen });
      },
      importTransactions(trx: Array<Transaction>) {
        const newTransactions = trx.filter(t => {
          const sameDay = state.transactions.filter(st => st.date === t.date);
          const sameAmount = sameDay.filter(st => st.amount === t.amount);
          const sameDescription = sameAmount.find(st => st.description === t.description);

          if (sameDescription) {
            console.log(`skipping duplicate: ${t.date}, ${t.description}, ${t.amount}`);
          }
          return !sameDescription;
        });
        setState({
          transactions: [...(state.transactions ?? []), ...newTransactions],
        });
      },
      updateTransaction(id: string, category: string, factor: number) {
        setState(
          produce((state: State) => {
            state.transactions.forEach(trx => {
              if (trx.id === id) {
                if (category) trx.category = category;
                if (factor === 0 || factor) trx.factor = factor;
                trx.modifiedAt = Date.now();
              }
            });
          }),
        );
      },
      updateTransactions(
        transactions: Array<{ id: string; category: string; factor: number }>,
      ) {
        setState(
          produce((state: State) => {
            transactions.forEach(tr => {
              state.transactions.forEach(trx => {
                if (trx.id === tr.id) {
                  if (tr.category) trx.category = tr.category;
                  if (tr.factor === 0 || tr.factor) trx.factor = tr.factor;
                }
              });
            });
          }),
        );
      },
      modifyCategorizations(categorizations: Array<Categorization>) {
        setState({
          categorizations,
        });
      },
      setS3Config(config: S3Data) {
        setState({ s3: config });
      },
      async syncState() {
        const [newLocal, newRemote, droppedLocal, droppedRemote] = await s3Sync(state);

        setTimeout(() => setEphemeralStore({ showToast: false }), 4000);

        setEphemeralStore({
          new: [newLocal, newRemote] ?? [0, 0],
          dropped: [droppedLocal, droppedRemote] ?? [0, 0],
          showToast: true,
        });
      },
    },
  ];

  return <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext) as [
    State,
    { [key: string]: (data?: unknown, ...args) => unknown },
  ];
}
