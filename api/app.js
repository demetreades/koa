'use strict';

import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import ratelimit from 'koa-ratelimit';
import helmet from 'koa-helmet';
import logger from 'koa-pino-logger';

import config from './config.js';
import mongodb from './mongodb.js';

const loggerConfig = {
  name: config.api.env,
  level: 'debug',
  // serializers: {
  //   req: undefined.req,
  //   res: stdSerializers.res,
  //   cause: stdSerializers.err,
  // },
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname,service',
      translateTime: 'SYS:mm-dd-yyyy HH:MM:ss',
    },
  },
};

const app = new Koa();
const router = new Router({ prefix: '/api' });

app.use(cors()); // https://www.npmjs.com/package/@koa/cors
app.use(helmet()); // https://www.npmjs.com/package/koa-helmet
app.use(logger(loggerConfig));

// req-logger
// app.use(async (ctx, next) => {
//   await next();
//   const rt = ctx.response.get('X-Response-Time');
//   ctx.log.info(`${ctx.method} ${ctx.url} - ${rt}`);
// });

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(
  ratelimit({
    driver: 'memory',
    db: new Map(),
    duration: 60_000,
    errorMessage: 'too many requests !',
    id: (ctx) => ctx.ip,
    // headers: {
    //   remaining: 'Rate-Limit-Remaining',
    //   reset: 'Rate-Limit-Reset',
    //   total: 'Rate-Limit-Total',
    // },
    max: 10,
    disableHeader: false,
    // whitelist: (ctx) => {
    // some logic that returns a boolean
    // },
    // blacklist: (ctx) => {
    // some logic that returns a boolean
    // },
  })
);

// ROUTER ----------------------------------------------------------------------
app.use(router.routes()).use(router.allowedMethods());

router.get('check', '/check/:id', async (ctx) => {
  // ctx.status = 333;
  ctx.body = {
    params: ctx.params,
    req: ctx.request,
    res: ctx.response,
    body: ctx.request.body,
    query: ctx.request.query,
  };
});
router.get('root', '/', async (ctx) => {
  ctx.body = { msg: 'Heello from root' };
  ctx.log.info({
    msg: 'loggg from root endpoint',
    body: { paok: 4, aek: 45, lol: 'oleeeeee' },
  });
  ctx.log.warn('faaaakkk rem ounia');
});
router.get(
  'test',
  '/test',
  async (ctx) => (ctx.body = { msg: 'this is comming from test endpoint!' })
);

// console.log(
//   router.url('check', { id: 3 }, { query: { limit: 1, skata: 'tafos' } })
// );

// response - not found
app.use(async (ctx) => {
  // throw new Error('endpoint not found');
  ctx.throw(404, JSON.stringify({ msg: 'oppps not found' }));
});

// -----------------------------------------------------------------------------

// run server
app.listen(config.api.port, () => {
  console.log(`Koa app started on port ${config.api.port}`);
});

// error handling
app.on('error', (err, ctx) => {
  ctx.log.error({ msg: 'SERVER ERROR:', err });
});
