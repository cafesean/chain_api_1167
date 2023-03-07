import axios from 'axios';

import type PolygonResponse from './response.js';

export async function scanTransaction(
  baseUrl: string,
  apiKey: string,
  txnHash: string
): Promise<number> {
  const url = `${baseUrl}/api?module=transaction&action=gettxreceiptstatus&txhash=${txnHash}&apikey=${apiKey}`;
  const { data } = await axios.get<PolygonResponse<{
    status: string,
  }>>(url);

  if (data.status !== '1') {
    throw new Error(data.message);
  }

  if (data.result?.status === "0") {
    return 0;
  } else if (data.result?.status === "1") {
    return 1;
  }
  return -1;
}

/**
 * Scan the gas price from PolygonScan
 *
 * @param baseUrl PolygonScan base url
 * @param apiKey PolygonScan api key
 * @param level 0: SafeGasPrice, 1: ProposeGasPrice, 2: FastGasPrice
 * @returns gas price in gwei
 */
export async function scanGasTrackerPrice(
  baseUrl: string,
  apiKey: string,
  level: number = 1,
): Promise<number> {
  if (baseUrl !== 'https://api.polygonscan.com') {
    return -1;
  }
  const url = `${baseUrl}/api?module=gastracker&action=gasoracle&apikey=${apiKey}`;
  const { data } = await axios.get<PolygonResponse<{
    FastGasPrice: number;
    ProposeGasPrice: number;
    SafeGasPrice: number;
    status: string,
  }>>(url);
  if (data.status !== '1') {
    throw new Error(data.message);
  }
  /*
  data = {
    "status": "1",
    "message": "OK",
    "result": {
      "LastBlock": "12913523",
      "SafeGasPrice": "100",
      "ProposeGasPrice": "120",
      "FastGasPrice": "140"
    }
  }
   */

  // check the result
  if (data.result) {
    let gasPrice = data.result.SafeGasPrice + 10;
    if (level === 1) {
      if (gasPrice < data.result.ProposeGasPrice) {
        gasPrice = data.result.ProposeGasPrice;
      }
    } else if (level >= 2) {
      if (gasPrice < data.result.FastGasPrice) {
        gasPrice = data.result.FastGasPrice;
      }
    }
    return gasPrice
  }

  return -1;
}
