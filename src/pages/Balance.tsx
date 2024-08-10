import { createMemo, type Component } from 'solid-js';
import * as Plot from '@observablehq/plot';
import { useStore } from '../store';

const Balance: Component = () => {
  const [state] = useStore();

  const spending = createMemo(() =>
    state.transactions
      .filter(trx => trx.category)
      .map(trx => ({ ...trx, amount: trx.amount * trx.factor })),
  );

  return (
    <div class="w-full flex flex-row gap-4 p-4 pt-2 justify-center">
      {Plot.plot({
        margin: 80,
        marks: [
          Plot.rectY(spending(), {
            x: d => new Date(d.date),
            y: 'amount',
            interval: 'month',
            tip: true,
            fill: 'category',
          }),
        ],
      })}
    </div>
  );
};

export default Balance;
