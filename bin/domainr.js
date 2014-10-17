#!/usr/bin/env node
;process.title = 'Domainr';

var nopt = require('nopt');

var domainr = require('../lib/domainr.js')
  , types = {}
  , shorthands = {}
  , conf = nopt(types, shorthands);

domainr.argv = conf.argv.remain;

if (! (domainr.command = domainr.deref(domainr.argv[0]))) {
  conf.usage = true;
} else {
  domainr.argv.shift();
}

if (conf.version) {
  console.log(domainr.version);
  return;
}

if (conf.usage && domainr.command !== 'help') {
  domainr.argv.unshift(domainr.command);
  domainr.command = 'help';
}

conf._exit = true;
if (domainr.command) {
  domainr.emit(domainr.command, domainr.argv);
}
