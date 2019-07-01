#!/usr/bin/env node
var prerender = require('./lib');

var server = prerender({
    pageDoneCheckInterval: 100,
    logRequests: true
});

server.use(prerender.sendPrerenderHeader());
server.use(require('./lib/plugins/redisCache.js'));
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

server.start();
