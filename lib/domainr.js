var EventEmitter = require('events').EventEmitter;
var request = require('http').request;
var ansi = require('ansi');

var domainr = module.exports = new EventEmitter()
  , cursor = ansi(process.stdout);

domainr.deref = function (c) {
  if (!c) return '';
  if (c.match(/[A-Z]/)) c = c.replace(/([A-Z])/g, function (m) {
    return '-' + m.toLowerCase();
  });
  if (cmdList.indexOf(c) === -1) {
    if (aliases[c]) c = aliases[c];
    else c = '';
  }

  return c;
};

domainr.request = function (opts) {
  for (var k in options) {
    if (! (k in opts)) {
      opts[k] = options[k];
    }
  }
  var buffer = '';
  request(opts, function (res) {
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      buffer += chunk;
    });

    res.on('end', function () {
      buffer = JSON.parse(buffer);
      domainr.emit('*print*', buffer);
    });
  }).end();
};

var aliases = {
    'h': 'help'
  , 's': 'search'
  , 'i': 'info'
  , 'v': 'version'
  }
, cmdList = [
    'help'
  , 'search'
  , 'info'
  , 'version'
  ]
, options = {
    host: 'domainr.com',
    port: 80,
    path: '/api/json/search?client_id=nodejs-fundon&q=',
    method: 'GET'
  };

// Print Result
domainr.on('*print*', function (r) {
  var output = '', results = r.results
    , i, l, domain, name, availability;
  if (results) {
    for (i = 0, l = results.length; i < l; i++) {
      domain = results[i];
      name = domain.domain;
      availability = domain.availability;
      if (availability === 'taken') {
        cursor.red().write('\u2717  ');
        cursor.yellow().write(name)
          .write('\n');
      }
      else if (availability === 'available') {
        cursor.green().write('\u2713  ');
        cursor.write(name).write('\n');
      }
      else {
        cursor.red().write('\u2717  ');
        cursor.write(name)
          .write('\n');
      }
    }
  }
});

// help
domainr.on('help', function (a) {
});

// search
domainr.on('search', function (a) {
  var domain = a[0];
  if (domain) {
    domainr.request({
      path: options.path + domain
    });
  }
});

