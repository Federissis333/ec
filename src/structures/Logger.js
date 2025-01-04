const client = require(`${process.cwd()}/index.js`);
const chalk = require('chalk');
const cshard = chalk.hex('#ce52fe');

const _pkg = require('winston');
const pkg = require('winston/lib/winston/transports/index.js');
const { inspect } = require('node:util');

const { createLogger, format } = _pkg;
const { Console } = pkg;

function loadWinstonLogger(logger, shardId = 'Manager') {
  logger
    .add(
      new Console({
        level: 'silly',
        format: format.combine(
          format.colorize(),
          format.printf((info) => {
            const tags = info.tags?.map((t) => `${cshard(t)}`).join(', ') ?? '';
            const shardPrefix = `[${cshard(`Shard ${shardId}`)}, ${tags}]:`;
            return `${shardPrefix} ${info.message instanceof Error ? inspect(info.message, { depth: 0 }) : info.message}`;
          }),
        ),
      })
    )
}

function createWinstonLogger(options, client) {
  const logger = createLogger({
    handleExceptions: options?.handleExceptions ?? true,
    handleRejections: options?.handleRejections ?? true,
    exitOnError: false,
  });
  loadWinstonLogger(logger, client?.shard?.ids[0] ?? 'Manager');

  return logger;
}

module.exports = { createWinstonLogger, loadWinstonLogger };