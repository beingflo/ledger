import { RouteSectionProps, useLocation } from '@solidjs/router';
import { type Component } from 'solid-js';

const Analyze: Component = (props: RouteSectionProps) => {
  const location = useLocation();

  return (
    <>
      <div class="w-full flex flex-row gap-4 p-4 pt-2">
        <a
          class={location.pathname.startsWith('/analyze/spending') && 'underline'}
          href="/analyze/spending"
        >
          spending
        </a>
        <a
          class={location.pathname.startsWith('/analyze/income') && 'underline'}
          href="/analyze/income"
        >
          income
        </a>
        <a
          class={location.pathname.startsWith('/analyze/balance') && 'underline'}
          href="/analyze/balance"
        >
          balance
        </a>
      </div>
      {props.children}
    </>
  );
};

export default Analyze;
