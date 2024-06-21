import { createContext, createEffect, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Screens, State, Transaction } from './types';

export const storeName = 'store';

const StoreContext = createContext({});

const localState: string = localStorage.getItem(storeName);

const parsedState: State = localState
  ? (JSON.parse(localState) as State)
  : { screen: 'help', transactions: [] };

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
    },
  ];

  return <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext) as [
    State,
    { [key: string]: (data?: unknown) => unknown },
  ];
}
