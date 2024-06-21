import { RouteSectionProps, useLocation } from '@solidjs/router';
import { type Component } from 'solid-js';

const Layout: Component = (props: RouteSectionProps) => {
  const location = useLocation();

  return (
    <>
      <div class="w-full flex flex-row gap-4 p-2 md:p-4">
        <a class={location.pathname === '/' && 'underline'} href="/">
          transactions
        </a>
        <a class={location.pathname === '/analyze' && 'underline'} href="/analyze">
          analyze
        </a>
        <a class={location.pathname === '/settings' && 'underline'} href="/settings">
          settings
        </a>
      </div>
      {props.children}
    </>
  );
};

export default Layout;
