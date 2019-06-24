var redis = require("redis");
const CACHE_LIVE_TIME = process.env.CACHE_LIVE_TIME || 3600;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";

module.exports = {
  init: function() {
		this.redisClient = redis.createClient({password: REDIS_PASSWORD});
	},
  requestReceived: function(req, res, next) {
    if(req.headers['auc-prerender-recache'] === "true") {
      console.log("clear cache");
      this.redisClient.del(req.prerender.url);
      next();
    }
    else {
      this.redisClient.get(req.prerender.url, function(err, result) {
        console.log("CACHE")
        if(result === null){
          console.log("NULL")
          next();
        }
        else {
          console.log("HIT")
          req.prerender.cacheHit = true;
          res.send(200, result);
        }
      });
    }
  },
  beforeSend: function(req, res, next) {
    console.log(req.prerender.url)
    if (!req.prerender.cacheHit && req.prerender.statusCode == 200) {
      console.log("PUT TO CACHE VALUE")
      this.redisClient.set(req.prerender.url, req.prerender.content, 'EX', CACHE_LIVE_TIME);
    }
    next();
  }
}