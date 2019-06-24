#!/usr/bin/env node
var prerender = require('./lib');

var server = prerender({
    chromeFlags: ['--headless', '--disable-gpu', '--remote-debugging-port=9222', '--hide-scrollbars'],
    pageDoneCheckInterval: 100 
});

server.use(prerender.sendPrerenderHeader());
server.use(require('./lib/plugins/redisCache.js'));
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

server.start();
