import { Match, Show, Switch, onCleanup, type Component } from 'solid-js';
import { validateEvent } from './utils';
import { tinykeys } from 'tinykeys';
import { useStore } from './store';
import { ephemeralStore } from './EphemeralStore';
import Configuration from './pages/Configuration';
import Help from './pages/Help';
import { Feedback } from './pages/Feedback';
import { Route, Router } from '@solidjs/router';
import Layout from './pages/Layout';
import Transactions from './pages/Transactions';
import Analyze from './pages/Analyze';
import Settings from './pages/Settings';
import Spending from './pages/Spending';
import Income from './pages/Income';
import Balance from './pages/Balance';

const App: Component = () => {
  const [state, { cycleScreen }] = useStore();

  const cleanup = tinykeys(window, {
    h: validateEvent(() => cycleScreen('help')),
    c: validateEvent(() => cycleScreen('config')),
    f: validateEvent(() => cycleScreen('feedback')),
  });

  onCleanup(cleanup);

  return (
    <Switch
      fallback={
        <>
          <Router root={Layout}>
            <Route path="/" component={Transactions} />
            <Route path="/analyze" component={Analyze}>
              <Route path="/" />
              <Route path="/spending" component={Spending} />
              <Route path="/income" component={Income} />
              <Route path="/balance" component={Balance} />
            </Route>
            <Route path="/settings" component={Settings} />
          </Router>
          <Show when={ephemeralStore.showToast}>
            <div class="fixed bottom-0 right-0 grid gap-x-2 grid-cols-2 bg-white p-2 font-light text-sm">
              <p class="text-right">new</p>
              <p>
                {ephemeralStore?.new[0]} local, {ephemeralStore?.new[1]} remote
              </p>
              <p class="text-right">old</p>
              <p>
                {ephemeralStore?.dropped[0]} local, {ephemeralStore?.dropped[1]} remote
              </p>
            </div>
          </Show>
        </>
      }
    >
      <Match when={state.screen === 'help'}>
        <Help />
      </Match>
      <Match when={state.screen === 'config'}>
        <Configuration />
      </Match>
      <Match when={state.screen === 'feedback'}>
        <Feedback />
      </Match>
    </Switch>
  );
};

export default App;
