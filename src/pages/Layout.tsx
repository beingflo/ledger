import { RouteSectionProps, useLocation } from '@solidjs/router';
import { type Component } from 'solid-js';

const Layout: Component = (props: RouteSectionProps) => {
  const location = useLocation();

  return (
    <>
      <div class="w-full flex flex-row gap-4 p-4 pb-2">
        <a class={location.pathname === '/' && 'underline'} href="/">
          transactions
        </a>
        <a
          class={location.pathname.startsWith('/analyze') && 'underline'}
          href="/analyze/spending"
        >
          analyze
        </a>
        <a
          class={location.pathname.startsWith('/settings') && 'underline'}
          href="/settings"
        >
          settings
        </a>
      </div>
      {props.children}
    </>
  );
};

export default Layout;
