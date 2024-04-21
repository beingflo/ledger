import { Match, Show, Switch, onCleanup, type Component } from 'solid-js';
import { validateEvent } from './utils';
import { tinykeys } from 'tinykeys';
import { useStore } from './store';
import { ephemeralStore } from './EphemeralStore';
import Configuration from './Configuration';
import Help from './Help';
import { Feedback } from './Feedback';

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
          <div class="w-full max-w-8xl mx-auto grid grid-cols-12 gap-4 p-2 md:p-4">
            ledger
          </div>
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
