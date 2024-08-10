import { AwsClient } from 'aws4fetch';
import { setState } from './store';
import { State, Transaction } from './types';

const StateFile = 'ledger-state.json';

export const s3Sync = async (state: State) => {
  if (!state?.s3) {
    console.info('No credentials for syncing');
    return;
  }

  const aws = new AwsClient({
    accessKeyId: state?.s3?.apiKey,
    secretAccessKey: state?.s3?.apiSecretKey,
    service: 's3',
    region: state?.s3?.region,
  });

  console.info('Sync state');

  let remoteState = { transactions: [], categorizations: [] };
  const stateResponse = await aws.fetch(`${state?.s3?.endpoint}${StateFile}`, {
    method: 'GET',
    headers: { 'Cache-Control': 'no-store' },
  });
  if (stateResponse.ok) {
    remoteState = await stateResponse.json();
  }

  const [merged, newLocal, newRemote, droppedLocal, droppedRemote] = mergeState(
    state.transactions,
    remoteState.transactions,
  );

  setState({
    transactions: [...merged],
  });

  await aws.fetch(`${state?.s3?.endpoint}${StateFile}`, {
    method: 'PUT',
    body: JSON.stringify({
      transactions: merged,
    }),
  });

  return [newLocal, newRemote, droppedLocal, droppedRemote];
};

export const mergeState = (
  local = [],
  remote = [],
): [Array<Transaction>, number, number, number, number] => {
  const merged = [];
  let newLocal = 0;
  let newRemote = 0;
  let droppedLocal = 0;
  let droppedRemote = 0;

  // Add trx that are only remote
  remote?.forEach(trx => {
    if (!local?.find(l => l.id === trx.id)) {
      merged.push(trx);
      newRemote += 1;
    }
  });

  // Add trx that are only local
  local?.forEach(trx => {
    if (!remote?.find(t => t.id === trx.id)) {
      merged.push(trx);
      newLocal += 1;
    }
  });

  // From trx that appear in both, take the one that has been modified last
  local?.forEach(localTrx => {
    const remoteTrx = remote?.find(t => t.id === localTrx.id);
    if (remoteTrx) {
      if (localTrx?.modifiedAt < remoteTrx.modifiedAt) {
        merged.push(remoteTrx);
        console.info(`Dropping old local: ${JSON.stringify(localTrx)}`);
        droppedLocal += 1;
      } else if (localTrx.modifiedAt > remoteTrx.modifiedAt) {
        merged.push(localTrx);
        console.info(`Dropping old remote: ${JSON.stringify(remoteTrx)}`);
        droppedRemote += 1;
      } else {
        merged.push(localTrx);
      }
    }
  });

  return [merged, newLocal, newRemote, droppedLocal, droppedRemote];
};
