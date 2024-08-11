import { createMemo, type Component } from 'solid-js';
import * as Plot from '@observablehq/plot';
import { useStore } from '../store';

const Income: Component = () => {
  const [state] = useStore();

  const income = createMemo(() =>
    state.transactions
      .filter(trx => trx.amount > 0)
      .map(trx => ({ ...trx, amount: trx.amount * trx.factor })),
  );

  return (
    <div class="w-full flex flex-row gap-4 p-4 pt-2 justify-center">
      {Plot.plot({
        margin: 80,
        marks: [
          Plot.rectY(income(), {
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

export default Income;
