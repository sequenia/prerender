var redis = require("redis");
const CACHE_LIVE_TIME = process.env.CACHE_LIVE_TIME || 3600;

module.exports = {
  init: function() {
		this.redisClient = redis.createClient({password: "0DGLYe47WRETGdrnuPA03pnesBwsT7"});
	},
  requestReceived: function(req, res, next) {
    if(req.headers['auc-prerender-recache'] === "true") {
      console.log("clear cache");
      this.redisClient.del(req.prerender.url);
      return next();    
    }
    else {
      this.redisClient.get(req.prerender.url, function(err, result) {
        console.log("CACHE")
        if(result === null){
          console.log("NULL")
          return next();
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
    return next();
  }
}