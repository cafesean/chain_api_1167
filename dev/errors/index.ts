import { getReasonPhrase } from 'http-status-codes';

export { StatusCodes } from 'http-status-codes';

export const INVALID_ACCOUNT = 1001;

export function getErrorPhrase(code: number) {
  if (code < 1000) {
    return getReasonPhrase(code);
  }

  switch (code) {
    case INVALID_ACCOUNT:
      return 'invalid account';
  }
  return 'service error';
}

class AppError extends Error {
  errCode: number;
  errData?: any;

  constructor(code: number, data?: any) {
    super();
    this.errCode = code;
    this.errData = data;
  }

  get code(): number {
    return this.errCode;
  }

  get message(): string {
    return getErrorPhrase(this.errCode);
  }

  get data(): any {
    return this.errData;
  }
}

export function create(code: number, data?: any) {
  return new AppError(code, data);
}
