import { FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

import { getStatusCode } from 'http-status-codes';

import * as errors from '../errors';

function response(this: FastifyReply, code: number = errors.StatusCodes.OK, message?: string, data?: any): void {
  this.send({
    code,
    message: message === undefined ? errors.getErrorPhrase(code) : message,
    data
  });
}

function error(this: FastifyReply, err?: any): void {
  if (err === undefined) {
    this.response(errors.StatusCodes.INTERNAL_SERVER_ERROR);
    return;
  }

  if (typeof err['statusCode'] === 'string') {
    this.response(err.statusCode, err.reason || err.message, err.validation);
    return;
  }

  if (typeof err['code'] === 'number') {
    this.response(err.code, err.reason || err.message, err.data);
    return;
  }

  if (typeof err['code'] === 'string') {
    try {
      const code = getStatusCode(err.code)
      this.response(code, err.reason || err.message, err.data);
      return;
    } catch (err) {
      // igone the error
    }
  }

  this.response(errors.StatusCodes.INTERNAL_SERVER_ERROR, err.reason || err.message, err.data);
}

function success(this: FastifyReply, data?: any): void {
  this.response(errors.StatusCodes.OK, undefined, data);
}

function badRequest(this: FastifyReply, data?: any): void {
  this.response(errors.StatusCodes.BAD_REQUEST, undefined, data);
}

function notFound(this: FastifyReply, data?: any): void {
  this.response(errors.StatusCodes.NOT_FOUND, undefined, data);
}

function internalServerError(this: FastifyReply, data?: any): void {
  this.response(errors.StatusCodes.INTERNAL_SERVER_ERROR, undefined, data);
}

export default fp(async (fastify, opts) => {
  fastify
    .decorateReply('response', response)
    .decorateReply('error', error)
    .decorateReply('success', success)
    .decorateReply('badRequest', badRequest)
    .decorateReply('notFound', notFound)
    .decorateReply('internalServerError', internalServerError);
}, {
  fastify: '4.x',
  name: 'fastify-sensible',
});

declare module 'fastify' {
  interface FastifyReply {
    response(code: number, message?: string, data?: any): void;
    error(err?: any): void;
    success(data?: any): void;
    badRequest(data?: any): void;
    notFound(data?: any): void;
    internalServerError(data?: any): void;
  }
}
