import { createContext, createEffect, useContext } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { Screens, State, Transaction } from './types';
import { getNewId } from './utils';

export const storeName = 'store';

const StoreContext = createContext({});

const localState: string = localStorage.getItem(storeName);

const parsedState: State = localState
  ? (JSON.parse(localState) as State)
  : { screen: 'help', transactions: [], scripts: [] };

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
        // TODO deduplicate
        setState({
          transactions: [...(state.transactions ?? []), ...trx],
        });
      },
      updateTransaction(id: string, category: string, factor: number) {
        setState(
          produce((state: State) => {
            state.transactions.forEach(trx => {
              if (trx.id === id) {
                if (category) trx.category = category;
                if (factor === 0 || factor) trx.factor = factor;
              }
            });
          }),
        );
      },
      addScript(name: string, content: string) {
        setState({
          scripts: [
            ...(state.scripts ?? []),
            {
              id: getNewId(),
              name,
              content,
              createdAt: Date.now(),
              modifiedAt: Date.now(),
            },
          ],
        });
      },
      modifyScript(id: string, name: string, content: string) {
        setState(
          produce((state: State) => {
            state.scripts.forEach(script => {
              if (script.id === id) {
                script.name = name;
                script.content = content;
                script.modifiedAt = Date.now();
              }
            });
          }),
        );
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
