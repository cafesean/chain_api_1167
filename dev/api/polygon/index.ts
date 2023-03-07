import * as scan from './scan';

export { default as Response } from './response';

export default class PolygonClient {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {

  }

  async scanTransaction(txnHash: string): Promise<number> {
    try {
      return await scan.scanTransaction(this.baseUrl, this.apiKey, txnHash);
    } catch (err) {
      // ignore the error
    }
    return -1;
  }

  async scanGasTrackerPrice(level: number = 1): Promise<number> {
    try {
      return await scan.scanGasTrackerPrice(this.baseUrl, this.apiKey, level);
    } catch (err) {
      // ignore the error
    }
    return -1;
  }
}
