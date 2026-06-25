#!/usr/bin/env node
import('../dist/index.js').then(({ runCli }) =>
  runCli(process.argv.slice(2)).then((output) => {
    if (output) process.stdout.write(output);
  })
);
