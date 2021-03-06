var util = require('util');
module.exports = (function () {
  var stack = require("callsite");
  var colors = require("colors");
  colors.enabled = true;

  var initTime = +new Date();
  var timer = {
    beginTime: initTime,
    lastTime: initTime
  };

  function _console(ns, debug) {
    this.ns = ns || '';
    debug = (typeof debug !== 'boolean') ? true : debug;
    this.debug = debug && true;
  }

  _console.prototype = {
    preLog: function (arguments) {
      if (!this.debug) {
        return false;
      }
      var site = stack()[2];
      var line = site.getLineNumber();
      var tag = "[" + (this.ns || site.getFileName()) + " :" + line + "] ";

      var args = [].slice.apply(arguments);
      args.unshift(tag);
      return args.join('');
    },
    info: function () {
      if (this.preLog(arguments))
        console.log(this.preLog(arguments).cyan);
    },
    log: function () {
      var tmpTime = +new Date();
      var tmpV1 = tmpTime - timer.beginTime;
      var tmpV2 = tmpTime - timer.lastTime;
      timer.lastTime = tmpTime;
      if (this.preLog(arguments))
        console.log(this.preLog(arguments).green + (' [' + tmpV1 + "s]").cyan + ('[' + tmpV2 + "s]")[(tmpV2 > 100) ? 'red' : 'cyan']);
    },
    warn: function () {
      if (this.preLog(arguments))
        console.log(this.preLog(arguments).yellow);
    },
    err: function () {
      if (this.preLog(arguments))
        console.log(this.preLog(arguments).red);
    },
    _log: function () {
      console.log.call(console, util.format.apply(this, arguments));
    }
  }
  return function (ns, debug) {
    return new _console(ns, debug)
  }
}())