import type { IBalanceService } from '.';
import type { INodeClient } from '$lib/services/node-client';
import { BALANCE_SERVICE_REFRESHING_INTERVAL_IN_MILLIS } from '$lib/constants';

export enum BalanceType {
  wallet = 'wallet',
  inOrders = 'inOrders',
  lockedInOrders = 'lockedInOrders'
}

type TReadableStream<T> = {
  getReader: () => ReadableStreamDefaultReader<T>;
};

type ReadableStreamBuilder<T> = (cb: () => Promise<any>) => TReadableStream<T>;

function readableStreamBuilder(cb: () => Promise<any>): ReadableStream {
  let interval: NodeJS.Timer;
  return new ReadableStream({
    start(controller: ReadableStreamDefaultController) {
      (async () => {
        try {
          const value = await cb();
          controller.enqueue(value);
        } catch {
          clearInterval(interval);
          controller.close();
        }
      })();
      interval = setInterval(async () => {
        try {
          const value = await cb();
          controller.enqueue(value);
        } catch {
          clearInterval(interval);
          controller.close();
        }
      }, BALANCE_SERVICE_REFRESHING_INTERVAL_IN_MILLIS);
    },

    cancel() {
      clearInterval(interval);
    }
  });
}

export class BalanceService implements IBalanceService {
  nodeClient: INodeClient;
  address: string;
  streamBuilder: ReadableStreamBuilder<any>;

  constructor(
    nodeClient: INodeClient,
    address: string,
    streamBuilder: ReadableStreamBuilder<any> = readableStreamBuilder
  ) {
    this.nodeClient = nodeClient;
    this.address = address;
    this.streamBuilder = streamBuilder;
  }

  subscribe(balanceType: BalanceType, assetId: string): ReadableStreamDefaultReader<bigint> {
    let readableStream: TReadableStream<bigint>;
    switch (balanceType) {
      case BalanceType.inOrders:
        readableStream = this.streamBuilder(() => Promise.resolve().then(() => 77));
        break;
      case BalanceType.lockedInOrders:
        readableStream = this.streamBuilder(() => Promise.resolve().then(() => 7));
        break;
      default:
        readableStream = this.streamBuilder(() =>
          this.nodeClient.getAddressBalance(this.address, assetId)
        );
    }

    return readableStream.getReader();
  }
}
