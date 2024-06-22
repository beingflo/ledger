import { For, Show, createMemo, createSignal, onCleanup, type Component } from 'solid-js';
import { useStore } from '../store';
import { tinykeys } from 'tinykeys';
import { validateEvent } from '../utils';
import { Script } from '../types';

const Settings: Component = () => {
  const [state, { addScript, modifyScript }] = useStore();
  const [newScriptName, setNewScriptName] = createSignal(null);
  const [newScriptContent, setNewScriptContent] = createSignal(null);
  const [newScript, setNewScript] = createSignal(false);
  const [editIdx, setEditIdx] = createSignal(null);

  let inputRef;

  const cleanup = tinykeys(window, {
    n: validateEvent(() => setNewScript(true)),
    '$mod+Enter': () => onEditEnd(null),
    Escape: () => {
      setNewScript(false);
      setEditIdx(false);
      setNewScriptName(null);
      setNewScriptContent(null);
    },
  });

  onCleanup(cleanup);

  const onEditEnd = event => {
    event?.preventDefault();
    if (newScript()) {
      addScript(newScriptName(), newScriptContent());
      setNewScript(false);
    } else {
      modifyScript(editIdx(), newScriptName(), newScriptContent());
      setEditIdx(null);
    }
    setNewScriptName(null);
    setNewScriptContent(null);
  };

  const onEdit = (script: Script) => {
    setEditIdx(script.id);
    setNewScriptName(script.name);
    setNewScriptContent(script.content);
  };

  const sortedScripts = createMemo((): Array<Script> => {
    const scripts = [...state.scripts];
    scripts.sort((a, b) => b.createdAt - a.createdAt);
    return scripts;
  });

  return (
    <>
      <div class="w-full grid grid-cols-12 p-4 gap-2 group">
        <Show when={newScript()}>
          <div class="flex flex-row gap-2 text-sm font-light col-span-12 md:col-span-4 underline-offset-4">
            <form onSubmit={onEditEnd} class="w-full">
              <input
                autofocus
                class="w-full border border-dashed border-gray-400 focus:outline-none"
                placeholder="description"
                ref={inputRef}
                value={''}
                onInput={event => setNewScriptName(event?.currentTarget.value)}
              />
            </form>
          </div>
          <div class="text-sm font-light text-left col-span-12 md:col-span-8">
            <form onSubmit={onEditEnd} class="w-full">
              <textarea
                class="w-full h-24 border border-dashed border-gray-400 focus:outline-none"
                placeholder="content"
                value={''}
                onInput={event => setNewScriptContent(event?.currentTarget.value)}
              />
            </form>
          </div>
        </Show>
        <For each={sortedScripts()}>
          {script => (
            <>
              <div class="flex flex-row gap-2 text-sm font-light col-span-12 md:col-span-4 underline-offset-4">
                <Show
                  when={editIdx() === script.id}
                  fallback={
                    <div class="w-full" onClick={() => onEdit(script)}>
                      {script.name}
                    </div>
                  }
                >
                  <form onSubmit={onEditEnd} class="w-full">
                    <input
                      autofocus
                      class="w-full border border-dashed border-gray-400 focus:outline-none"
                      placeholder="description"
                      ref={inputRef}
                      value={script.name}
                      onInput={event => setNewScriptName(event?.currentTarget.value)}
                    />
                  </form>
                </Show>
              </div>
              <div class="text-sm font-light text-left col-span-12 md:col-span-8">
                <Show
                  when={editIdx() === script.id}
                  fallback={
                    <div
                      class="w-full whitespace-pre-wrap break-words"
                      onClick={() => onEdit(script)}
                    >
                      {script.content}
                    </div>
                  }
                >
                  <form onSubmit={onEditEnd} class="w-full">
                    <textarea
                      class="w-full h-24 border border-dashed border-gray-400 focus:outline-none"
                      placeholder="content"
                      value={script.content}
                      onInput={event => setNewScriptContent(event?.currentTarget.value)}
                    />
                  </form>
                </Show>
              </div>
            </>
          )}
        </For>
      </div>
    </>
  );
};

export default Settings;
