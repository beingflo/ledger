import { createSignal, type Component } from 'solid-js';
import { useStore } from '../store';

const Settings: Component = () => {
  const [state, { modifyCategorizations }] = useStore();
  const [categorizationJson, setCategorizationJson] = createSignal('');

  const onEditEnd = event => {
    event?.preventDefault();
    console.log(categorizationJson());
    modifyCategorizations(JSON.parse(categorizationJson() ?? ''));
  };

  return (
    <>
      <div class="w-full flex flex-col p-4 gap-8 items-start">
        <textarea
          class="w-full h-96 border border-dashed border-gray-400 focus:outline-none"
          placeholder="content"
          value={JSON.stringify(state.categorizations ?? [])}
          onInput={event => setCategorizationJson(event?.currentTarget.value)}
        />
        <button onClick={onEditEnd}>save</button>
      </div>
    </>
  );
};

export default Settings;
