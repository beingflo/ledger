import { RouteSectionProps, useLocation } from '@solidjs/router';
import { type Component } from 'solid-js';

const Settings: Component = (props: RouteSectionProps) => {
  const location = useLocation();

  return (
    <>
      <div class="w-full flex flex-row gap-4 p-4 pt-2">
        <a
          class={location.pathname.startsWith('/settings/categories') && 'underline'}
          href="/settings/categories"
        >
          categories
        </a>
        <a
          class={location.pathname.startsWith('/settings/scripts') && 'underline'}
          href="/settings/scripts"
        >
          scripts
        </a>
      </div>
      {props.children}
    </>
  );
};

export default Settings;
