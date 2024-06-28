import { For, Show, createMemo, createSignal, onCleanup, type Component } from 'solid-js';
import { useStore } from '../store';
import { tinykeys } from 'tinykeys';
import { validateEvent } from '../utils';

const Settings: Component = () => {
  const [state] = useStore();

  return (
    <>
      <div class="w-full grid grid-cols-12 p-4 gap-2 gap-y-8">test</div>
      <details>
        <summary>test</summary>
        Hello there
      </details>
    </>
  );
};

export default Settings;
