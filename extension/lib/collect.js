(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.3.0
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$toString = {}.toString;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    function lib$es6$promise$asap$$setAsap(asapFn) {
      lib$es6$promise$asap$$asap = asapFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertex();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$asap(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = lib$es6$promise$$internal$$getThen(maybeThenable);

        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      var enumerator = this;

      enumerator._instanceConstructor = Constructor;
      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (enumerator._validateInput(input)) {
        enumerator._input     = input;
        enumerator.length     = input.length;
        enumerator._remaining = input.length;

        enumerator._init();

        if (enumerator.length === 0) {
          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
        } else {
          enumerator.length = enumerator.length || 0;
          enumerator._enumerate();
          if (enumerator._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$es6$promise$utils$$isArray(input);
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var enumerator = this;

      var length  = enumerator.length;
      var promise = enumerator.promise;
      var input   = enumerator._input;

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        enumerator._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var enumerator = this;
      var c = enumerator._instanceConstructor;

      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
          entry._onerror = null;
          enumerator._settledAt(entry._state, i, entry._result);
        } else {
          enumerator._willSettleAt(c.resolve(entry), i);
        }
      } else {
        enumerator._remaining--;
        enumerator._result[i] = entry;
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var enumerator = this;
      var promise = enumerator.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        enumerator._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          enumerator._result[i] = value;
        }
      }

      if (enumerator._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        if (!lib$es6$promise$utils$$isFunction(resolver)) {
          lib$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
          lib$es6$promise$promise$$needsNew();
        }

        lib$es6$promise$$internal$$initializePromise(this, resolver);
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection) {
        var parent = this;
        var state = parent._state;

        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
          return this;
        }

        var child = new this.constructor(lib$es6$promise$$internal$$noop);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          lib$es6$promise$asap$$asap(function(){
            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rdfaProcessor = require('./rdfa-processor');

var _rdfaProcessor2 = _interopRequireDefault(_rdfaProcessor);

var _rdfaGraph = require('./rdfa-graph');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GraphRDFaProcessor = function (_RDFaProcessor) {
  _inherits(GraphRDFaProcessor, _RDFaProcessor);

  function GraphRDFaProcessor(target) {
    _classCallCheck(this, GraphRDFaProcessor);

    return _possibleConstructorReturn(this, (GraphRDFaProcessor.__proto__ || Object.getPrototypeOf(GraphRDFaProcessor)).call(this, target));
  }

  _createClass(GraphRDFaProcessor, [{
    key: 'getObjectSize',
    value: function getObjectSize(obj) {
      var size = 0;
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          size++;
        }
      }
      return size;
    }
  }, {
    key: 'init',
    value: function init() {
      var thisObj = this;
      this.finishedHandlers.push(function (node) {
        for (var subject in thisObj.target.graph.subjects) {
          var snode = thisObj.target.graph.subjects[subject];
          if (thisObj.getObjectSize(snode.predicates) == 0) {
            delete thisObj.target.graph.subjects[subject];
          }
        }
      });
    }
  }, {
    key: 'newBlankNode',
    value: function newBlankNode() {
      return this.target.graph.newBlankNode();
    }
  }, {
    key: 'newSubjectOrigin',
    value: function newSubjectOrigin(origin, subject) {
      var snode = this.newSubject(null, subject);
      for (var i = 0; i < snode.origins.length; i++) {
        if (snode.origins[i] === origin) {
          return;
        }
      }
      snode.origins.push(origin);
      if (!origin.data) {
        Object.defineProperty(origin, "data", {
          value: snode,
          writable: false,
          configurable: true,
          enumerable: true
        });
      }
    }
  }, {
    key: 'newSubject',
    value: function newSubject(origin, subject) {
      var snode = this.target.graph.subjects[subject];
      if (!snode) {
        snode = new _rdfaGraph.RDFaSubject(this.target.graph, subject);
        this.target.graph.subjects[subject] = snode;
      }
      return snode;
    }
  }, {
    key: 'addTriple',
    value: function addTriple(origin, subject, predicate, object) {
      var snode = this.newSubject(origin, subject);
      var pnode = snode.predicates[predicate];
      if (!pnode) {
        pnode = new _rdfaGraph.RDFaPredicate(predicate);
        snode.predicates[predicate] = pnode;
      }

      for (var i = 0; i < pnode.objects.length; i++) {
        if (pnode.objects[i].type == object.type && pnode.objects[i].value == object.value) {
          if (pnode.objects[i].origin !== origin) {
            if (!Array.isArray(pnode.objects[i].origin)) {
              var origins = [];
              origins.push(pnode.objects[i].origin);
              pnode.objects[i].origin = origins;
            }
            pnode.objects[i].origin.push(origin);
          }
          return;
        }
      }
      pnode.objects.push(object);
      object.origin = origin;
      if (predicate == _rdfaProcessor2.default.typeURI) {
        snode.types.push(object.value);
      }
    }
  }, {
    key: 'copyProperties',
    value: function copyProperties() {
      var copySubjects = [];
      var patternSubjects = {};
      for (var subject in this.target.graph.subjects) {
        var snode = this.target.graph.subjects[subject];
        var pnode = snode.predicates[GraphRDFaProcessor.rdfaCopyPredicate];
        if (!pnode) {
          continue;
        }
        copySubjects.push(subject);
        for (var i = 0; i < pnode.objects.length; i++) {
          if (pnode.objects[i].type != _rdfaProcessor2.default.objectURI) {
            continue;
          }
          var target = pnode.objects[i].value;
          var patternSubjectNode = this.target.graph.subjects[target];
          if (!patternSubjectNode) {
            continue;
          }
          var patternTypes = patternSubjectNode.predicates[_rdfaProcessor2.default.typeURI];
          if (!patternTypes) {
            continue;
          }
          var isPattern = false;
          for (var j = 0; j < patternTypes.objects.length && !isPattern; j++) {
            if (patternTypes.objects[j].value == GraphRDFaProcessor.rdfaPatternType && patternTypes.objects[j].type == _rdfaProcessor2.default.objectURI) {
              isPattern = true;
            }
          }
          if (!isPattern) {
            continue;
          }
          patternSubjects[target] = true;
          for (var predicate in patternSubjectNode.predicates) {
            var targetPNode = patternSubjectNode.predicates[predicate];
            if (predicate == _rdfaProcessor2.default.typeURI) {
              if (targetPNode.objects.length == 1) {
                continue;
              }
              for (var j = 0; j < targetPNode.objects.length; j++) {
                if (targetPNode.objects[j].value != GraphRDFaProcessor.rdfaPatternType) {
                  var subjectPNode = snode.predicates[predicate];
                  if (!subjectPNode) {
                    subjectPNode = new _rdfaGraph.RDFaPredicate(predicate);
                    snode.predicates[predicate] = subjectPNode;
                  }
                  subjectPNode.objects.push({ type: targetPNode.objects[j].type,
                    value: targetPNode.objects[j].value,
                    language: targetPNode.objects[j].language,
                    origin: targetPNode.objects[j].origin });
                  snode.types.push(targetPNode.objects[j].value);
                }
              }
            } else {
              var subjectPNode = snode.predicates[predicate];
              if (!subjectPNode) {
                subjectPNode = new _rdfaGraph.RDFaPredicate(predicate);
                snode.predicates[predicate] = subjectPNode;
              }
              for (var j = 0; j < targetPNode.objects.length; j++) {
                subjectPNode.objects.push({ type: targetPNode.objects[j].type,
                  value: targetPNode.objects[j].value,
                  language: targetPNode.objects[j].language,
                  origin: targetPNode.objects[j].origin });
              }
            }
          }
        }
      }
      for (var i = 0; i < copySubjects.length; i++) {
        var snode = this.target.graph.subjects[copySubjects[i]];
        delete snode.predicates[GraphRDFaProcessor.rdfaCopyPredicate];
      }
      for (var subject in patternSubjects) {
        delete this.target.graph.subjects[subject];
      }
    }
  }]);

  return GraphRDFaProcessor;
}(_rdfaProcessor2.default);

exports.default = GraphRDFaProcessor;
;

GraphRDFaProcessor.rdfaCopyPredicate = "http://www.w3.org/ns/rdfa#copy";
GraphRDFaProcessor.rdfaPatternType = "http://www.w3.org/ns/rdfa#Pattern";
module.exports = exports['default'];
},{"./rdfa-graph":6,"./rdfa-processor":7}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (document) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var node = document.documentElement || document;
  var baseURI = options.baseURI ? options.baseURI : node.baseURI;

  var graph = new _rdfaGraph.RDFaGraph();

  var target = {
    graph: graph,
    baseURI: new _uriResolver2.default().parseURI(baseURI)
  };

  var processor = new _graphRdfaProcessor2.default(target);
  processor.process(node, options);
  return target.graph;
};

var _uriResolver = require('./uri-resolver');

var _uriResolver2 = _interopRequireDefault(_uriResolver);

var _graphRdfaProcessor = require('./graph-rdfa-processor');

var _graphRdfaProcessor2 = _interopRequireDefault(_graphRdfaProcessor);

var _rdfaGraph = require('./rdfa-graph');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;
module.exports = exports['default'];
},{"./graph-rdfa-processor":3,"./rdfa-graph":6,"./uri-resolver":8}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Node = {
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3,
  CDATA_SECTION_NODE: 4,
  ENTITY_REFERENCE_NODE: 5,
  ENTITY_NODE: 6,
  PROCESSING_INSTRUCTION_NODE: 7,
  COMMENT_NODE: 8,
  DOCUMENT_NODE: 9,
  DOCUMENT_TYPE_NODE: 10,
  DOCUMENT_FRAGMENT_NODE: 11,
  NOTATION_NODE: 12
};

exports.default = Node;
module.exports = exports["default"];
},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RDFaPredicate = exports.RDFaSubject = exports.RDFaGraph = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RDFaGraph = exports.RDFaGraph = function () {
  function RDFaGraph() {
    _classCallCheck(this, RDFaGraph);

    var dataContext = this;
    this.curieParser = {
      trim: function trim(str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      },
      parse: function parse(value, resolve) {
        value = this.trim(value);
        if (value.charAt(0) == '[' && value.charAt(value.length - 1) == ']') {
          value = value.substring(1, value.length - 1);
        }
        var colon = value.indexOf(":");
        if (colon >= 0) {
          var prefix = value.substring(0, colon);
          if (prefix == "") {
            // default prefix
            var uri = dataContext.prefixes[""];
            return uri ? uri + value.substring(colon + 1) : null;
          } else if (prefix == "_") {
            // blank node
            return "_:" + value.substring(colon + 1);
          } else if (DocumentData.NCNAME.test(prefix)) {
            var uri = dataContext.prefixes[prefix];
            if (uri) {
              return uri + value.substring(colon + 1);
            }
          }
        }

        return resolve ? dataContext.baseURI.resolve(value) : value;
      }
    };
    this.base = null;
    this.toString = function (requestOptions) {
      var options = requestOptions && requestOptions.shorten ? { graph: this, shorten: true, prefixesUsed: {} } : null;
      if (requestOptions && requestOptions.blankNodePrefix) {
        options.filterBlankNode = function (id) {
          return "_:" + requestOptions.blankNodePrefix + id.substring(2);
        };
      }
      if (requestOptions && requestOptions.numericalBlankNodePrefix) {
        var onlyNumbers = /^[0-9]+$/;
        options.filterBlankNode = function (id) {
          var label = id.substring(2);
          return onlyNumbers.test(label) ? "_:" + requestOptions.numericalBlankNodePrefix + label : id;
        };
      }
      var s = "";
      for (var subject in this.subjects) {
        var snode = this.subjects[subject];
        s += snode.toString(options);
        s += "\n";
      }
      var prolog = requestOptions && requestOptions.baseURI ? "@base <" + baseURI + "> .\n" : "";
      if (options && options.shorten) {
        for (var prefix in options.prefixesUsed) {
          prolog += "@prefix " + prefix + ": <" + this.prefixes[prefix] + "> .\n";
        }
      }
      return prolog.length == 0 ? s : prolog + "\n" + s;
    };
    this.blankNodeCounter = 0;
    this.clear = function () {
      this.subjects = {};
      this.prefixes = {};
      this.terms = {};
      this.blankNodeCounter = 0;
    };
    this.clear();
    this.prefixes[""] = "http://www.w3.org/1999/xhtml/vocab#";

    // w3c
    this.prefixes["grddl"] = "http://www.w3.org/2003/g/data-view#";
    this.prefixes["ma"] = "http://www.w3.org/ns/ma-ont#";
    this.prefixes["owl"] = "http://www.w3.org/2002/07/owl#";
    this.prefixes["rdf"] = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
    this.prefixes["rdfa"] = "http://www.w3.org/ns/rdfa#";
    this.prefixes["rdfs"] = "http://www.w3.org/2000/01/rdf-schema#";
    this.prefixes["rif"] = "http://www.w3.org/2007/rif#";
    this.prefixes["skos"] = "http://www.w3.org/2004/02/skos/core#";
    this.prefixes["skosxl"] = "http://www.w3.org/2008/05/skos-xl#";
    this.prefixes["wdr"] = "http://www.w3.org/2007/05/powder#";
    this.prefixes["void"] = "http://rdfs.org/ns/void#";
    this.prefixes["wdrs"] = "http://www.w3.org/2007/05/powder-s#";
    this.prefixes["xhv"] = "http://www.w3.org/1999/xhtml/vocab#";
    this.prefixes["xml"] = "http://www.w3.org/XML/1998/namespace";
    this.prefixes["xsd"] = "http://www.w3.org/2001/XMLSchema#";
    // non-rec w3c
    this.prefixes["sd"] = "http://www.w3.org/ns/sparql-service-description#";
    this.prefixes["org"] = "http://www.w3.org/ns/org#";
    this.prefixes["gldp"] = "http://www.w3.org/ns/people#";
    this.prefixes["cnt"] = "http://www.w3.org/2008/content#";
    this.prefixes["dcat"] = "http://www.w3.org/ns/dcat#";
    this.prefixes["earl"] = "http://www.w3.org/ns/earl#";
    this.prefixes["ht"] = "http://www.w3.org/2006/http#";
    this.prefixes["ptr"] = "http://www.w3.org/2009/pointers#";
    // widely used
    this.prefixes["cc"] = "http://creativecommons.org/ns#";
    this.prefixes["ctag"] = "http://commontag.org/ns#";
    this.prefixes["dc"] = "http://purl.org/dc/terms/";
    this.prefixes["dcterms"] = "http://purl.org/dc/terms/";
    this.prefixes["foaf"] = "http://xmlns.com/foaf/0.1/";
    this.prefixes["gr"] = "http://purl.org/goodrelations/v1#";
    this.prefixes["ical"] = "http://www.w3.org/2002/12/cal/icaltzd#";
    this.prefixes["og"] = "http://ogp.me/ns#";
    this.prefixes["rev"] = "http://purl.org/stuff/rev#";
    this.prefixes["sioc"] = "http://rdfs.org/sioc/ns#";
    this.prefixes["v"] = "http://rdf.data-vocabulary.org/#";
    this.prefixes["vcard"] = "http://www.w3.org/2006/vcard/ns#";
    this.prefixes["schema"] = "http://schema.org/";

    // terms
    this.terms["describedby"] = "http://www.w3.org/2007/05/powder-s#describedby";
    this.terms["license"] = "http://www.w3.org/1999/xhtml/vocab#license";
    this.terms["role"] = "http://www.w3.org/1999/xhtml/vocab#role";

    Object.defineProperty(this, "tripleCount", {
      enumerable: true,
      configurable: false,
      get: function get() {
        var count = 0;
        for (var s in this.subjects) {
          var snode = this.subjects[s];
          for (var p in snode.predicates) {
            count += snode.predicates[p].objects.length;
          }
        }
        return count;
      }
    });
  }

  _createClass(RDFaGraph, [{
    key: 'newBlankNode',
    value: function newBlankNode() {
      this.blankNodeCounter++;
      return "_:" + this.blankNodeCounter;
    }
  }, {
    key: 'expand',
    value: function expand(curie) {
      return this.curieParser.parse(curie, true);
    }
  }, {
    key: 'shorten',
    value: function shorten(uri, prefixesUsed) {
      for (prefix in this.prefixes) {
        var mapped = this.prefixes[prefix];
        if (uri.indexOf(mapped) == 0) {
          if (prefixesUsed) {
            prefixesUsed[prefix] = mapped;
          }
          return prefix + ":" + uri.substring(mapped.length);
        }
      }
      return null;
    }
  }, {
    key: 'add',
    value: function add(subject, predicate, object, options) {
      if (!subject || !predicate || !object) {
        return;
      }
      subject = this.expand(subject);
      predicate = this.expand(predicate);
      var snode = this.subjects[subject];
      if (!snode) {
        snode = new RDFaSubject(this, subject);
        this.subjects[subject] = snode;
      }
      if (options && options.origin) {
        snode.origins.push(options.origin);
      }
      if (predicate == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
        snode.types.push(object);
      }
      var pnode = snode.predicates[predicate];
      if (!pnode) {
        pnode = new RDFaPredicate(predicate);
        snode.predicates[predicate] = pnode;
      }

      if (typeof object == "string") {
        pnode.objects.push({
          type: RDFaProcessor.PlainLiteralURI,
          value: object
        });
      } else {
        pnode.objects.push({
          type: object.type ? this.expand(object.type) : RDFaProcessor.PlainLiteralURI,
          value: object.value ? object.value : "",
          origin: object.origin,
          language: object.language
        });
      }
    }
  }, {
    key: 'addCollection',
    value: function addCollection(subject, predicate, objectList, options) {
      if (!subject || !predicate || !objectList) {
        return;
      }

      var lastSubject = subject;
      var lastPredicate = predicate;
      for (var i = 0; i < objectList.length; i++) {
        var object = { type: options && options.type ? options.type : "rdf:PlainLiteral" };
        if (options && options.language) {
          object.language = options.language;
        }
        if (options && options.datatype) {
          object.datatype = options.datatype;
        }
        if (_typeof(objectList[i]) == "object") {
          object.value = objectList[i].value ? objectList[i].value : "";
          if (objectList[i].type) {
            object.type = objectList[i].type;
          }
          if (objectList[i].language) {
            object.language = objectList[i].language;
          }
          if (objectList[i].datatype) {
            object.datatype = objectList[i].datatype;
          }
        } else {
          object.value = objectList[i];
        }
        var bnode = this.newBlankNode();
        this.add(lastSubject, lastPredicate, { type: "rdf:object", value: bnode });
        this.add(bnode, "rdf:first", object);
        lastSubject = bnode;
        lastPredicate = "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest";
      }
      this.add(lastSubject, lastPredicate, { type: "rdf:object", value: "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil" });
    }
  }, {
    key: 'remove',
    value: function remove(subject, predicate) {
      if (!subject) {
        this.subjects = {};
        return;
      }
      subject = this.expand(subject);
      var snode = this.subjects[snode];
      if (!snode) {
        return;
      }
      if (!predicate) {
        delete this.subjects[subject];
        return;
      }
      predicate = this.expand(predicate);
      delete snode.predicates[predicate];
    }
  }]);

  return RDFaGraph;
}();

;

var RDFaSubject = exports.RDFaSubject = function () {
  function RDFaSubject(graph, subject) {
    _classCallCheck(this, RDFaSubject);

    this.graph = graph;
    // TODO: subject or id?
    this.subject = subject;
    this.id = subject;
    this.predicates = {};
    this.origins = [];
    this.types = [];
  }

  _createClass(RDFaSubject, [{
    key: 'toString',
    value: function toString(options) {
      var s = null;
      if (this.subject.substring(0, 2) == "_:") {
        if (options && options.filterBlankNode) {
          s = options.filterBlankNode(this.subject);
        } else {
          s = this.subject;
        }
      } else if (options && options.shorten) {
        s = this.graph.shorten(this.subject, options.prefixesUsed);
        if (!s) {
          s = "<" + this.subject + ">";
        }
      } else {
        s = "<" + this.subject + ">";
      }
      var first = true;
      for (var predicate in this.predicates) {
        if (!first) {
          s += ";\n";
        } else {
          first = false;
        }
        s += " " + this.predicates[predicate].toString(options);
      }
      s += " .";
      return s;
    }
  }, {
    key: 'toObject',
    value: function toObject() {
      var o = { subject: this.subject, predicates: {} };
      for (var predicate in this.predicates) {
        var pnode = this.predicates[predicate];
        var p = { predicate: predicate, objects: [] };
        o.predicates[predicate] = p;
        for (var i = 0; i < pnode.objects.length; i++) {
          var object = pnode.objects[i];
          if (object.type == RDFaProcessor.XMLLiteralURI) {
            var serializer = new XMLSerializer();
            var value = "";
            for (var x = 0; x < object.value.length; x++) {
              if (object.value[x].nodeType == _node2.default.ELEMENT_NODE) {
                value += serializer.serializeToString(object.value[x]);
              } else if (object.value[x].nodeType == _node2.default.TEXT_NODE) {
                value += object.value[x].nodeValue;
              }
            }
            p.objects.push({ type: object.type, value: value, language: object.language });
          } else if (object.type == RDFaProcessor.HTMLLiteralURI) {
            var value = object.value.length == 0 ? "" : object.value[0].parentNode.innerHTML;
            p.objects.push({ type: object.type, value: value, language: object.language });
          } else {
            p.objects.push({ type: object.type, value: object.value, language: object.language });
          }
        }
      }
      return o;
    }
  }, {
    key: 'getValues',
    value: function getValues() {
      var values = [];
      for (var i = 0; i < arguments.length; i++) {
        var property = this.graph.curieParser.parse(arguments[i], true);
        var pnode = this.predicates[property];
        if (pnode) {
          for (var j = 0; j < pnode.objects.length; j++) {
            values.push(pnode.objects[j].value);
          }
        }
      }
      return values;
    }
  }]);

  return RDFaSubject;
}();

;

var RDFaPredicate = exports.RDFaPredicate = function () {
  function RDFaPredicate(predicate) {
    _classCallCheck(this, RDFaPredicate);

    this.id = predicate;
    this.predicate = predicate;
    this.objects = [];
  }

  _createClass(RDFaPredicate, [{
    key: 'toString',
    value: function toString(options) {
      var s = null;
      if (options && options.shorten && options.graph) {
        s = options.graph.shorten(this.predicate, options.prefixesUsed);
        if (!s) {
          s = "<" + this.predicate + ">";
        }
      } else {
        s = "<" + this.predicate + ">";
      }
      s += " ";
      for (var i = 0; i < this.objects.length; i++) {
        if (i > 0) {
          s += ", ";
        }
        if (this.objects[i].type == "http://www.w3.org/1999/02/22-rdf-syntax-ns#object") {
          if (this.objects[i].value.substring(0, 2) == "_:") {
            if (options && options.filterBlankNode) {
              s += options.filterBlankNode(this.objects[i].value);
            } else {
              s += this.objects[i].value;
            }
          } else if (options && options.shorten && options.graph) {
            u = options.graph.shorten(this.objects[i].value, options.prefixesUsed);
            if (u) {
              s += u;
            } else {
              s += "<" + this.objects[i].value + ">";
            }
          } else {
            s += "<" + this.objects[i].value + ">";
          }
        } else if (this.objects[i].type == "http://www.w3.org/2001/XMLSchema#integer" || this.objects[i].type == "http://www.w3.org/2001/XMLSchema#decimal" || this.objects[i].type == "http://www.w3.org/2001/XMLSchema#double" || this.objects[i].type == "http://www.w3.org/2001/XMLSchema#boolean") {
          s += this.objects[i].value;
        } else if (this.objects[i].type == "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral") {
          var serializer = new XMLSerializer();
          var value = "";
          for (var x = 0; x < this.objects[i].value.length; x++) {
            if (this.objects[i].value[x].nodeType == _node2.default.ELEMENT_NODE) {
              var prefixMap = RDFaPredicate.getPrefixMap(this.objects[i].value[x]);
              var prefixes = [];
              for (var prefix in prefixMap) {
                prefixes.push(prefix);
              }
              prefixes.sort();
              var e = this.objects[i].value[x].cloneNode(true);
              for (var p = 0; p < prefixes.length; p++) {
                e.setAttributeNS("http://www.w3.org/2000/xmlns/", prefixes[p].length == 0 ? "xmlns" : "xmlns:" + prefixes[p], prefixMap[prefixes[p]]);
              }
              value += serializer.serializeToString(e);
            } else if (this.objects[i].value[x].nodeType == _node2.default.TEXT_NODE) {
              value += this.objects[i].value[x].nodeValue;
            }
          }
          s += '"""' + value.replace(/"""/g, "\\\"\\\"\\\"") + '"""^^<http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral>';
        } else if (this.objects[i].type == "http://www.w3.org/1999/02/22-rdf-syntax-ns#HTML") {
          // We can use innerHTML as a shortcut from the parentNode if the list is not empty
          if (this.objects[i].value.length == 0) {
            s += '""""""^^<http://www.w3.org/1999/02/22-rdf-syntax-ns#HTML>';
          } else {
            s += '"""' + this.objects[i].value[0].parentNode.innerHTML.replace(/"""/g, "\\\"\\\"\\\"") + '"""^^<http://www.w3.org/1999/02/22-rdf-syntax-ns#HTML>';
          }
        } else {
          var l = this.objects[i].value.toString();
          if (l.indexOf("\n") >= 0 || l.indexOf("\r") >= 0) {
            s += '"""' + l.replace(/"""/g, "\\\"\\\"\\\"") + '"""';
          } else {
            s += '"' + l.replace(/"/g, "\\\"") + '"';
          }
          if (this.objects[i].type != "http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral") {
            s += "^^<" + this.objects[i].type + ">";
          } else if (this.objects[i].language) {
            s += "@" + this.objects[i].language;
          }
        }
      }
      return s;
    }
  }]);

  return RDFaPredicate;
}();

;

RDFaPredicate.getPrefixMap = function (e) {
  var prefixMap = {};
  while (e.attributes) {
    for (var i = 0; i < e.attributes.length; i++) {
      if (e.attributes[i].namespaceURI == "http://www.w3.org/2000/xmlns/") {
        var prefix = e.attributes[i].localName;
        if (e.attributes[i].localName == "xmlns") {
          prefix = "";
        }
        if (!(prefix in prefixMap)) {
          prefixMap[prefix] = e.attributes[i].nodeValue;
        }
      }
    }
    e = e.parentNode;
  }
  return prefixMap;
};
},{"./node":5}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uriResolver = require('./uri-resolver');

var _uriResolver2 = _interopRequireDefault(_uriResolver);

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RDFaProcessor = function (_URIResolver) {
  _inherits(RDFaProcessor, _URIResolver);

  function RDFaProcessor(targetObject) {
    _classCallCheck(this, RDFaProcessor);

    var _this = _possibleConstructorReturn(this, (RDFaProcessor.__proto__ || Object.getPrototypeOf(RDFaProcessor)).call(this));

    if (targetObject) {
      _this.target = targetObject;
    } else {
      _this.target = {
        graph: {
          subjects: {},
          prefixes: {},
          terms: {}
        }
      };
    }
    _this.theOne = "_:" + new Date().getTime();
    _this.language = null;
    _this.vocabulary = null;
    _this.blankCounter = 0;
    _this.langAttributes = [{ namespaceURI: "http://www.w3.org/XML/1998/namespace", localName: "lang" }];
    _this.inXHTMLMode = false;
    _this.absURIRE = /[\w\_\-]+:\S+/;
    _this.finishedHandlers = [];
    _this.init();
    return _this;
  }

  _createClass(RDFaProcessor, [{
    key: 'newBlankNode',
    value: function newBlankNode() {
      this.blankCounter++;
      return "_:" + this.blankCounter;
    }
  }, {
    key: 'tokenize',
    value: function tokenize(str) {
      return RDFaProcessor.trim(str).split(/\s+/);
    }
  }, {
    key: 'parseSafeCURIEOrCURIEOrURI',
    value: function parseSafeCURIEOrCURIEOrURI(value, prefixes, base) {
      value = RDFaProcessor.trim(value);
      if (value.charAt(0) == '[' && value.charAt(value.length - 1) == ']') {
        value = value.substring(1, value.length - 1);
        value = value.trim(value);
        if (value.length == 0) {
          return null;
        }
        if (value == "_:") {
          // the one node
          return this.theOne;
        }
        return this.parseCURIE(value, prefixes, base);
      } else {
        return this.parseCURIEOrURI(value, prefixes, base);
      }
    }
  }, {
    key: 'parseCURIE',
    value: function parseCURIE(value, prefixes, base) {
      var colon = value.indexOf(":");
      if (colon >= 0) {
        var prefix = value.substring(0, colon);
        if (prefix == "") {
          // default prefix
          var uri = prefixes[""];
          return uri ? uri + value.substring(colon + 1) : null;
        } else if (prefix == "_") {
          // blank node
          return "_:" + value.substring(colon + 1);
        } else if (RDFaProcessor.NCNAME.test(prefix)) {
          var uri = prefixes[prefix];
          if (uri) {
            return uri + value.substring(colon + 1);
          }
        }
      }
      return null;
    }
  }, {
    key: 'parseCURIEOrURI',
    value: function parseCURIEOrURI(value, prefixes, base) {
      var curie = this.parseCURIE(value, prefixes, base);
      if (curie) {
        return curie;
      }
      return this.resolveAndNormalize(base, value);
    }
  }, {
    key: 'parsePredicate',
    value: function parsePredicate(value, defaultVocabulary, terms, prefixes, base, ignoreTerms) {
      if (value == "") {
        return null;
      }
      var predicate = this.parseTermOrCURIEOrAbsURI(value, defaultVocabulary, ignoreTerms ? null : terms, prefixes, base);
      if (predicate && predicate.indexOf("_:") == 0) {
        return null;
      }
      return predicate;
    }
  }, {
    key: 'parseTermOrCURIEOrURI',
    value: function parseTermOrCURIEOrURI(value, defaultVocabulary, terms, prefixes, base) {
      //alert("Parsing "+value+" with default vocab "+defaultVocabulary);
      value = RDFaProcessor.trim(value);
      var curie = this.parseCURIE(value, prefixes, base);
      if (curie) {
        return curie;
      } else {
        var term = terms[value];
        if (term) {
          return term;
        }
        var lcvalue = value.toLowerCase();
        term = terms[lcvalue];
        if (term) {
          return term;
        }
        if (defaultVocabulary && !this.absURIRE.exec(value)) {
          return defaultVocabulary + value;
        }
      }
      return this.resolveAndNormalize(base, value);
    }
  }, {
    key: 'parseTermOrCURIEOrAbsURI',
    value: function parseTermOrCURIEOrAbsURI(value, defaultVocabulary, terms, prefixes, base) {
      //alert("Parsing "+value+" with default vocab "+defaultVocabulary);
      value = RDFaProcessor.trim(value);
      var curie = this.parseCURIE(value, prefixes, base);
      if (curie) {
        return curie;
      } else if (terms) {
        if (defaultVocabulary && !this.absURIRE.exec(value)) {
          return defaultVocabulary + value;
        }
        var term = terms[value];
        if (term) {
          return term;
        }
        var lcvalue = value.toLowerCase();
        term = terms[lcvalue];
        if (term) {
          return term;
        }
      }
      if (this.absURIRE.exec(value)) {
        return this.resolveAndNormalize(base, value);
      }
      return null;
    }
  }, {
    key: 'resolveAndNormalize',
    value: function resolveAndNormalize(base, href) {
      var u = base.resolve(href);
      var parsed = this.parseURI(u);
      parsed.normalize();
      return parsed.spec;
    }
  }, {
    key: 'parsePrefixMappings',
    value: function parsePrefixMappings(str, target) {
      var values = this.tokenize(str);
      var prefix = null;
      var uri = null;
      for (var i = 0; i < values.length; i++) {
        if (values[i][values[i].length - 1] == ':') {
          prefix = values[i].substring(0, values[i].length - 1);
        } else if (prefix) {
          target[prefix] = this.target.baseURI ? this.target.baseURI.resolve(values[i]) : values[i];
          prefix = null;
        }
      }
    }
  }, {
    key: 'copyMappings',
    value: function copyMappings(mappings) {
      var newMappings = {};
      for (var k in mappings) {
        newMappings[k] = mappings[k];
      }
      return newMappings;
    }
  }, {
    key: 'ancestorPath',
    value: function ancestorPath(node) {
      var path = "";
      while (node && node.nodeType != _node2.default.DOCUMENT_NODE) {
        path = "/" + node.localName + path;
        node = node.parentNode;
      }
      return path;
    }
  }, {
    key: 'setContext',
    value: function setContext(node) {
      // We only recognized XHTML+RDFa 1.1 if the version is set propertyly
      if (node.localName == "html" && node.getAttribute("version") == "XHTML+RDFa 1.1") {
        this.setXHTMLContext();
      } else if (node.localName == "html" || node.namespaceURI == "http://www.w3.org/1999/xhtml") {
        if (node.ownerDocument.doctype) {
          if (node.ownerDocument.doctype.publicId == "-//W3C//DTD XHTML+RDFa 1.0//EN" && node.ownerDocument.doctype.systemId == "http://www.w3.org/MarkUp/DTD/xhtml-rdfa-1.dtd") {
            console.log("WARNING: RDF 1.0 is not supported.  Defaulting to HTML5 mode.");
            this.setHTMLContext();
          } else if (node.ownerDocument.doctype.publicId == "-//W3C//DTD XHTML+RDFa 1.1//EN" && node.ownerDocument.doctype.systemId == "http://www.w3.org/MarkUp/DTD/xhtml-rdfa-2.dtd") {
            this.setXHTMLContext();
          } else {
            this.setHTMLContext();
          }
        } else {
          this.setHTMLContext();
        }
      } else {
        this.setXMLContext();
      }
    }
  }, {
    key: 'setInitialContext',
    value: function setInitialContext() {
      this.vocabulary = null;
      // By default, the prefixes are terms are loaded to the RDFa 1.1. standard within the graph constructor
      this.langAttributes = [{ namespaceURI: "http://www.w3.org/XML/1998/namespace", localName: "lang" }];
    }
  }, {
    key: 'setXMLContext',
    value: function setXMLContext() {
      this.setInitialContext();
      this.inXHTMLMode = false;
      this.inHTMLMode = false;
    }
  }, {
    key: 'setHTMLContext',
    value: function setHTMLContext() {
      this.setInitialContext();
      this.langAttributes = [{ namespaceURI: "http://www.w3.org/XML/1998/namespace", localName: "lang" }, { namespaceURI: null, localName: "lang" }];
      this.inXHTMLMode = false;
      this.inHTMLMode = true;
    }
  }, {
    key: 'setXHTMLContext',
    value: function setXHTMLContext() {

      this.setInitialContext();

      this.inXHTMLMode = true;
      this.inHTMLMode = false;

      this.langAttributes = [{ namespaceURI: "http://www.w3.org/XML/1998/namespace", localName: "lang" }, { namespaceURI: null, localName: "lang" }];

      // From http://www.w3.org/2011/rdfa-context/xhtml-rdfa-1.1
      this.target.graph.terms["alternate"] = "http://www.w3.org/1999/xhtml/vocab#alternate";
      this.target.graph.terms["appendix"] = "http://www.w3.org/1999/xhtml/vocab#appendix";
      this.target.graph.terms["bookmark"] = "http://www.w3.org/1999/xhtml/vocab#bookmark";
      this.target.graph.terms["cite"] = "http://www.w3.org/1999/xhtml/vocab#cite";
      this.target.graph.terms["chapter"] = "http://www.w3.org/1999/xhtml/vocab#chapter";
      this.target.graph.terms["contents"] = "http://www.w3.org/1999/xhtml/vocab#contents";
      this.target.graph.terms["copyright"] = "http://www.w3.org/1999/xhtml/vocab#copyright";
      this.target.graph.terms["first"] = "http://www.w3.org/1999/xhtml/vocab#first";
      this.target.graph.terms["glossary"] = "http://www.w3.org/1999/xhtml/vocab#glossary";
      this.target.graph.terms["help"] = "http://www.w3.org/1999/xhtml/vocab#help";
      this.target.graph.terms["icon"] = "http://www.w3.org/1999/xhtml/vocab#icon";
      this.target.graph.terms["index"] = "http://www.w3.org/1999/xhtml/vocab#index";
      this.target.graph.terms["last"] = "http://www.w3.org/1999/xhtml/vocab#last";
      this.target.graph.terms["license"] = "http://www.w3.org/1999/xhtml/vocab#license";
      this.target.graph.terms["meta"] = "http://www.w3.org/1999/xhtml/vocab#meta";
      this.target.graph.terms["next"] = "http://www.w3.org/1999/xhtml/vocab#next";
      this.target.graph.terms["prev"] = "http://www.w3.org/1999/xhtml/vocab#prev";
      this.target.graph.terms["previous"] = "http://www.w3.org/1999/xhtml/vocab#previous";
      this.target.graph.terms["section"] = "http://www.w3.org/1999/xhtml/vocab#section";
      this.target.graph.terms["stylesheet"] = "http://www.w3.org/1999/xhtml/vocab#stylesheet";
      this.target.graph.terms["subsection"] = "http://www.w3.org/1999/xhtml/vocab#subsection";
      this.target.graph.terms["start"] = "http://www.w3.org/1999/xhtml/vocab#start";
      this.target.graph.terms["top"] = "http://www.w3.org/1999/xhtml/vocab#top";
      this.target.graph.terms["up"] = "http://www.w3.org/1999/xhtml/vocab#up";
      this.target.graph.terms["p3pv1"] = "http://www.w3.org/1999/xhtml/vocab#p3pv1";

      // other
      this.target.graph.terms["related"] = "http://www.w3.org/1999/xhtml/vocab#related";
      this.target.graph.terms["role"] = "http://www.w3.org/1999/xhtml/vocab#role";
      this.target.graph.terms["transformation"] = "http://www.w3.org/1999/xhtml/vocab#transformation";
    }
  }, {
    key: 'init',
    value: function init() {}
  }, {
    key: 'newSubjectOrigin',
    value: function newSubjectOrigin(origin, subject) {}
  }, {
    key: 'addTriple',
    value: function addTriple(origin, subject, predicate, object) {}
  }, {
    key: 'process',
    value: function process(node, options) {
      if (node.nodeType == _node2.default.DOCUMENT_NODE) {
        node = node.documentElement;
        this.setContext(node);
      } else if (node.parentNode.nodeType == _node2.default.DOCUMENT_NODE) {
        this.setContext(node);
      }
      var queue = [];
      // Fix for Firefox that includes the hash in the base URI
      var removeHash = function removeHash(baseURI) {
        var hash = baseURI.indexOf("#");
        if (hash >= 0) {
          baseURI = baseURI.substring(0, hash);
        }
        if (options && options.baseURIMap) {
          baseURI = options.baseURIMap(baseURI);
        }
        return baseURI;
      };
      queue.push({ current: node, context: this.push(null, removeHash(node.baseURI)) });
      while (queue.length > 0) {
        var item = queue.shift();
        if (item.parent) {
          // Sequence Step 14: list triple generation
          if (item.context.parent && item.context.parent.listMapping == item.listMapping) {
            // Skip a child context with exactly the same mapping
            continue;
          }
          //console.log("Generating lists for "+item.subject+", tag "+item.parent.localName);
          for (var predicate in item.listMapping) {
            var list = item.listMapping[predicate];
            if (list.length == 0) {
              this.addTriple(item.parent, item.subject, predicate, { type: RDFaProcessor.objectURI, value: "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil" });
              continue;
            }
            var bnodes = [];
            for (var i = 0; i < list.length; i++) {
              bnodes.push(this.newBlankNode());
              //this.newSubject(item.parent,bnodes[i]);
            }
            for (var i = 0; i < bnodes.length; i++) {
              this.addTriple(item.parent, bnodes[i], "http://www.w3.org/1999/02/22-rdf-syntax-ns#first", list[i]);
              this.addTriple(item.parent, bnodes[i], "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest", { type: RDFaProcessor.objectURI, value: i + 1 < bnodes.length ? bnodes[i + 1] : "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil" });
            }
            this.addTriple(item.parent, item.subject, predicate, { type: RDFaProcessor.objectURI, value: bnodes[0] });
          }
          continue;
        }
        var current = item.current;
        var context = item.context;

        //console.log("Tag: "+current.localName+", listMapping="+JSON.stringify(context.listMapping));

        // Sequence Step 1
        var skip = false;
        var newSubject = null;
        var currentObjectResource = null;
        var typedResource = null;
        var prefixes = context.prefixes;
        var prefixesCopied = false;
        var incomplete = [];
        var listMapping = context.listMapping;
        var listMappingDifferent = context.parent ? false : true;
        var language = context.language;
        var vocabulary = context.vocabulary;

        // TODO: the "base" element may be used for HTML+RDFa 1.1
        var base;
        if (!current.baseURI) {
          if (this.target.baseURI) {
            base = this.target.baseURI;
          } else {
            throw new Error('node.baseURI was null as baseURI must be specified as an option');
          }
        } else if (current.baseURI === 'about:blank') {
          if (this.target.baseURI) {
            base = this.target.baseURI;
          } else {
            throw new Error('node.baseURI is about:blank a valid URL must be provided with the baseURI option. If you use JSDOM call it with an `url` parameter or, set the baseURI option of this library');
          }
        } else {
          base = this.parseURI(removeHash(current.baseURI));
        }

        current.item = null;

        // Sequence Step 2: set the default vocabulary
        var vocabAtt = current.getAttributeNode("vocab");
        if (vocabAtt) {
          var value = RDFaProcessor.trim(vocabAtt.value);
          if (value.length > 0) {
            vocabulary = value;
            var baseSubject = base.spec;
            //this.newSubject(current,baseSubject);
            this.addTriple(current, baseSubject, "http://www.w3.org/ns/rdfa#usesVocabulary", { type: RDFaProcessor.objectURI, value: vocabulary });
          } else {
            vocabulary = this.vocabulary;
          }
        }

        // Sequence Step 3: IRI mappings
        // handle xmlns attributes
        for (var i = 0; i < current.attributes.length; i++) {
          var att = current.attributes[i];
          //if (att.namespaceURI=="http://www.w3.org/2000/xmlns/") {
          if (att.name.charAt(0) == "x" && att.name.indexOf("xmlns:") == 0) {
            if (!prefixesCopied) {
              prefixes = this.copyMappings(prefixes);
              prefixesCopied = true;
            }
            var prefix = att.name.substring(6);
            // TODO: resolve relative?
            var ref = RDFaProcessor.trim(att.value);
            prefixes[prefix] = this.target.baseURI ? this.target.baseURI.resolve(ref) : ref;
          }
        }
        // Handle prefix mappings (@prefix)
        var prefixAtt = current.getAttributeNode("prefix");
        if (prefixAtt) {
          if (!prefixesCopied) {
            prefixes = this.copyMappings(prefixes);
            prefixesCopied = true;
          }
          this.parsePrefixMappings(prefixAtt.value, prefixes);
        }

        // Sequence Step 4: language
        var xmlLangAtt = null;
        for (var i = 0; !xmlLangAtt && i < this.langAttributes.length; i++) {
          xmlLangAtt = current.getAttributeNodeNS(this.langAttributes[i].namespaceURI, this.langAttributes[i].localName);
        }
        if (xmlLangAtt) {
          var value = RDFaProcessor.trim(xmlLangAtt.value);
          if (value.length > 0) {
            language = value;
          } else {
            language = null;
          }
        }

        var relAtt = current.getAttributeNode("rel");
        var revAtt = current.getAttributeNode("rev");
        var typeofAtt = current.getAttributeNode("typeof");
        var propertyAtt = current.getAttributeNode("property");
        var datatypeAtt = current.getAttributeNode("datatype");
        var datetimeAtt = this.inHTMLMode ? current.getAttributeNode("datetime") : null;
        var contentAtt = current.getAttributeNode("content");
        var aboutAtt = current.getAttributeNode("about");
        var srcAtt = current.getAttributeNode("src");
        var resourceAtt = current.getAttributeNode("resource");
        var hrefAtt = current.getAttributeNode("href");
        var inlistAtt = current.getAttributeNode("inlist");

        var relAttPredicates = [];
        if (relAtt) {
          var values = this.tokenize(relAtt.value);
          for (var i = 0; i < values.length; i++) {
            var predicate = this.parsePredicate(values[i], vocabulary, context.terms, prefixes, base, this.inHTMLMode && propertyAtt != null);
            if (predicate) {
              relAttPredicates.push(predicate);
            }
          }
        }
        var revAttPredicates = [];
        if (revAtt) {
          var values = this.tokenize(revAtt.value);
          for (var i = 0; i < values.length; i++) {
            var predicate = this.parsePredicate(values[i], vocabulary, context.terms, prefixes, base, this.inHTMLMode && propertyAtt != null);
            if (predicate) {
              revAttPredicates.push(predicate);
            }
          }
        }

        // Section 3.1, bullet 7
        if (this.inHTMLMode && (relAtt != null || revAtt != null) && propertyAtt != null) {
          if (relAttPredicates.length == 0) {
            relAtt = null;
          }
          if (revAttPredicates.length == 0) {
            revAtt = null;
          }
        }

        if (relAtt || revAtt) {
          // Sequence Step 6: establish new subject and value
          if (aboutAtt) {
            newSubject = this.parseSafeCURIEOrCURIEOrURI(aboutAtt.value, prefixes, base);
          }
          if (typeofAtt) {
            typedResource = newSubject;
          }
          if (!newSubject) {
            if (current.parentNode.nodeType == _node2.default.DOCUMENT_NODE) {
              newSubject = removeHash(current.baseURI);
            } else if (context.parentObject) {
              // TODO: Verify: If the xml:base has been set and the parentObject is the baseURI of the parent, then the subject needs to be the new base URI
              newSubject = removeHash(current.parentNode.baseURI) == context.parentObject ? removeHash(current.baseURI) : context.parentObject;
            }
          }
          if (resourceAtt) {
            currentObjectResource = this.parseSafeCURIEOrCURIEOrURI(resourceAtt.value, prefixes, base);
          }

          if (!currentObjectResource) {
            if (hrefAtt) {
              currentObjectResource = this.resolveAndNormalize(base, encodeURI(hrefAtt.value));
            } else if (srcAtt) {
              currentObjectResource = this.resolveAndNormalize(base, encodeURI(srcAtt.value));
            } else if (typeofAtt && !aboutAtt && !(this.inXHTMLMode && (current.localName == "head" || current.localName == "body"))) {
              currentObjectResource = this.newBlankNode();
            }
          }
          if (typeofAtt && !aboutAtt && this.inXHTMLMode && (current.localName == "head" || current.localName == "body")) {
            typedResource = newSubject;
          } else if (typeofAtt && !aboutAtt) {
            typedResource = currentObjectResource;
          }
        } else if (propertyAtt && !contentAtt && !datatypeAtt) {
          // Sequence Step 5.1: establish a new subject
          if (aboutAtt) {
            newSubject = this.parseSafeCURIEOrCURIEOrURI(aboutAtt.value, prefixes, base);
            if (typeofAtt) {
              typedResource = newSubject;
            }
          }
          if (!newSubject && current.parentNode.nodeType == _node2.default.DOCUMENT_NODE) {
            newSubject = removeHash(current.baseURI);
            if (typeofAtt) {
              typedResource = newSubject;
            }
          } else if (!newSubject && context.parentObject) {
            // TODO: Verify: If the xml:base has been set and the parentObject is the baseURI of the parent, then the subject needs to be the new base URI
            newSubject = removeHash(current.parentNode.baseURI) == context.parentObject ? removeHash(current.baseURI) : context.parentObject;
          }
          if (typeofAtt && !typedResource) {
            if (resourceAtt) {
              typedResource = this.parseSafeCURIEOrCURIEOrURI(resourceAtt.value, prefixes, base);
            }
            if (!typedResource && hrefAtt) {
              typedResource = this.resolveAndNormalize(base, encodeURI(hrefAtt.value));
            }
            if (!typedResource && srcAtt) {
              typedResource = this.resolveAndNormalize(base, encodeURI(srcAtt.value));
            }
            if (!typedResource && (this.inXHTMLMode || this.inHTMLMode) && (current.localName == "head" || current.localName == "body")) {
              typedResource = newSubject;
            }
            if (!typedResource) {
              typedResource = this.newBlankNode();
            }
            currentObjectResource = typedResource;
          }
          //console.log(current.localName+", newSubject="+newSubject+", typedResource="+typedResource+", currentObjectResource="+currentObjectResource);
        } else {
          // Sequence Step 5.2: establish a new subject
          if (aboutAtt) {
            newSubject = this.parseSafeCURIEOrCURIEOrURI(aboutAtt.value, prefixes, base);
          }
          if (!newSubject && resourceAtt) {
            newSubject = this.parseSafeCURIEOrCURIEOrURI(resourceAtt.value, prefixes, base);
          }
          if (!newSubject && hrefAtt) {
            newSubject = this.resolveAndNormalize(base, encodeURI(hrefAtt.value));
          }
          if (!newSubject && srcAtt) {
            newSubject = this.resolveAndNormalize(base, encodeURI(srcAtt.value));
          }
          if (!newSubject) {
            if (current.parentNode.nodeType == _node2.default.DOCUMENT_NODE) {
              newSubject = removeHash(current.baseURI);
            } else if ((this.inXHTMLMode || this.inHTMLMode) && (current.localName == "head" || current.localName == "body")) {
              newSubject = removeHash(current.parentNode.baseURI) == context.parentObject ? removeHash(current.baseURI) : context.parentObject;
            } else if (typeofAtt) {
              newSubject = this.newBlankNode();
            } else if (context.parentObject) {
              // TODO: Verify: If the xml:base has been set and the parentObject is the baseURI of the parent, then the subject needs to be the new base URI
              newSubject = removeHash(current.parentNode.baseURI) == context.parentObject ? removeHash(current.baseURI) : context.parentObject;
              if (!propertyAtt) {
                skip = true;
              }
            }
          }
          if (typeofAtt) {
            typedResource = newSubject;
          }
        }

        //console.log(current.tagName+": newSubject="+newSubject+", currentObjectResource="+currentObjectResource+", typedResource="+typedResource+", skip="+skip);

        var rdfaData = null;
        if (newSubject) {
          //this.newSubject(current,newSubject);
          if (aboutAtt || resourceAtt || typedResource) {
            var id = newSubject;
            if (typeofAtt && !aboutAtt && !resourceAtt && currentObjectResource) {
              id = currentObjectResource;
            }
            //console.log("Setting data attribute for "+current.localName+" for subject "+id);
            this.newSubjectOrigin(current, id);
          }
        }

        // Sequence Step 7: generate type triple
        if (typedResource) {
          var values = this.tokenize(typeofAtt.value);
          for (var i = 0; i < values.length; i++) {
            var object = this.parseTermOrCURIEOrAbsURI(values[i], vocabulary, context.terms, prefixes, base);
            if (object) {
              this.addTriple(current, typedResource, RDFaProcessor.typeURI, { type: RDFaProcessor.objectURI, value: object });
            }
          }
        }

        // Sequence Step 8: new list mappings if there is a new subject
        //console.log("Step 8: newSubject="+newSubject+", context.parentObject="+context.parentObject);
        if (newSubject && newSubject != context.parentObject) {
          //console.log("Generating new list mapping for "+newSubject);
          listMapping = {};
          listMappingDifferent = true;
        }

        // Sequence Step 9: generate object triple
        if (currentObjectResource) {
          if (relAtt && inlistAtt) {
            for (var i = 0; i < relAttPredicates.length; i++) {
              var list = listMapping[relAttPredicates[i]];
              if (!list) {
                list = [];
                listMapping[relAttPredicates[i]] = list;
              }
              list.push({ type: RDFaProcessor.objectURI, value: currentObjectResource });
            }
          } else if (relAtt) {
            for (var i = 0; i < relAttPredicates.length; i++) {
              this.addTriple(current, newSubject, relAttPredicates[i], { type: RDFaProcessor.objectURI, value: currentObjectResource });
            }
          }
          if (revAtt) {
            for (var i = 0; i < revAttPredicates.length; i++) {
              this.addTriple(current, currentObjectResource, revAttPredicates[i], { type: RDFaProcessor.objectURI, value: newSubject });
            }
          }
        } else {
          // Sequence Step 10: incomplete triples
          if (newSubject && !currentObjectResource && (relAtt || revAtt)) {
            currentObjectResource = this.newBlankNode();
            //alert(current.tagName+": generated blank node, newSubject="+newSubject+" currentObjectResource="+currentObjectResource);
          }
          if (relAtt && inlistAtt) {
            for (var i = 0; i < relAttPredicates.length; i++) {
              var list = listMapping[relAttPredicates[i]];
              if (!list) {
                list = [];
                listMapping[predicate] = list;
              }
              //console.log("Adding incomplete list for "+predicate);
              incomplete.push({ predicate: relAttPredicates[i], list: list });
            }
          } else if (relAtt) {
            for (var i = 0; i < relAttPredicates.length; i++) {
              incomplete.push({ predicate: relAttPredicates[i], forward: true });
            }
          }
          if (revAtt) {
            for (var i = 0; i < revAttPredicates.length; i++) {
              incomplete.push({ predicate: revAttPredicates[i], forward: false });
            }
          }
        }

        // Step 11: Current property values
        if (propertyAtt) {
          var datatype = null;
          var content = null;
          if (datatypeAtt) {
            datatype = datatypeAtt.value == "" ? RDFaProcessor.PlainLiteralURI : this.parseTermOrCURIEOrAbsURI(datatypeAtt.value, vocabulary, context.terms, prefixes, base);
            if (datetimeAtt && !contentAtt) {
              content = datetimeAtt.value;
            } else {
              content = datatype == RDFaProcessor.XMLLiteralURI || datatype == RDFaProcessor.HTMLLiteralURI ? null : contentAtt ? contentAtt.value : current.textContent;
            }
          } else if (contentAtt) {
            datatype = RDFaProcessor.PlainLiteralURI;
            content = contentAtt.value;
          } else if (datetimeAtt) {
            content = datetimeAtt.value;
            datatype = RDFaProcessor.deriveDateTimeType(content);
            if (!datatype) {
              datatype = RDFaProcessor.PlainLiteralURI;
            }
          } else if (!relAtt && !revAtt) {
            if (resourceAtt) {
              content = this.parseSafeCURIEOrCURIEOrURI(resourceAtt.value, prefixes, base);
            }
            if (!content && hrefAtt) {
              content = this.resolveAndNormalize(base, encodeURI(hrefAtt.value));
            } else if (!content && srcAtt) {
              content = this.resolveAndNormalize(base, encodeURI(srcAtt.value));
            }
            if (content) {
              datatype = RDFaProcessor.objectURI;
            }
          }
          if (!datatype) {
            if (typeofAtt && !aboutAtt) {
              datatype = RDFaProcessor.objectURI;
              content = typedResource;
            } else {
              content = current.textContent;
              if (this.inHTMLMode && current.localName == "time") {
                datatype = RDFaProcessor.deriveDateTimeType(content);
              }
              if (!datatype) {
                datatype = RDFaProcessor.PlainLiteralURI;
              }
            }
          }
          var values = this.tokenize(propertyAtt.value);
          for (var i = 0; i < values.length; i++) {
            var predicate = this.parsePredicate(values[i], vocabulary, context.terms, prefixes, base);
            if (predicate) {
              if (inlistAtt) {
                var list = listMapping[predicate];
                if (!list) {
                  list = [];
                  listMapping[predicate] = list;
                }
                list.push(datatype == RDFaProcessor.XMLLiteralURI || datatype == RDFaProcessor.HTMLLiteralURI ? { type: datatype, value: current.childNodes } : { type: datatype ? datatype : RDFaProcessor.PlainLiteralURI, value: content, language: language });
              } else {
                if (datatype == RDFaProcessor.XMLLiteralURI || datatype == RDFaProcessor.HTMLLiteralURI) {
                  this.addTriple(current, newSubject, predicate, { type: datatype, value: current.childNodes });
                } else {
                  this.addTriple(current, newSubject, predicate, { type: datatype ? datatype : RDFaProcessor.PlainLiteralURI, value: content, language: language });
                  //console.log(newSubject+" "+predicate+"="+content);
                }
              }
            }
          }
        }

        // Sequence Step 12: complete incomplete triples with new subject
        if (newSubject && !skip) {
          for (var i = 0; i < context.incomplete.length; i++) {
            if (context.incomplete[i].list) {
              //console.log("Adding subject "+newSubject+" to list for "+context.incomplete[i].predicate);
              // TODO: it is unclear what to do here
              context.incomplete[i].list.push({ type: RDFaProcessor.objectURI, value: newSubject });
            } else if (context.incomplete[i].forward) {
              //console.log(current.tagName+": completing forward triple "+context.incomplete[i].predicate+" with object="+newSubject);
              this.addTriple(current, context.subject, context.incomplete[i].predicate, { type: RDFaProcessor.objectURI, value: newSubject });
            } else {
              //console.log(current.tagName+": completing reverse triple with object="+context.subject);
              this.addTriple(current, newSubject, context.incomplete[i].predicate, { type: RDFaProcessor.objectURI, value: context.subject });
            }
          }
        }

        var childContext = null;
        var listSubject = newSubject;
        if (skip) {
          // TODO: should subject be null?
          childContext = this.push(context, context.subject);
          // TODO: should the entObject be passed along?  If not, then intermediary children will keep properties from being associated with incomplete triples.
          // TODO: Verify: if the current baseURI has changed and the parentObject is the parent's base URI, then the baseURI should change
          childContext.parentObject = removeHash(current.parentNode.baseURI) == context.parentObject ? removeHash(current.baseURI) : context.parentObject;
          childContext.incomplete = context.incomplete;
          childContext.language = language;
          childContext.prefixes = prefixes;
          childContext.vocabulary = vocabulary;
        } else {
          childContext = this.push(context, newSubject);
          childContext.parentObject = currentObjectResource ? currentObjectResource : newSubject ? newSubject : context.subject;
          childContext.prefixes = prefixes;
          childContext.incomplete = incomplete;
          if (currentObjectResource) {
            //console.log("Generating new list mapping for "+currentObjectResource);
            listSubject = currentObjectResource;
            listMapping = {};
            listMappingDifferent = true;
          }
          childContext.listMapping = listMapping;
          childContext.language = language;
          childContext.vocabulary = vocabulary;
        }
        if (listMappingDifferent) {
          //console.log("Pushing list parent "+current.localName);
          queue.unshift({ parent: current, context: context, subject: listSubject, listMapping: listMapping });
        }
        for (var child = current.lastChild; child; child = child.previousSibling) {
          if (child.nodeType == _node2.default.ELEMENT_NODE) {
            //console.log("Pushing child "+child.localName);
            queue.unshift({ current: child, context: childContext });
          }
        }
      }

      if (this.inHTMLMode) {
        this.copyProperties();
      }

      for (var i = 0; i < this.finishedHandlers.length; i++) {
        this.finishedHandlers[i](node);
      }
    }
  }, {
    key: 'copyProperties',
    value: function copyProperties() {}
  }, {
    key: 'push',
    value: function push(parent, subject) {
      return {
        parent: parent,
        subject: subject ? subject : parent ? parent.subject : null,
        parentObject: null,
        incomplete: [],
        listMapping: parent ? parent.listMapping : {},
        language: parent ? parent.language : this.language,
        prefixes: parent ? parent.prefixes : this.target.graph.prefixes,
        terms: parent ? parent.terms : this.target.graph.terms,
        vocabulary: parent ? parent.vocabulary : this.vocabulary
      };
    }
  }]);

  return RDFaProcessor;
}(_uriResolver2.default);

exports.default = RDFaProcessor;
;

RDFaProcessor.XMLLiteralURI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral";
RDFaProcessor.HTMLLiteralURI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#HTML";
RDFaProcessor.PlainLiteralURI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral";
RDFaProcessor.objectURI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#object";
RDFaProcessor.typeURI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

RDFaProcessor.nameChar = '[-A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u10000-\uEFFFF.0-9\xB7\u0300-\u036F\u203F-\u2040]';
RDFaProcessor.nameStartChar = '[A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\xFF\u0100-\u0131\u0134-\u013E\u0141-\u0148\u014A-\u017E\u0180-\u01C3\u01CD-\u01F0\u01F4-\u01F5\u01FA-\u0217\u0250-\u02A8\u02BB-\u02C1\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03CE\u03D0-\u03D6\u03DA\u03DC\u03DE\u03E0\u03E2-\u03F3\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E-\u0481\u0490-\u04C4\u04C7-\u04C8\u04CB-\u04CC\u04D0-\u04EB\u04EE-\u04F5\u04F8-\u04F9\u0531-\u0556\u0559\u0561-\u0586\u05D0-\u05EA\u05F0-\u05F2\u0621-\u063A\u0641-\u064A\u0671-\u06B7\u06BA-\u06BE\u06C0-\u06CE\u06D0-\u06D3\u06D5\u06E5-\u06E6\u0905-\u0939\u093D\u0958-\u0961\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09DC-\u09DD\u09DF-\u09E1\u09F0-\u09F1\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8B\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AE0\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B36-\u0B39\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB5\u0BB7-\u0BB9\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C60-\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CDE\u0CE0-\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D60-\u0D61\u0E01-\u0E2E\u0E30\u0E32-\u0E33\u0E40-\u0E45\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EAE\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0F40-\u0F47\u0F49-\u0F69\u10A0-\u10C5\u10D0-\u10F6\u1100\u1102-\u1103\u1105-\u1107\u1109\u110B-\u110C\u110E-\u1112\u113C\u113E\u1140\u114C\u114E\u1150\u1154-\u1155\u1159\u115F-\u1161\u1163\u1165\u1167\u1169\u116D-\u116E\u1172-\u1173\u1175\u119E\u11A8\u11AB\u11AE-\u11AF\u11B7-\u11B8\u11BA\u11BC-\u11C2\u11EB\u11F0\u11F9\u1E00-\u1E9B\u1EA0-\u1EF9\u1F00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2126\u212A-\u212B\u212E\u2180-\u2182\u3041-\u3094\u30A1-\u30FA\u3105-\u312C\uAC00-\uD7A3\u4E00-\u9FA5\u3007\u3021-\u3029_]';

RDFaProcessor.NCNAME = new RegExp('^' + RDFaProcessor.nameStartChar + RDFaProcessor.nameChar + '*$');

RDFaProcessor.trim = function (str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

RDFaProcessor.dateTimeTypes = [{ pattern: /-?P(?:[0-9]+Y)?(?:[0-9]+M)?(?:[0-9]+D)?(?:T(?:[0-9]+H)?(?:[0-9]+M)?(?:[0-9]+(?:\.[0-9]+)?S)?)?/,
  type: "http://www.w3.org/2001/XMLSchema#duration" }, { pattern: /-?(?:[1-9][0-9][0-9][0-9]|0[1-9][0-9][0-9]|00[1-9][0-9]|000[1-9])-[0-9][0-9]-[0-9][0-9]T(?:[0-1][0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9](?:\.[0-9]+)?(?:Z|[+\-][0-9][0-9]:[0-9][0-9])?/,
  type: "http://www.w3.org/2001/XMLSchema#dateTime" }, { pattern: /-?(?:[1-9][0-9][0-9][0-9]|0[1-9][0-9][0-9]|00[1-9][0-9]|000[1-9])-[0-9][0-9]-[0-9][0-9](?:Z|[+\-][0-9][0-9]:[0-9][0-9])?/,
  type: "http://www.w3.org/2001/XMLSchema#date" }, { pattern: /(?:[0-1][0-9]|2[0-4]):[0-5][0-9]:[0-5][0-9](?:\.[0-9]+)?(?:Z|[+\-][0-9][0-9]:[0-9][0-9])?/,
  type: "http://www.w3.org/2001/XMLSchema#time" }, { pattern: /-?(?:[1-9][0-9][0-9][0-9]|0[1-9][0-9][0-9]|00[1-9][0-9]|000[1-9])-[0-9][0-9]/,
  type: "http://www.w3.org/2001/XMLSchema#gYearMonth" }, { pattern: /-?[1-9][0-9][0-9][0-9]|0[1-9][0-9][0-9]|00[1-9][0-9]|000[1-9]/,
  type: "http://www.w3.org/2001/XMLSchema#gYear" }];

RDFaProcessor.deriveDateTimeType = function (value) {
  for (var i = 0; i < RDFaProcessor.dateTimeTypes.length; i++) {
    //console.log("Checking "+value+" against "+RDFaProcessor.dateTimeTypes[i].type);
    var matched = RDFaProcessor.dateTimeTypes[i].pattern.exec(value);
    if (matched && matched[0].length == value.length) {
      //console.log("Matched!");
      return RDFaProcessor.dateTimeTypes[i].type;
    }
  }
  return null;
};
module.exports = exports['default'];
},{"./node":5,"./uri-resolver":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var URIResolver = function () {
  function URIResolver() {
    _classCallCheck(this, URIResolver);
  }

  _createClass(URIResolver, [{
    key: 'parseURI',
    value: function parseURI(uri) {
      var match = URIResolver.SCHEME.exec(uri);
      if (!match) {
        throw new Error("Bad URI value, no scheme: " + uri);
      }
      var parsed = { spec: uri };
      parsed.scheme = match[0].substring(0, match[0].length - 1);
      parsed.schemeSpecificPart = parsed.spec.substring(match[0].length);
      if (parsed.schemeSpecificPart.charAt(0) == '/' && parsed.schemeSpecificPart.charAt(1) == '/') {
        this.parseGeneric(parsed);
      } else {
        parsed.isGeneric = false;
      }
      parsed.normalize = function () {
        if (!this.isGeneric) {
          return;
        }
        if (this.segments.length == 0) {
          return;
        }
        // edge case of ending in "/."
        if (this.path.length > 1 && this.path.substring(this.path.length - 2) == "/.") {
          this.path = this.path.substring(0, this.path.length - 1);
          this.segments.splice(this.segments.length - 1, 1);
          this.schemeSpecificPart = "//" + this.authority + this.path;
          if (typeof this.query != "undefined") {
            this.schemeSpecificPart += "?" + this.query;
          }
          if (typeof this.fragment != "undefined") {
            this.schemeSpecificPart += "#" + this.fragment;
          }
          this.spec = this.scheme + ":" + this.schemeSpecificPart;
          return;
        }
        var end = this.path.charAt(this.path.length - 1);
        if (end != "/") {
          end = "";
        }
        for (var i = 0; i < this.segments.length; i++) {
          if (i > 0 && this.segments[i] == "..") {
            this.segments.splice(i - 1, 2);
            i -= 2;
          }
          if (this.segments[i] == ".") {
            this.segments.splice(i, 1);
            i--;
          }
        }
        this.path = this.segments.length == 0 ? "/" : "/" + this.segments.join("/") + end;
        this.schemeSpecificPart = "//" + this.authority + this.path;
        if (typeof this.query != "undefined") {
          this.schemeSpecificPart += "?" + this.query;
        }
        if (typeof this.fragment != "undefined") {
          this.schemeSpecificPart += "#" + this.fragment;
        }
        this.spec = this.scheme + ":" + this.schemeSpecificPart;
      };

      parsed.resolve = function (href) {
        if (!href) {
          return this.spec;
        }
        if (href.charAt(0) == '#') {
          var lastHash = this.spec.lastIndexOf('#');
          return lastHash < 0 ? this.spec + href : this.spec.substring(0, lastHash) + href;
        }
        if (!this.isGeneric) {
          throw new Error("Cannot resolve uri against non-generic URI: " + this.spec);
        }
        var colon = href.indexOf(':');
        if (href.charAt(0) == '/') {
          return this.scheme + "://" + this.authority + href;
        } else if (href.charAt(0) == '.' && href.charAt(1) == '/') {
          if (this.path.charAt(this.path.length - 1) == '/') {
            return this.scheme + "://" + this.authority + this.path + href.substring(2);
          } else {
            var last = this.path.lastIndexOf('/');
            return this.scheme + "://" + this.authority + this.path.substring(0, last) + href.substring(1);
          }
        } else if (URIResolver.SCHEME.test(href)) {
          return href;
        } else if (href.charAt(0) == "?") {
          return this.scheme + "://" + this.authority + this.path + href;
        } else {
          if (this.path.charAt(this.path.length - 1) == '/') {
            return this.scheme + "://" + this.authority + this.path + href;
          } else {
            var last = this.path.lastIndexOf('/');
            return this.scheme + "://" + this.authority + this.path.substring(0, last + 1) + href;
          }
        }
      };

      parsed.relativeTo = function (otherURI) {
        if (otherURI.scheme != this.scheme) {
          return this.spec;
        }
        if (!this.isGeneric) {
          throw new Error("A non generic URI cannot be made relative: " + this.spec);
        }
        if (!otherURI.isGeneric) {
          throw new Error("Cannot make a relative URI against a non-generic URI: " + otherURI.spec);
        }
        if (otherURI.authority != this.authority) {
          return this.spec;
        }
        var i = 0;
        for (; i < this.segments.length && i < otherURI.segments.length; i++) {
          if (this.segments[i] != otherURI.segments[i]) {
            //alert(this.path+" different from "+otherURI.path+" at '"+this.segments[i]+"' vs '"+otherURI.segments[i]+"'");
            var offset = otherURI.path.charAt(otherURI.path.length - 1) == '/' ? 0 : -1;
            var relative = "";
            for (var j = i; j < otherURI.segments.length + offset; j++) {
              relative += "../";
            }
            for (var j = i; j < this.segments.length; j++) {
              relative += this.segments[j];
              if (j + 1 < this.segments.length) {
                relative += "/";
              }
            }
            if (this.path.charAt(this.path.length - 1) == '/') {
              relative += "/";
            }
            return relative;
          }
        }
        if (this.segments.length == otherURI.segments.length) {
          return this.hash ? this.hash : this.query ? this.query : "";
        } else if (i < this.segments.length) {
          var relative = "";
          for (var j = i; j < this.segments.length; j++) {
            relative += this.segments[j];
            if (j + 1 < this.segments.length) {
              relative += "/";
            }
          }
          if (this.path.charAt(this.path.length - 1) == '/') {
            relative += "/";
          }
          return relative;
        } else {
          throw new Error("Cannot calculate a relative URI for " + this.spec + " against " + otherURI.spec);
        }
      };
      return parsed;
    }
  }, {
    key: 'parseGeneric',
    value: function parseGeneric(parsed) {
      if (parsed.schemeSpecificPart.charAt(0) != '/' || parsed.schemeSpecificPart.charAt(1) != '/') {
        throw new Error("Generic URI values should start with '//':" + parsed.spec);
      }

      var work = parsed.schemeSpecificPart.substring(2);
      var pathStart = work.indexOf("/");
      parsed.authority = pathStart < 0 ? work : work.substring(0, pathStart);
      parsed.path = pathStart < 0 ? "" : work.substring(pathStart);
      var hash = parsed.path.indexOf('#');
      if (hash >= 0) {
        parsed.fragment = parsed.path.substring(hash + 1);
        parsed.path = parsed.path.substring(0, hash);
      }
      var questionMark = parsed.path.indexOf('?');
      if (questionMark >= 0) {
        parsed.query = parsed.path.substring(questionMark + 1);
        parsed.path = parsed.path.substring(0, questionMark);
      }
      if (parsed.path == "/" || parsed.path == "") {
        parsed.segments = [];
      } else {
        parsed.segments = parsed.path.split(/\//);
        if (parsed.segments.length > 0 && parsed.segments[0] == '' && parsed.path.length > 1 && parsed.path.charAt(1) != '/') {
          // empty segment at the start, remove it
          parsed.segments.shift();
        }
        if (parsed.segments.length > 0 && parsed.path.length > 0 && parsed.path.charAt(parsed.path.length - 1) == '/' && parsed.segments[parsed.segments.length - 1] == '') {
          // we may have an empty the end
          // check to see if it is legimate
          if (parsed.path.length > 1 && parsed.path.charAt(parsed.path.length - 2) != '/') {
            parsed.segments.pop();
          }
        }
        // check for non-escaped characters
        for (var i = 0; i < parsed.segments.length; i++) {
          var check = parsed.segments[i].split(/%[A-Za-z0-9][A-Za-z0-9]|[\ud800-\udfff][\ud800-\udfff]|[A-Za-z0-9\-\._~!$&'()*+,;=@:\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/);

          for (var j = 0; j < check.length; j++) {
            if (check[j].length > 0) {
              throw new Error("Unecaped character " + check[j].charAt(0) + " (" + check[j].charCodeAt(0) + ") in URI " + parsed.spec);
            }
          }
        }
      }
      parsed.isGeneric = true;
    }
  }]);

  return URIResolver;
}();

exports.default = URIResolver;


URIResolver.SCHEME = /^[A-Za-z][A-Za-z0-9\+\-\.]*\:/;
module.exports = exports['default'];
},{}],9:[function(require,module,exports){

/**
 * Expose `isUrl`.
 */

module.exports = isUrl;

/**
 * Matcher.
 */

var matcher = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;

/**
 * Loosely validate a URL `string`.
 *
 * @param {String} string
 * @return {Boolean}
 */

function isUrl(string){
  return matcher.test(string);
}

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var jsdom = {
  env: function env(config) {
    if (config.done) {
      config.done(new Error('Only DOM elements are supported in a browser environment'));
    }
  }
};

exports.default = jsdom;
module.exports = exports['default'];
},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var XMLSerializer = exports.XMLSerializer = window.XMLSerializer;
},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // see ./browser/jsdom.js for browser version
// see ./browser/xmldom.js for browser version


exports.default = jsonldRdfaParser;

var _graphRdfaProcessor = require('graph-rdfa-processor');

var _graphRdfaProcessor2 = _interopRequireDefault(_graphRdfaProcessor);

var _jsdom = require('jsdom');

var _jsdom2 = _interopRequireDefault(_jsdom);

var _xmldom = require('xmldom');

var _isUrl = require('is-url');

var _isUrl2 = _interopRequireDefault(_isUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
var RDF_XML_LITERAL = RDF + 'XMLLiteral';
var RDF_HTML_LITERAL = RDF + 'HTML';
var RDF_OBJECT = RDF + 'object';
var RDF_PLAIN_LITERAL = RDF + 'PlainLiteral';
var RDF_LANGSTRING = RDF + 'langString';
var XSD_STRING = 'http://www.w3.org/2001/XMLSchema#string';

/**
 * @param data - a filePath, HTML string or URL
 */
function jsonldRdfaParser(data, callback) {
  if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && 'nodeType' in data) {
    process(data);
  } else if (typeof data === 'string') {
    var config = {
      done: function done(err, window) {
        if (err) return callback(err);
        process(window.document);
      }
    };
    if ((0, _isUrl2.default)(data)) config.url = data;else if (/<[a-z][\s\S]*>/i.test(data)) config.html = data;else config.file = data;
    _jsdom2.default.env(config);
  } else {
    return callback(new Error('data must be a file path, HTML string, URL or a DOM element'));
  }

  function process(node) {
    var opts = void 0;
    if (!node.baseURI || node.baseURI === 'about:blank') {
      opts = { baseURI: 'http://localhost/' };
    }

    var dataset = void 0,
        processingError = void 0;
    try {
      var graph = (0, _graphRdfaProcessor2.default)(node, opts);
      dataset = processGraph(graph);
    } catch (e) {
      processingError = e;
    }
    callback(processingError, dataset);
  }
}

/**
 * This function is mostly taken from the jsonld.js lib but updated to
 * the latest green-turtle API, and for support for HTML
 */
function processGraph(data) {
  var dataset = {
    '@default': []
  };

  var subjects = data.subjects,
      htmlMapper = function htmlMapper(n) {
    var div = n.ownerDocument.createElement('div');
    div.appendChild(n.cloneNode(true));
    return div.innerHTML;
  };
  Object.keys(subjects).forEach(function (subject) {
    var predicates = subjects[subject].predicates;
    Object.keys(predicates).forEach(function (predicate) {
      // iterate over objects
      var objects = predicates[predicate].objects;
      for (var oi = 0; oi < objects.length; ++oi) {
        var object = objects[oi];

        // create RDF triple
        var triple = {};

        // add subject & predicate
        triple.subject = {
          type: subject.indexOf('_:') === 0 ? 'blank node' : 'IRI',
          value: subject
        };
        triple.predicate = {
          type: predicate.indexOf('_:') === 0 ? 'blank node' : 'IRI',
          value: predicate
        };
        triple.object = {};

        // serialize XML literal
        var value = object.value;
        // !!! TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // The below actually most likely does NOT work.
        // In most usage contexts this will be an HTML DOM, passing it to xmldom's XMLSerializer
        // will cause it to call .toString() on all the nodes it finds — this only works inside
        // xmldom.
        if (object.type === RDF_XML_LITERAL) {
          (function () {
            // initialize XMLSerializer
            var serializer = new _xmldom.XMLSerializer();
            value = Array.from(object.value).map(function (n) {
              return serializer.serializeToString(n);
            }).join('');
            triple.object.datatype = RDF_XML_LITERAL;
          })();
        }
        // serialise HTML literal
        else if (object.type === RDF_HTML_LITERAL) {
            value = Array.from(object.value).map(htmlMapper).join('');
            triple.object.datatype = RDF_HTML_LITERAL;
          }
          // object is an IRI
          else if (object.type === RDF_OBJECT) {
              if (object.value.indexOf('_:') === 0) triple.object.type = 'blank node';else triple.object.type = 'IRI';
            } else {
              // object is a literal
              triple.object.type = 'literal';
              if (object.type === RDF_PLAIN_LITERAL) {
                if (object.language) {
                  triple.object.datatype = RDF_LANGSTRING;
                  triple.object.language = object.language;
                } else {
                  triple.object.datatype = XSD_STRING;
                }
              } else {
                triple.object.datatype = object.type;
              }
            }
        triple.object.value = value;

        // add triple to dataset in default graph
        dataset['@default'].push(triple);
      }
    });
  });

  return dataset;
}
module.exports = exports['default'];
},{"graph-rdfa-processor":4,"is-url":9,"jsdom":10,"xmldom":11}],13:[function(require,module,exports){
// Ignore module for browserify (see package.json)
},{}],14:[function(require,module,exports){
(function (process,global,__dirname){
/**
 * A JavaScript implementation of the JSON-LD API.
 *
 * @author Dave Longley
 *
 * @license BSD 3-Clause License
 * Copyright (c) 2011-2015 Digital Bazaar, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * Neither the name of the Digital Bazaar, Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
(function() {

// determine if in-browser or using node.js
var _nodejs = (
  typeof process !== 'undefined' && process.versions && process.versions.node);
var _browser = !_nodejs &&
  (typeof window !== 'undefined' || typeof self !== 'undefined');
if(_browser) {
  if(typeof global === 'undefined') {
    if(typeof window !== 'undefined') {
      global = window;
    } else if(typeof self !== 'undefined') {
      global = self;
    } else if(typeof $ !== 'undefined') {
      global = $;
    }
  }
}

// attaches jsonld API to the given object
var wrapper = function(jsonld) {

/* Core API */

/**
 * Performs JSON-LD compaction.
 *
 * @param input the JSON-LD input to compact.
 * @param ctx the context to compact with.
 * @param [options] options to use:
 *          [base] the base IRI to use.
 *          [compactArrays] true to compact arrays to single values when
 *            appropriate, false not to (default: true).
 *          [graph] true to always output a top-level graph (default: false).
 *          [expandContext] a context to expand with.
 *          [skipExpansion] true to assume the input is expanded and skip
 *            expansion, false not to, defaults to false.
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param callback(err, compacted, ctx) called once the operation completes.
 */
jsonld.compact = function(input, ctx, options, callback) {
  if(arguments.length < 2) {
    return jsonld.nextTick(function() {
      callback(new TypeError('Could not compact, too few arguments.'));
    });
  }

  // get arguments
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  if(ctx === null) {
    return jsonld.nextTick(function() {
      callback(new JsonLdError(
        'The compaction context must not be null.',
        'jsonld.CompactError', {code: 'invalid local context'}));
    });
  }

  // nothing to compact
  if(input === null) {
    return jsonld.nextTick(function() {
      callback(null, null);
    });
  }

  // set default options
  if(!('base' in options)) {
    options.base = (typeof input === 'string') ? input : '';
  }
  if(!('compactArrays' in options)) {
    options.compactArrays = true;
  }
  if(!('graph' in options)) {
    options.graph = false;
  }
  if(!('skipExpansion' in options)) {
    options.skipExpansion = false;
  }
  if(!('documentLoader' in options)) {
    options.documentLoader = jsonld.loadDocument;
  }
  if(!('link' in options)) {
    options.link = false;
  }
  if(options.link) {
    // force skip expansion when linking, "link" is not part of the public
    // API, it should only be called from framing
    options.skipExpansion = true;
  }

  var expand = function(input, options, callback) {
    if(options.skipExpansion) {
      return jsonld.nextTick(function() {
        callback(null, input);
      });
    }
    jsonld.expand(input, options, callback);
  };

  // expand input then do compaction
  expand(input, options, function(err, expanded) {
    if(err) {
      return callback(new JsonLdError(
        'Could not expand input before compaction.',
        'jsonld.CompactError', {cause: err}));
    }

    // process context
    var activeCtx = _getInitialContext(options);
    jsonld.processContext(activeCtx, ctx, options, function(err, activeCtx) {
      if(err) {
        return callback(new JsonLdError(
          'Could not process context before compaction.',
          'jsonld.CompactError', {cause: err}));
      }

      var compacted;
      try {
        // do compaction
        compacted = new Processor().compact(activeCtx, null, expanded, options);
      } catch(ex) {
        return callback(ex);
      }

      cleanup(null, compacted, activeCtx, options);
    });
  });

  // performs clean up after compaction
  function cleanup(err, compacted, activeCtx, options) {
    if(err) {
      return callback(err);
    }

    if(options.compactArrays && !options.graph && _isArray(compacted)) {
      if(compacted.length === 1) {
        // simplify to a single item
        compacted = compacted[0];
      } else if(compacted.length === 0) {
        // simplify to an empty object
        compacted = {};
      }
    } else if(options.graph && _isObject(compacted)) {
      // always use array if graph option is on
      compacted = [compacted];
    }

    // follow @context key
    if(_isObject(ctx) && '@context' in ctx) {
      ctx = ctx['@context'];
    }

    // build output context
    ctx = _clone(ctx);
    if(!_isArray(ctx)) {
      ctx = [ctx];
    }
    // remove empty contexts
    var tmp = ctx;
    ctx = [];
    for(var i = 0; i < tmp.length; ++i) {
      if(!_isObject(tmp[i]) || Object.keys(tmp[i]).length > 0) {
        ctx.push(tmp[i]);
      }
    }

    // remove array if only one context
    var hasContext = (ctx.length > 0);
    if(ctx.length === 1) {
      ctx = ctx[0];
    }

    // add context and/or @graph
    if(_isArray(compacted)) {
      // use '@graph' keyword
      var kwgraph = _compactIri(activeCtx, '@graph');
      var graph = compacted;
      compacted = {};
      if(hasContext) {
        compacted['@context'] = ctx;
      }
      compacted[kwgraph] = graph;
    } else if(_isObject(compacted) && hasContext) {
      // reorder keys so @context is first
      var graph = compacted;
      compacted = {'@context': ctx};
      for(var key in graph) {
        compacted[key] = graph[key];
      }
    }

    callback(null, compacted, activeCtx);
  }
};

/**
 * Performs JSON-LD expansion.
 *
 * @param input the JSON-LD input to expand.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [keepFreeFloatingNodes] true to keep free-floating nodes,
 *            false not to, defaults to false.
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param callback(err, expanded) called once the operation completes.
 */
jsonld.expand = function(input, options, callback) {
  if(arguments.length < 1) {
    return jsonld.nextTick(function() {
      callback(new TypeError('Could not expand, too few arguments.'));
    });
  }

  // get arguments
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  // set default options
  if(!('documentLoader' in options)) {
    options.documentLoader = jsonld.loadDocument;
  }
  if(!('keepFreeFloatingNodes' in options)) {
    options.keepFreeFloatingNodes = false;
  }

  jsonld.nextTick(function() {
    // if input is a string, attempt to dereference remote document
    if(typeof input === 'string') {
      var done = function(err, remoteDoc) {
        if(err) {
          return callback(err);
        }
        try {
          if(!remoteDoc.document) {
            throw new JsonLdError(
              'No remote document found at the given URL.',
              'jsonld.NullRemoteDocument');
          }
          if(typeof remoteDoc.document === 'string') {
            remoteDoc.document = JSON.parse(remoteDoc.document);
          }
        } catch(ex) {
          return callback(new JsonLdError(
            'Could not retrieve a JSON-LD document from the URL. URL ' +
            'dereferencing not implemented.', 'jsonld.LoadDocumentError', {
              code: 'loading document failed',
              cause: ex,
              remoteDoc: remoteDoc
          }));
        }
        expand(remoteDoc);
      };
      var promise = options.documentLoader(input, done);
      if(promise && 'then' in promise) {
        promise.then(done.bind(null, null), done);
      }
      return;
    }
    // nothing to load
    expand({contextUrl: null, documentUrl: null, document: input});
  });

  function expand(remoteDoc) {
    // set default base
    if(!('base' in options)) {
      options.base = remoteDoc.documentUrl || '';
    }
    // build meta-object and retrieve all @context URLs
    var input = {
      document: _clone(remoteDoc.document),
      remoteContext: {'@context': remoteDoc.contextUrl}
    };
    if('expandContext' in options) {
      var expandContext = _clone(options.expandContext);
      if(typeof expandContext === 'object' && '@context' in expandContext) {
        input.expandContext = expandContext;
      } else {
        input.expandContext = {'@context': expandContext};
      }
    }
    _retrieveContextUrls(input, options, function(err, input) {
      if(err) {
        return callback(err);
      }

      var expanded;
      try {
        var processor = new Processor();
        var activeCtx = _getInitialContext(options);
        var document = input.document;
        var remoteContext = input.remoteContext['@context'];

        // process optional expandContext
        if(input.expandContext) {
          activeCtx = processor.processContext(
            activeCtx, input.expandContext['@context'], options);
        }

        // process remote context from HTTP Link Header
        if(remoteContext) {
          activeCtx = processor.processContext(
            activeCtx, remoteContext, options);
        }

        // expand document
        expanded = processor.expand(
          activeCtx, null, document, options, false);

        // optimize away @graph with no other properties
        if(_isObject(expanded) && ('@graph' in expanded) &&
          Object.keys(expanded).length === 1) {
          expanded = expanded['@graph'];
        } else if(expanded === null) {
          expanded = [];
        }

        // normalize to an array
        if(!_isArray(expanded)) {
          expanded = [expanded];
        }
      } catch(ex) {
        return callback(ex);
      }
      callback(null, expanded);
    });
  }
};

/**
 * Performs JSON-LD flattening.
 *
 * @param input the JSON-LD to flatten.
 * @param ctx the context to use to compact the flattened output, or null.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param callback(err, flattened) called once the operation completes.
 */
jsonld.flatten = function(input, ctx, options, callback) {
  if(arguments.length < 1) {
    return jsonld.nextTick(function() {
      callback(new TypeError('Could not flatten, too few arguments.'));
    });
  }

  // get arguments
  if(typeof options === 'function') {
    callback = options;
    options = {};
  } else if(typeof ctx === 'function') {
    callback = ctx;
    ctx = null;
    options = {};
  }
  options = options || {};

  // set default options
  if(!('base' in options)) {
    options.base = (typeof input === 'string') ? input : '';
  }
  if(!('documentLoader' in options)) {
    options.documentLoader = jsonld.loadDocument;
  }

  // expand input
  jsonld.expand(input, options, function(err, _input) {
    if(err) {
      return callback(new JsonLdError(
        'Could not expand input before flattening.',
        'jsonld.FlattenError', {cause: err}));
    }

    var flattened;
    try {
      // do flattening
      flattened = new Processor().flatten(_input);
    } catch(ex) {
      return callback(ex);
    }

    if(ctx === null) {
      return callback(null, flattened);
    }

    // compact result (force @graph option to true, skip expansion)
    options.graph = true;
    options.skipExpansion = true;
    jsonld.compact(flattened, ctx, options, function(err, compacted) {
      if(err) {
        return callback(new JsonLdError(
          'Could not compact flattened output.',
          'jsonld.FlattenError', {cause: err}));
      }
      callback(null, compacted);
    });
  });
};

/**
 * Performs JSON-LD framing.
 *
 * @param input the JSON-LD input to frame.
 * @param frame the JSON-LD frame to use.
 * @param [options] the framing options.
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [embed] default @embed flag: '@last', '@always', '@never', '@link'
 *            (default: '@last').
 *          [explicit] default @explicit flag (default: false).
 *          [requireAll] default @requireAll flag (default: true).
 *          [omitDefault] default @omitDefault flag (default: false).
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param callback(err, framed) called once the operation completes.
 */
jsonld.frame = function(input, frame, options, callback) {
  if(arguments.length < 2) {
    return jsonld.nextTick(function() {
      callback(new TypeError('Could not frame, too few arguments.'));
    });
  }

  // get arguments
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  // set default options
  if(!('base' in options)) {
    options.base = (typeof input === 'string') ? input : '';
  }
  if(!('documentLoader' in options)) {
    options.documentLoader = jsonld.loadDocument;
  }
  if(!('embed' in options)) {
    options.embed = '@last';
  }
  options.explicit = options.explicit || false;
  if(!('requireAll' in options)) {
    options.requireAll = true;
  }
  options.omitDefault = options.omitDefault || false;

  jsonld.nextTick(function() {
    // if frame is a string, attempt to dereference remote document
    if(typeof frame === 'string') {
      var done = function(err, remoteDoc) {
        if(err) {
          return callback(err);
        }
        try {
          if(!remoteDoc.document) {
            throw new JsonLdError(
              'No remote document found at the given URL.',
              'jsonld.NullRemoteDocument');
          }
          if(typeof remoteDoc.document === 'string') {
            remoteDoc.document = JSON.parse(remoteDoc.document);
          }
        } catch(ex) {
          return callback(new JsonLdError(
            'Could not retrieve a JSON-LD document from the URL. URL ' +
            'dereferencing not implemented.', 'jsonld.LoadDocumentError', {
              code: 'loading document failed',
              cause: ex,
              remoteDoc: remoteDoc
          }));
        }
        doFrame(remoteDoc);
      };
      var promise = options.documentLoader(frame, done);
      if(promise && 'then' in promise) {
        promise.then(done.bind(null, null), done);
      }
      return;
    }
    // nothing to load
    doFrame({contextUrl: null, documentUrl: null, document: frame});
  });

  function doFrame(remoteFrame) {
    // preserve frame context and add any Link header context
    var frame = remoteFrame.document;
    var ctx;
    if(frame) {
      ctx = frame['@context'];
      if(remoteFrame.contextUrl) {
        if(!ctx) {
          ctx = remoteFrame.contextUrl;
        } else if(_isArray(ctx)) {
          ctx.push(remoteFrame.contextUrl);
        } else {
          ctx = [ctx, remoteFrame.contextUrl];
        }
        frame['@context'] = ctx;
      } else {
        ctx = ctx || {};
      }
    } else {
      ctx = {};
    }

    // expand input
    jsonld.expand(input, options, function(err, expanded) {
      if(err) {
        return callback(new JsonLdError(
          'Could not expand input before framing.',
          'jsonld.FrameError', {cause: err}));
      }

      // expand frame
      var opts = _clone(options);
      opts.isFrame = true;
      opts.keepFreeFloatingNodes = true;
      jsonld.expand(frame, opts, function(err, expandedFrame) {
        if(err) {
          return callback(new JsonLdError(
            'Could not expand frame before framing.',
            'jsonld.FrameError', {cause: err}));
        }

        var framed;
        try {
          // do framing
          framed = new Processor().frame(expanded, expandedFrame, opts);
        } catch(ex) {
          return callback(ex);
        }

        // compact result (force @graph option to true, skip expansion,
        // check for linked embeds)
        opts.graph = true;
        opts.skipExpansion = true;
        opts.link = {};
        jsonld.compact(framed, ctx, opts, function(err, compacted, ctx) {
          if(err) {
            return callback(new JsonLdError(
              'Could not compact framed output.',
              'jsonld.FrameError', {cause: err}));
          }
          // get graph alias
          var graph = _compactIri(ctx, '@graph');
          // remove @preserve from results
          opts.link = {};
          compacted[graph] = _removePreserve(ctx, compacted[graph], opts);
          callback(null, compacted);
        });
      });
    });
  }
};

/**
 * **Experimental**
 *
 * Links a JSON-LD document's nodes in memory.
 *
 * @param input the JSON-LD document to link.
 * @param ctx the JSON-LD context to apply.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param callback(err, linked) called once the operation completes.
 */
jsonld.link = function(input, ctx, options, callback) {
  // API matches running frame with a wildcard frame and embed: '@link'
  // get arguments
  var frame = {};
  if(ctx) {
    frame['@context'] = ctx;
  }
  frame['@embed'] = '@link';
  jsonld.frame(input, frame, options, callback);
};

/**
 * **Deprecated**
 *
 * Performs JSON-LD objectification.
 *
 * @param input the JSON-LD document to objectify.
 * @param ctx the JSON-LD context to apply.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param callback(err, linked) called once the operation completes.
 */
jsonld.objectify = function(input, ctx, options, callback) {
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  // set default options
  if(!('base' in options)) {
    options.base = (typeof input === 'string') ? input : '';
  }
  if(!('documentLoader' in options)) {
    options.documentLoader = jsonld.loadDocument;
  }

  // expand input
  jsonld.expand(input, options, function(err, _input) {
    if(err) {
      return callback(new JsonLdError(
        'Could not expand input before linking.',
        'jsonld.LinkError', {cause: err}));
    }

    var flattened;
    try {
      // flatten the graph
      flattened = new Processor().flatten(_input);
    } catch(ex) {
      return callback(ex);
    }

    // compact result (force @graph option to true, skip expansion)
    options.graph = true;
    options.skipExpansion = true;
    jsonld.compact(flattened, ctx, options, function(err, compacted, ctx) {
      if(err) {
        return callback(new JsonLdError(
          'Could not compact flattened output before linking.',
          'jsonld.LinkError', {cause: err}));
      }
      // get graph alias
      var graph = _compactIri(ctx, '@graph');
      var top = compacted[graph][0];

      var recurse = function(subject) {
        // can't replace just a string
        if(!_isObject(subject) && !_isArray(subject)) {
          return;
        }

        // bottom out recursion on re-visit
        if(_isObject(subject)) {
          if(recurse.visited[subject['@id']]) {
            return;
          }
          recurse.visited[subject['@id']] = true;
        }

        // each array element *or* object key
        for(var k in subject) {
          var obj = subject[k];
          var isid = (jsonld.getContextValue(ctx, k, '@type') === '@id');

          // can't replace a non-object or non-array unless it's an @id
          if(!_isArray(obj) && !_isObject(obj) && !isid) {
            continue;
          }

          if(_isString(obj) && isid) {
            subject[k] = obj = top[obj];
            recurse(obj);
          } else if(_isArray(obj)) {
            for(var i = 0; i < obj.length; ++i) {
              if(_isString(obj[i]) && isid) {
                obj[i] = top[obj[i]];
              } else if(_isObject(obj[i]) && '@id' in obj[i]) {
                obj[i] = top[obj[i]['@id']];
              }
              recurse(obj[i]);
            }
          } else if(_isObject(obj)) {
            var sid = obj['@id'];
            subject[k] = obj = top[sid];
            recurse(obj);
          }
        }
      };
      recurse.visited = {};
      recurse(top);

      compacted.of_type = {};
      for(var s in top) {
        if(!('@type' in top[s])) {
          continue;
        }
        var types = top[s]['@type'];
        if(!_isArray(types)) {
          types = [types];
        }
        for(var t = 0; t < types.length; ++t) {
          if(!(types[t] in compacted.of_type)) {
            compacted.of_type[types[t]] = [];
          }
          compacted.of_type[types[t]].push(top[s]);
        }
      }
      callback(null, compacted);
    });
  });
};

/**
 * Performs RDF dataset normalization on the given input. The input is JSON-LD
 * unless the 'inputFormat' option is used. The output is an RDF dataset
 * unless the 'format' option is used.
 *
 * @param input the input to normalize as JSON-LD or as a format specified by
 *          the 'inputFormat' option.
 * @param [options] the options to use:
 *          [algorithm] the normalization algorithm to use, `URDNA2015` or
 *            `URGNA2012` (default: `URGNA2012`).
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [inputFormat] the format if input is not JSON-LD:
 *            'application/nquads' for N-Quads.
 *          [format] the format if output is a string:
 *            'application/nquads' for N-Quads.
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param callback(err, normalized) called once the operation completes.
 */
jsonld.normalize = function(input, options, callback) {
  if(arguments.length < 1) {
    return jsonld.nextTick(function() {
      callback(new TypeError('Could not normalize, too few arguments.'));
    });
  }

  // get arguments
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  // set default options
  if(!('algorithm' in options)) {
    options.algorithm = 'URGNA2012';
  }
  if(!('base' in options)) {
    options.base = (typeof input === 'string') ? input : '';
  }
  if(!('documentLoader' in options)) {
    options.documentLoader = jsonld.loadDocument;
  }

  if('inputFormat' in options) {
    if(options.inputFormat !== 'application/nquads') {
      return callback(new JsonLdError(
        'Unknown normalization input format.',
        'jsonld.NormalizeError'));
    }
    var parsedInput = _parseNQuads(input);
    // do normalization
    new Processor().normalize(parsedInput, options, callback);
  } else {
    // convert to RDF dataset then do normalization
    var opts = _clone(options);
    delete opts.format;
    opts.produceGeneralizedRdf = false;
    jsonld.toRDF(input, opts, function(err, dataset) {
      if(err) {
        return callback(new JsonLdError(
          'Could not convert input to RDF dataset before normalization.',
          'jsonld.NormalizeError', {cause: err}));
      }
      // do normalization
      new Processor().normalize(dataset, options, callback);
    });
  }
};

/**
 * Converts an RDF dataset to JSON-LD.
 *
 * @param dataset a serialized string of RDF in a format specified by the
 *          format option or an RDF dataset to convert.
 * @param [options] the options to use:
 *          [format] the format if dataset param must first be parsed:
 *            'application/nquads' for N-Quads (default).
 *          [rdfParser] a custom RDF-parser to use to parse the dataset.
 *          [useRdfType] true to use rdf:type, false to use @type
 *            (default: false).
 *          [useNativeTypes] true to convert XSD types into native types
 *            (boolean, integer, double), false not to (default: false).
 * @param callback(err, output) called once the operation completes.
 */
jsonld.fromRDF = function(dataset, options, callback) {
  if(arguments.length < 1) {
    return jsonld.nextTick(function() {
      callback(new TypeError('Could not convert from RDF, too few arguments.'));
    });
  }

  // get arguments
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  // set default options
  if(!('useRdfType' in options)) {
    options.useRdfType = false;
  }
  if(!('useNativeTypes' in options)) {
    options.useNativeTypes = false;
  }

  if(!('format' in options) && _isString(dataset)) {
    // set default format to nquads
    if(!('format' in options)) {
      options.format = 'application/nquads';
    }
  }

  jsonld.nextTick(function() {
    // handle special format
    var rdfParser;
    if(options.format) {
      // check supported formats
      rdfParser = options.rdfParser || _rdfParsers[options.format];
      if(!rdfParser) {
        return callback(new JsonLdError(
          'Unknown input format.',
          'jsonld.UnknownFormat', {format: options.format}));
      }
    } else {
      // no-op parser, assume dataset already parsed
      rdfParser = function() {
        return dataset;
      };
    }

    var callbackCalled = false;
    try {
      // rdf parser may be async or sync, always pass callback
      dataset = rdfParser(dataset, function(err, dataset) {
        callbackCalled = true;
        if(err) {
          return callback(err);
        }
        fromRDF(dataset, options, callback);
      });
    } catch(e) {
      if(!callbackCalled) {
        return callback(e);
      }
      throw e;
    }
    // handle synchronous or promise-based parser
    if(dataset) {
      // if dataset is actually a promise
      if('then' in dataset) {
        return dataset.then(function(dataset) {
          fromRDF(dataset, options, callback);
        }, callback);
      }
      // parser is synchronous
      fromRDF(dataset, options, callback);
    }

    function fromRDF(dataset, options, callback) {
      // convert from RDF
      new Processor().fromRDF(dataset, options, callback);
    }
  });
};

/**
 * Outputs the RDF dataset found in the given JSON-LD object.
 *
 * @param input the JSON-LD input.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [format] the format to use to output a string:
 *            'application/nquads' for N-Quads.
 *          [produceGeneralizedRdf] true to output generalized RDF, false
 *            to produce only standard RDF (default: false).
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param callback(err, dataset) called once the operation completes.
 */
jsonld.toRDF = function(input, options, callback) {
  if(arguments.length < 1) {
    return jsonld.nextTick(function() {
      callback(new TypeError('Could not convert to RDF, too few arguments.'));
    });
  }

  // get arguments
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  // set default options
  if(!('base' in options)) {
    options.base = (typeof input === 'string') ? input : '';
  }
  if(!('documentLoader' in options)) {
    options.documentLoader = jsonld.loadDocument;
  }

  // expand input
  jsonld.expand(input, options, function(err, expanded) {
    if(err) {
      return callback(new JsonLdError(
        'Could not expand input before serialization to RDF.',
        'jsonld.RdfError', {cause: err}));
    }

    var dataset;
    try {
      // output RDF dataset
      dataset = Processor.prototype.toRDF(expanded, options);
      if(options.format) {
        if(options.format === 'application/nquads') {
          return callback(null, _toNQuads(dataset));
        }
        throw new JsonLdError(
          'Unknown output format.',
          'jsonld.UnknownFormat', {format: options.format});
      }
    } catch(ex) {
      return callback(ex);
    }
    callback(null, dataset);
  });
};

/**
 * **Experimental**
 *
 * Recursively flattens the nodes in the given JSON-LD input into a map of
 * node ID => node.
 *
 * @param input the JSON-LD input.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [issuer] a jsonld.IdentifierIssuer to use to label blank nodes.
 *          [namer] (deprecated)
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param callback(err, nodeMap) called once the operation completes.
 */
jsonld.createNodeMap = function(input, options, callback) {
  if(arguments.length < 1) {
    return jsonld.nextTick(function() {
      callback(new TypeError('Could not create node map, too few arguments.'));
    });
  }

  // get arguments
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  // set default options
  if(!('base' in options)) {
    options.base = (typeof input === 'string') ? input : '';
  }
  if(!('documentLoader' in options)) {
    options.documentLoader = jsonld.loadDocument;
  }

  // expand input
  jsonld.expand(input, options, function(err, _input) {
    if(err) {
      return callback(new JsonLdError(
        'Could not expand input before creating node map.',
        'jsonld.CreateNodeMapError', {cause: err}));
    }

    var nodeMap;
    try {
      nodeMap = new Processor().createNodeMap(_input, options);
    } catch(ex) {
      return callback(ex);
    }

    callback(null, nodeMap);
  });
};

/**
 * **Experimental**
 *
 * Merges two or more JSON-LD documents into a single flattened document.
 *
 * @param docs the JSON-LD documents to merge together.
 * @param ctx the context to use to compact the merged result, or null.
 * @param [options] the options to use:
 *          [base] the base IRI to use.
 *          [expandContext] a context to expand with.
 *          [issuer] a jsonld.IdentifierIssuer to use to label blank nodes.
 *          [namer] (deprecated).
 *          [mergeNodes] true to merge properties for nodes with the same ID,
 *            false to ignore new properties for nodes with the same ID once
 *            the ID has been defined; note that this may not prevent merging
 *            new properties where a node is in the `object` position
 *            (default: true).
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param callback(err, merged) called once the operation completes.
 */
jsonld.merge = function(docs, ctx, options, callback) {
  if(arguments.length < 1) {
    return jsonld.nextTick(function() {
      callback(new TypeError('Could not merge, too few arguments.'));
    });
  }
  if(!_isArray(docs)) {
    return jsonld.nextTick(function() {
      callback(new TypeError('Could not merge, "docs" must be an array.'));
    });
  }

  // get arguments
  if(typeof options === 'function') {
    callback = options;
    options = {};
  } else if(typeof ctx === 'function') {
    callback = ctx;
    ctx = null;
    options = {};
  }
  options = options || {};

  // expand all documents
  var expanded = [];
  var error = null;
  var count = docs.length;
  for(var i = 0; i < docs.length; ++i) {
    var opts = {};
    for(var key in options) {
      opts[key] = options[key];
    }
    jsonld.expand(docs[i], opts, expandComplete);
  }

  function expandComplete(err, _input) {
    if(error) {
      return;
    }
    if(err) {
      error = err;
      return callback(new JsonLdError(
        'Could not expand input before flattening.',
        'jsonld.FlattenError', {cause: err}));
    }
    expanded.push(_input);
    if(--count === 0) {
      merge(expanded);
    }
  }

  function merge(expanded) {
    var mergeNodes = true;
    if('mergeNodes' in options) {
      mergeNodes = options.mergeNodes;
    }

    var issuer = options.namer || options.issuer || new IdentifierIssuer('_:b');
    var graphs = {'@default': {}};

    var defaultGraph;
    try {
      for(var i = 0; i < expanded.length; ++i) {
        // uniquely relabel blank nodes
        var doc = expanded[i];
        doc = jsonld.relabelBlankNodes(doc, {
          issuer: new IdentifierIssuer('_:b' + i + '-')
        });

        // add nodes to the shared node map graphs if merging nodes, to a
        // separate graph set if not
        var _graphs = (mergeNodes || i === 0) ? graphs : {'@default': {}};
        _createNodeMap(doc, _graphs, '@default', issuer);

        if(_graphs !== graphs) {
          // merge document graphs but don't merge existing nodes
          for(var graphName in _graphs) {
            var _nodeMap = _graphs[graphName];
            if(!(graphName in graphs)) {
              graphs[graphName] = _nodeMap;
              continue;
            }
            var nodeMap = graphs[graphName];
            for(var key in _nodeMap) {
              if(!(key in nodeMap)) {
                nodeMap[key] = _nodeMap[key];
              }
            }
          }
        }
      }

      // add all non-default graphs to default graph
      defaultGraph = _mergeNodeMaps(graphs);
    } catch(ex) {
      return callback(ex);
    }

    // produce flattened output
    var flattened = [];
    var keys = Object.keys(defaultGraph).sort();
    for(var ki = 0; ki < keys.length; ++ki) {
      var node = defaultGraph[keys[ki]];
      // only add full subjects to top-level
      if(!_isSubjectReference(node)) {
        flattened.push(node);
      }
    }

    if(ctx === null) {
      return callback(null, flattened);
    }

    // compact result (force @graph option to true, skip expansion)
    options.graph = true;
    options.skipExpansion = true;
    jsonld.compact(flattened, ctx, options, function(err, compacted) {
      if(err) {
        return callback(new JsonLdError(
          'Could not compact merged output.',
          'jsonld.MergeError', {cause: err}));
      }
      callback(null, compacted);
    });
  }
};

/**
 * Relabels all blank nodes in the given JSON-LD input.
 *
 * @param input the JSON-LD input.
 * @param [options] the options to use:
 *          [issuer] a jsonld.IdentifierIssuer to use to label blank nodes.
 *          [namer] (deprecated).
 */
jsonld.relabelBlankNodes = function(input, options) {
  options = options || {};
  var issuer = options.namer || options.issuer || new IdentifierIssuer('_:b');
  return _labelBlankNodes(issuer, input);
};

/**
 * Prepends a base IRI to the given relative IRI.
 *
 * @param base the base IRI.
 * @param iri the relative IRI.
 *
 * @return the absolute IRI.
 */
jsonld.prependBase = function(base, iri) {
  return _prependBase(base, iri);
};

/**
 * The default document loader for external documents. If the environment
 * is node.js, a callback-continuation-style document loader is used; otherwise,
 * a promises-style document loader is used.
 *
 * @param url the URL to load.
 * @param callback(err, remoteDoc) called once the operation completes,
 *          if using a non-promises API.
 *
 * @return a promise, if using a promises API.
 */
jsonld.documentLoader = function(url, callback) {
  var err = new JsonLdError(
    'Could not retrieve a JSON-LD document from the URL. URL ' +
    'dereferencing not implemented.', 'jsonld.LoadDocumentError',
    {code: 'loading document failed'});
  if(_nodejs) {
    return callback(err, {contextUrl: null, documentUrl: url, document: null});
  }
  return jsonld.promisify(function(callback) {
    callback(err);
  });
};

/**
 * Deprecated default document loader. Use or override jsonld.documentLoader
 * instead.
 */
jsonld.loadDocument = function(url, callback) {
  var promise = jsonld.documentLoader(url, callback);
  if(promise && 'then' in promise) {
    promise.then(callback.bind(null, null), callback);
  }
};

/* Promises API */

/**
 * Creates a new promises API object.
 *
 * @param [options] the options to use:
 *          [api] an object to attach the API to.
 *          [version] 'json-ld-1.0' to output a standard JSON-LD 1.0 promises
 *            API, 'jsonld.js' to output the same with augmented proprietary
 *            methods (default: 'jsonld.js')
 *
 * @return the promises API object.
 */
jsonld.promises = function(options) {
  options = options || {};
  var slice = Array.prototype.slice;
  var promisify = jsonld.promisify;

  // handle 'api' option as version, set defaults
  var api = options.api || {};
  var version = options.version || 'jsonld.js';
  if(typeof options.api === 'string') {
    if(!options.version) {
      version = options.api;
    }
    api = {};
  }

  api.expand = function(input) {
    if(arguments.length < 1) {
      throw new TypeError('Could not expand, too few arguments.');
    }
    return promisify.apply(null, [jsonld.expand].concat(slice.call(arguments)));
  };
  api.compact = function(input, ctx) {
    if(arguments.length < 2) {
      throw new TypeError('Could not compact, too few arguments.');
    }
    var compact = function(input, ctx, options, callback) {
      // ensure only one value is returned in callback
      jsonld.compact(input, ctx, options, function(err, compacted) {
        callback(err, compacted);
      });
    };
    return promisify.apply(null, [compact].concat(slice.call(arguments)));
  };
  api.flatten = function(input) {
    if(arguments.length < 1) {
      throw new TypeError('Could not flatten, too few arguments.');
    }
    return promisify.apply(
      null, [jsonld.flatten].concat(slice.call(arguments)));
  };
  api.frame = function(input, frame) {
    if(arguments.length < 2) {
      throw new TypeError('Could not frame, too few arguments.');
    }
    return promisify.apply(null, [jsonld.frame].concat(slice.call(arguments)));
  };
  api.fromRDF = function(dataset) {
    if(arguments.length < 1) {
      throw new TypeError('Could not convert from RDF, too few arguments.');
    }
    return promisify.apply(
      null, [jsonld.fromRDF].concat(slice.call(arguments)));
  };
  api.toRDF = function(input) {
    if(arguments.length < 1) {
      throw new TypeError('Could not convert to RDF, too few arguments.');
    }
    return promisify.apply(null, [jsonld.toRDF].concat(slice.call(arguments)));
  };
  api.normalize = function(input) {
    if(arguments.length < 1) {
      throw new TypeError('Could not normalize, too few arguments.');
    }
    return promisify.apply(
      null, [jsonld.normalize].concat(slice.call(arguments)));
  };

  if(version === 'jsonld.js') {
    api.link = function(input, ctx) {
      if(arguments.length < 2) {
        throw new TypeError('Could not link, too few arguments.');
      }
      return promisify.apply(
        null, [jsonld.link].concat(slice.call(arguments)));
    };
    api.objectify = function(input) {
      return promisify.apply(
        null, [jsonld.objectify].concat(slice.call(arguments)));
    };
    api.createNodeMap = function(input) {
      return promisify.apply(
        null, [jsonld.createNodeMap].concat(slice.call(arguments)));
    };
    api.merge = function(input) {
      return promisify.apply(
        null, [jsonld.merge].concat(slice.call(arguments)));
    };
  }

  try {
    jsonld.Promise = global.Promise || require('es6-promise').Promise;
  } catch(e) {
    var f = function() {
      throw new Error('Unable to find a Promise implementation.');
    };
    for(var method in api) {
      api[method] = f;
    }
  }

  return api;
};

/**
 * Converts a node.js async op into a promise w/boxed resolved value(s).
 *
 * @param op the operation to convert.
 *
 * @return the promise.
 */
jsonld.promisify = function(op) {
  if(!jsonld.Promise) {
    try {
      jsonld.Promise = global.Promise || require('es6-promise').Promise;
    } catch(e) {
      throw new Error('Unable to find a Promise implementation.');
    }
  }
  var args = Array.prototype.slice.call(arguments, 1);
  return new jsonld.Promise(function(resolve, reject) {
    op.apply(null, args.concat(function(err, value) {
      if(!err) {
        resolve(value);
      } else {
        reject(err);
      }
    }));
  });
};

// extend jsonld.promises w/jsonld.js methods
jsonld.promises({api: jsonld.promises});

/* WebIDL API */

function JsonLdProcessor() {}
JsonLdProcessor.prototype = jsonld.promises({version: 'json-ld-1.0'});
JsonLdProcessor.prototype.toString = function() {
  if(this instanceof JsonLdProcessor) {
    return '[object JsonLdProcessor]';
  }
  return '[object JsonLdProcessorPrototype]';
};
jsonld.JsonLdProcessor = JsonLdProcessor;

// IE8 has Object.defineProperty but it only
// works on DOM nodes -- so feature detection
// requires try/catch :-(
var canDefineProperty = !!Object.defineProperty;
if(canDefineProperty) {
  try {
    Object.defineProperty({}, 'x', {});
  } catch(e) {
    canDefineProperty = false;
  }
}

if(canDefineProperty) {
  Object.defineProperty(JsonLdProcessor, 'prototype', {
    writable: false,
    enumerable: false
  });
  Object.defineProperty(JsonLdProcessor.prototype, 'constructor', {
    writable: true,
    enumerable: false,
    configurable: true,
    value: JsonLdProcessor
  });
}

// setup browser global JsonLdProcessor
if(_browser && typeof global.JsonLdProcessor === 'undefined') {
  if(canDefineProperty) {
    Object.defineProperty(global, 'JsonLdProcessor', {
      writable: true,
      enumerable: false,
      configurable: true,
      value: JsonLdProcessor
    });
  } else {
    global.JsonLdProcessor = JsonLdProcessor;
  }
}

/* Utility API */

// define setImmediate and nextTick
//// nextTick implementation with browser-compatible fallback ////
// from https://github.com/caolan/async/blob/master/lib/async.js

// capture the global reference to guard against fakeTimer mocks
var _setImmediate = typeof setImmediate === 'function' && setImmediate;

var _delay = _setImmediate ? function(fn) {
  // not a direct alias (for IE10 compatibility)
  _setImmediate(fn);
} : function(fn) {
  setTimeout(fn, 0);
};

if(typeof process === 'object' && typeof process.nextTick === 'function') {
  jsonld.nextTick = process.nextTick;
} else {
  jsonld.nextTick = _delay;
}
jsonld.setImmediate = _setImmediate ? _delay : jsonld.nextTick;

/**
 * Parses a link header. The results will be key'd by the value of "rel".
 *
 * Link: <http://json-ld.org/contexts/person.jsonld>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"
 *
 * Parses as: {
 *   'http://www.w3.org/ns/json-ld#context': {
 *     target: http://json-ld.org/contexts/person.jsonld,
 *     type: 'application/ld+json'
 *   }
 * }
 *
 * If there is more than one "rel" with the same IRI, then entries in the
 * resulting map for that "rel" will be arrays.
 *
 * @param header the link header to parse.
 */
jsonld.parseLinkHeader = function(header) {
  var rval = {};
  // split on unbracketed/unquoted commas
  var entries = header.match(/(?:<[^>]*?>|"[^"]*?"|[^,])+/g);
  var rLinkHeader = /\s*<([^>]*?)>\s*(?:;\s*(.*))?/;
  for(var i = 0; i < entries.length; ++i) {
    var match = entries[i].match(rLinkHeader);
    if(!match) {
      continue;
    }
    var result = {target: match[1]};
    var params = match[2];
    var rParams = /(.*?)=(?:(?:"([^"]*?)")|([^"]*?))\s*(?:(?:;\s*)|$)/g;
    while(match = rParams.exec(params)) {
      result[match[1]] = (match[2] === undefined) ? match[3] : match[2];
    }
    var rel = result['rel'] || '';
    if(_isArray(rval[rel])) {
      rval[rel].push(result);
    } else if(rel in rval) {
      rval[rel] = [rval[rel], result];
    } else {
      rval[rel] = result;
    }
  }
  return rval;
};

/**
 * Creates a simple queue for requesting documents.
 */
jsonld.RequestQueue = function() {
  this._requests = {};
};
jsonld.RequestQueue.prototype.wrapLoader = function(loader) {
  this._loader = loader;
  this._usePromise = (loader.length === 1);
  return this.add.bind(this);
};
jsonld.RequestQueue.prototype.add = function(url, callback) {
  var self = this;

  // callback must be given if not using promises
  if(!callback && !self._usePromise) {
    throw new Error('callback must be specified.');
  }

  // Promise-based API
  if(self._usePromise) {
    return new jsonld.Promise(function(resolve, reject) {
      var load = self._requests[url];
      if(!load) {
        // load URL then remove from queue
        load = self._requests[url] = self._loader(url)
          .then(function(remoteDoc) {
            delete self._requests[url];
            return remoteDoc;
          }).catch(function(err) {
            delete self._requests[url];
            throw err;
          });
      }
      // resolve/reject promise once URL has been loaded
      load.then(function(remoteDoc) {
        resolve(remoteDoc);
      }).catch(function(err) {
        reject(err);
      });
    });
  }

  // callback-based API
  if(url in self._requests) {
    self._requests[url].push(callback);
  } else {
    self._requests[url] = [callback];
    self._loader(url, function(err, remoteDoc) {
      var callbacks = self._requests[url];
      delete self._requests[url];
      for(var i = 0; i < callbacks.length; ++i) {
        callbacks[i](err, remoteDoc);
      }
    });
  }
};

/**
 * Creates a simple document cache that retains documents for a short
 * period of time.
 *
 * FIXME: Implement simple HTTP caching instead.
 *
 * @param size the maximum size of the cache.
 */
jsonld.DocumentCache = function(size) {
  this.order = [];
  this.cache = {};
  this.size = size || 50;
  this.expires = 30 * 1000;
};
jsonld.DocumentCache.prototype.get = function(url) {
  if(url in this.cache) {
    var entry = this.cache[url];
    if(entry.expires >= +new Date()) {
      return entry.ctx;
    }
    delete this.cache[url];
    this.order.splice(this.order.indexOf(url), 1);
  }
  return null;
};
jsonld.DocumentCache.prototype.set = function(url, ctx) {
  if(this.order.length === this.size) {
    delete this.cache[this.order.shift()];
  }
  this.order.push(url);
  this.cache[url] = {ctx: ctx, expires: (+new Date() + this.expires)};
};

/**
 * Creates an active context cache.
 *
 * @param size the maximum size of the cache.
 */
jsonld.ActiveContextCache = function(size) {
  this.order = [];
  this.cache = {};
  this.size = size || 100;
};
jsonld.ActiveContextCache.prototype.get = function(activeCtx, localCtx) {
  var key1 = JSON.stringify(activeCtx);
  var key2 = JSON.stringify(localCtx);
  var level1 = this.cache[key1];
  if(level1 && key2 in level1) {
    return level1[key2];
  }
  return null;
};
jsonld.ActiveContextCache.prototype.set = function(
  activeCtx, localCtx, result) {
  if(this.order.length === this.size) {
    var entry = this.order.shift();
    delete this.cache[entry.activeCtx][entry.localCtx];
  }
  var key1 = JSON.stringify(activeCtx);
  var key2 = JSON.stringify(localCtx);
  this.order.push({activeCtx: key1, localCtx: key2});
  if(!(key1 in this.cache)) {
    this.cache[key1] = {};
  }
  this.cache[key1][key2] = _clone(result);
};

/**
 * Default JSON-LD cache.
 */
jsonld.cache = {
  activeCtx: new jsonld.ActiveContextCache()
};

/**
 * Document loaders.
 */
jsonld.documentLoaders = {};

/**
 * Creates a built-in jquery document loader.
 *
 * @param $ the jquery instance to use.
 * @param options the options to use:
 *          secure: require all URLs to use HTTPS.
 *          usePromise: true to use a promises API, false for a
 *            callback-continuation-style API; defaults to true if Promise
 *            is globally defined, false if not.
 *
 * @return the jquery document loader.
 */
jsonld.documentLoaders.jquery = function($, options) {
  options = options || {};
  var queue = new jsonld.RequestQueue();

  // use option or, by default, use Promise when its defined
  var usePromise = ('usePromise' in options ?
    options.usePromise : (typeof Promise !== 'undefined'));
  if(usePromise) {
    return queue.wrapLoader(function(url) {
      return jsonld.promisify(loader, url);
    });
  }
  return queue.wrapLoader(loader);

  function loader(url, callback) {
    if(url.indexOf('http:') !== 0 && url.indexOf('https:') !== 0) {
      return callback(new JsonLdError(
        'URL could not be dereferenced; only "http" and "https" URLs are ' +
        'supported.',
        'jsonld.InvalidUrl', {code: 'loading document failed', url: url}),
        {contextUrl: null, documentUrl: url, document: null});
    }
    if(options.secure && url.indexOf('https') !== 0) {
      return callback(new JsonLdError(
        'URL could not be dereferenced; secure mode is enabled and ' +
        'the URL\'s scheme is not "https".',
        'jsonld.InvalidUrl', {code: 'loading document failed', url: url}),
        {contextUrl: null, documentUrl: url, document: null});
    }
    $.ajax({
      url: url,
      accepts: {
        json: 'application/ld+json, application/json'
      },
      // ensure Accept header is very specific for JSON-LD/JSON
      headers: {
        'Accept': 'application/ld+json, application/json'
      },
      dataType: 'json',
      crossDomain: true,
      success: function(data, textStatus, jqXHR) {
        var doc = {contextUrl: null, documentUrl: url, document: data};

        // handle Link Header
        var contentType = jqXHR.getResponseHeader('Content-Type');
        var linkHeader = jqXHR.getResponseHeader('Link');
        if(linkHeader && contentType !== 'application/ld+json') {
          // only 1 related link header permitted
          linkHeader = jsonld.parseLinkHeader(linkHeader)[LINK_HEADER_REL];
          if(_isArray(linkHeader)) {
            return callback(new JsonLdError(
              'URL could not be dereferenced, it has more than one ' +
              'associated HTTP Link Header.',
              'jsonld.InvalidUrl',
              {code: 'multiple context link headers', url: url}), doc);
          }
          if(linkHeader) {
            doc.contextUrl = linkHeader.target;
          }
        }

        callback(null, doc);
      },
      error: function(jqXHR, textStatus, err) {
        callback(new JsonLdError(
          'URL could not be dereferenced, an error occurred.',
          'jsonld.LoadDocumentError',
          {code: 'loading document failed', url: url, cause: err}),
          {contextUrl: null, documentUrl: url, document: null});
      }
    });
  }
};

/**
 * Creates a built-in node document loader.
 *
 * @param options the options to use:
 *          secure: require all URLs to use HTTPS.
 *          strictSSL: true to require SSL certificates to be valid,
 *            false not to (default: true).
 *          maxRedirects: the maximum number of redirects to permit, none by
 *            default.
 *          request: the object which will make the request, default is
 *            provided by `https://www.npmjs.com/package/request`.
 *          headers: an array of headers which will be passed as request
 *            headers for the requested document. Accept is not allowed.
 *          usePromise: true to use a promises API, false for a
 *            callback-continuation-style API; false by default.
 *
 * @return the node document loader.
 */
jsonld.documentLoaders.node = function(options) {
  options = options || {};
  var strictSSL = ('strictSSL' in options) ? options.strictSSL : true;
  var maxRedirects = ('maxRedirects' in options) ? options.maxRedirects : -1;
  var request = ('request' in options) ? options.request : require('request');
  var acceptHeader = 'application/ld+json, application/json';
  var http = require('http');
  // TODO: disable cache until HTTP caching implemented
  //var cache = new jsonld.DocumentCache();

  var queue = new jsonld.RequestQueue();
  if(options.usePromise) {
    return queue.wrapLoader(function(url) {
      return jsonld.promisify(loadDocument, url, []);
    });
  }
  var headers = options.headers || {};
  if('Accept' in headers || 'accept' in headers) {
    throw new RangeError(
      'Accept header may not be specified as an option; only "' +
      acceptHeader + '" is supported.');
  }
  return queue.wrapLoader(function(url, callback) {
    loadDocument(url, [], callback);
  });

  function loadDocument(url, redirects, callback) {
    if(url.indexOf('http:') !== 0 && url.indexOf('https:') !== 0) {
      return callback(new JsonLdError(
        'URL could not be dereferenced; only "http" and "https" URLs are ' +
        'supported.',
        'jsonld.InvalidUrl', {code: 'loading document failed', url: url}),
        {contextUrl: null, documentUrl: url, document: null});
    }
    if(options.secure && url.indexOf('https') !== 0) {
      return callback(new JsonLdError(
        'URL could not be dereferenced; secure mode is enabled and ' +
        'the URL\'s scheme is not "https".',
        'jsonld.InvalidUrl', {code: 'loading document failed', url: url}),
        {contextUrl: null, documentUrl: url, document: null});
    }
    // TODO: disable cache until HTTP caching implemented
    var doc = null;//cache.get(url);
    if(doc !== null) {
      return callback(null, doc);
    }
    var headers = {'Accept': acceptHeader};
    for(var k in options.headers) { headers[k] = options.headers[k]; }
    request({
      url: url,
      headers: headers,
      strictSSL: strictSSL,
      followRedirect: false
    }, handleResponse);

    function handleResponse(err, res, body) {
      doc = {contextUrl: null, documentUrl: url, document: body || null};

      // handle error
      if(err) {
        return callback(new JsonLdError(
          'URL could not be dereferenced, an error occurred.',
          'jsonld.LoadDocumentError',
          {code: 'loading document failed', url: url, cause: err}), doc);
      }
      var statusText = http.STATUS_CODES[res.statusCode];
      if(res.statusCode >= 400) {
        return callback(new JsonLdError(
          'URL could not be dereferenced: ' + statusText,
          'jsonld.InvalidUrl', {
            code: 'loading document failed',
            url: url,
            httpStatusCode: res.statusCode
          }), doc);
      }

      // handle Link Header
      if(res.headers.link &&
        res.headers['content-type'] !== 'application/ld+json') {
        // only 1 related link header permitted
        var linkHeader = jsonld.parseLinkHeader(
          res.headers.link)[LINK_HEADER_REL];
        if(_isArray(linkHeader)) {
          return callback(new JsonLdError(
            'URL could not be dereferenced, it has more than one associated ' +
            'HTTP Link Header.',
            'jsonld.InvalidUrl',
            {code: 'multiple context link headers', url: url}), doc);
        }
        if(linkHeader) {
          doc.contextUrl = linkHeader.target;
        }
      }

      // handle redirect
      if(res.statusCode >= 300 && res.statusCode < 400 &&
        res.headers.location) {
        if(redirects.length === maxRedirects) {
          return callback(new JsonLdError(
            'URL could not be dereferenced; there were too many redirects.',
            'jsonld.TooManyRedirects', {
              code: 'loading document failed',
              url: url,
              httpStatusCode: res.statusCode,
              redirects: redirects
            }), doc);
        }
        if(redirects.indexOf(url) !== -1) {
          return callback(new JsonLdError(
            'URL could not be dereferenced; infinite redirection was detected.',
            'jsonld.InfiniteRedirectDetected', {
              code: 'recursive context inclusion',
              url: url,
              httpStatusCode: res.statusCode,
              redirects: redirects
            }), doc);
        }
        redirects.push(url);
        return loadDocument(res.headers.location, redirects, callback);
      }
      // cache for each redirected URL
      redirects.push(url);
      // TODO: disable cache until HTTP caching implemented
      /*for(var i = 0; i < redirects.length; ++i) {
        cache.set(
          redirects[i],
          {contextUrl: null, documentUrl: redirects[i], document: body});
      }*/
      callback(err, doc);
    }
  }
};

/**
 * Creates a built-in XMLHttpRequest document loader.
 *
 * @param options the options to use:
 *          secure: require all URLs to use HTTPS.
 *          usePromise: true to use a promises API, false for a
 *            callback-continuation-style API; defaults to true if Promise
 *            is globally defined, false if not.
 *          [xhr]: the XMLHttpRequest API to use.
 *
 * @return the XMLHttpRequest document loader.
 */
jsonld.documentLoaders.xhr = function(options) {
  options = options || {};
  var rlink = /(^|(\r\n))link:/i;
  var queue = new jsonld.RequestQueue();

  // use option or, by default, use Promise when its defined
  var usePromise = ('usePromise' in options ?
    options.usePromise : (typeof Promise !== 'undefined'));
  if(usePromise) {
    return queue.wrapLoader(function(url) {
      return jsonld.promisify(loader, url);
    });
  }
  return queue.wrapLoader(loader);

  function loader(url, callback) {
    if(url.indexOf('http:') !== 0 && url.indexOf('https:') !== 0) {
      return callback(new JsonLdError(
        'URL could not be dereferenced; only "http" and "https" URLs are ' +
        'supported.',
        'jsonld.InvalidUrl', {code: 'loading document failed', url: url}),
        {contextUrl: null, documentUrl: url, document: null});
    }
    if(options.secure && url.indexOf('https') !== 0) {
      return callback(new JsonLdError(
        'URL could not be dereferenced; secure mode is enabled and ' +
        'the URL\'s scheme is not "https".',
        'jsonld.InvalidUrl', {code: 'loading document failed', url: url}),
        {contextUrl: null, documentUrl: url, document: null});
    }
    var xhr = options.xhr || XMLHttpRequest;
    var req = new xhr();
    req.onload = function() {
      if(req.status >= 400) {
        return callback(new JsonLdError(
          'URL could not be dereferenced: ' + req.statusText,
          'jsonld.LoadDocumentError', {
            code: 'loading document failed',
            url: url,
            httpStatusCode: req.status
          }), {contextUrl: null, documentUrl: url, document: null});
      }

      var doc = {contextUrl: null, documentUrl: url, document: req.response};

      // handle Link Header (avoid unsafe header warning by existence testing)
      var contentType = req.getResponseHeader('Content-Type');
      var linkHeader;
      if(rlink.test(req.getAllResponseHeaders())) {
        linkHeader = req.getResponseHeader('Link');
      }
      if(linkHeader && contentType !== 'application/ld+json') {
        // only 1 related link header permitted
        linkHeader = jsonld.parseLinkHeader(linkHeader)[LINK_HEADER_REL];
        if(_isArray(linkHeader)) {
          return callback(new JsonLdError(
            'URL could not be dereferenced, it has more than one ' +
            'associated HTTP Link Header.',
            'jsonld.InvalidUrl',
            {code: 'multiple context link headers', url: url}), doc);
        }
        if(linkHeader) {
          doc.contextUrl = linkHeader.target;
        }
      }

      callback(null, doc);
    };
    req.onerror = function() {
      callback(new JsonLdError(
        'URL could not be dereferenced, an error occurred.',
        'jsonld.LoadDocumentError',
        {code: 'loading document failed', url: url}),
        {contextUrl: null, documentUrl: url, document: null});
    };
    req.open('GET', url, true);
    req.setRequestHeader('Accept', 'application/ld+json, application/json');
    req.send();
  }
};

/**
 * Assigns the default document loader for external document URLs to a built-in
 * default. Supported types currently include: 'jquery' and 'node'.
 *
 * To use the jquery document loader, the first parameter must be a reference
 * to the main jquery object.
 *
 * @param type the type to set.
 * @param [params] the parameters required to use the document loader.
 */
jsonld.useDocumentLoader = function(type) {
  if(!(type in jsonld.documentLoaders)) {
    throw new JsonLdError(
      'Unknown document loader type: "' + type + '"',
      'jsonld.UnknownDocumentLoader',
      {type: type});
  }

  // set document loader
  jsonld.documentLoader = jsonld.documentLoaders[type].apply(
    jsonld, Array.prototype.slice.call(arguments, 1));
};

/**
 * Processes a local context, resolving any URLs as necessary, and returns a
 * new active context in its callback.
 *
 * @param activeCtx the current active context.
 * @param localCtx the local context to process.
 * @param [options] the options to use:
 *          [documentLoader(url, callback(err, remoteDoc))] the document loader.
 * @param callback(err, ctx) called once the operation completes.
 */
jsonld.processContext = function(activeCtx, localCtx) {
  // get arguments
  var options = {};
  var callbackArg = 2;
  if(arguments.length > 3) {
    options = arguments[2] || {};
    callbackArg += 1;
  }
  var callback = arguments[callbackArg];

  // set default options
  if(!('base' in options)) {
    options.base = '';
  }
  if(!('documentLoader' in options)) {
    options.documentLoader = jsonld.loadDocument;
  }

  // return initial context early for null context
  if(localCtx === null) {
    return callback(null, _getInitialContext(options));
  }

  // retrieve URLs in localCtx
  localCtx = _clone(localCtx);
  if(!(_isObject(localCtx) && '@context' in localCtx)) {
    localCtx = {'@context': localCtx};
  }
  _retrieveContextUrls(localCtx, options, function(err, ctx) {
    if(err) {
      return callback(err);
    }
    try {
      // process context
      ctx = new Processor().processContext(activeCtx, ctx, options);
    } catch(ex) {
      return callback(ex);
    }
    callback(null, ctx);
  });
};

/**
 * Returns true if the given subject has the given property.
 *
 * @param subject the subject to check.
 * @param property the property to look for.
 *
 * @return true if the subject has the given property, false if not.
 */
jsonld.hasProperty = function(subject, property) {
  var rval = false;
  if(property in subject) {
    var value = subject[property];
    rval = (!_isArray(value) || value.length > 0);
  }
  return rval;
};

/**
 * Determines if the given value is a property of the given subject.
 *
 * @param subject the subject to check.
 * @param property the property to check.
 * @param value the value to check.
 *
 * @return true if the value exists, false if not.
 */
jsonld.hasValue = function(subject, property, value) {
  var rval = false;
  if(jsonld.hasProperty(subject, property)) {
    var val = subject[property];
    var isList = _isList(val);
    if(_isArray(val) || isList) {
      if(isList) {
        val = val['@list'];
      }
      for(var i = 0; i < val.length; ++i) {
        if(jsonld.compareValues(value, val[i])) {
          rval = true;
          break;
        }
      }
    } else if(!_isArray(value)) {
      // avoid matching the set of values with an array value parameter
      rval = jsonld.compareValues(value, val);
    }
  }
  return rval;
};

/**
 * Adds a value to a subject. If the value is an array, all values in the
 * array will be added.
 *
 * @param subject the subject to add the value to.
 * @param property the property that relates the value to the subject.
 * @param value the value to add.
 * @param [options] the options to use:
 *        [propertyIsArray] true if the property is always an array, false
 *          if not (default: false).
 *        [allowDuplicate] true to allow duplicates, false not to (uses a
 *          simple shallow comparison of subject ID or value) (default: true).
 */
jsonld.addValue = function(subject, property, value, options) {
  options = options || {};
  if(!('propertyIsArray' in options)) {
    options.propertyIsArray = false;
  }
  if(!('allowDuplicate' in options)) {
    options.allowDuplicate = true;
  }

  if(_isArray(value)) {
    if(value.length === 0 && options.propertyIsArray &&
      !(property in subject)) {
      subject[property] = [];
    }
    for(var i = 0; i < value.length; ++i) {
      jsonld.addValue(subject, property, value[i], options);
    }
  } else if(property in subject) {
    // check if subject already has value if duplicates not allowed
    var hasValue = (!options.allowDuplicate &&
      jsonld.hasValue(subject, property, value));

    // make property an array if value not present or always an array
    if(!_isArray(subject[property]) &&
      (!hasValue || options.propertyIsArray)) {
      subject[property] = [subject[property]];
    }

    // add new value
    if(!hasValue) {
      subject[property].push(value);
    }
  } else {
    // add new value as set or single value
    subject[property] = options.propertyIsArray ? [value] : value;
  }
};

/**
 * Gets all of the values for a subject's property as an array.
 *
 * @param subject the subject.
 * @param property the property.
 *
 * @return all of the values for a subject's property as an array.
 */
jsonld.getValues = function(subject, property) {
  var rval = subject[property] || [];
  if(!_isArray(rval)) {
    rval = [rval];
  }
  return rval;
};

/**
 * Removes a property from a subject.
 *
 * @param subject the subject.
 * @param property the property.
 */
jsonld.removeProperty = function(subject, property) {
  delete subject[property];
};

/**
 * Removes a value from a subject.
 *
 * @param subject the subject.
 * @param property the property that relates the value to the subject.
 * @param value the value to remove.
 * @param [options] the options to use:
 *          [propertyIsArray] true if the property is always an array, false
 *            if not (default: false).
 */
jsonld.removeValue = function(subject, property, value, options) {
  options = options || {};
  if(!('propertyIsArray' in options)) {
    options.propertyIsArray = false;
  }

  // filter out value
  var values = jsonld.getValues(subject, property).filter(function(e) {
    return !jsonld.compareValues(e, value);
  });

  if(values.length === 0) {
    jsonld.removeProperty(subject, property);
  } else if(values.length === 1 && !options.propertyIsArray) {
    subject[property] = values[0];
  } else {
    subject[property] = values;
  }
};

/**
 * Compares two JSON-LD values for equality. Two JSON-LD values will be
 * considered equal if:
 *
 * 1. They are both primitives of the same type and value.
 * 2. They are both @values with the same @value, @type, @language,
 *   and @index, OR
 * 3. They both have @ids they are the same.
 *
 * @param v1 the first value.
 * @param v2 the second value.
 *
 * @return true if v1 and v2 are considered equal, false if not.
 */
jsonld.compareValues = function(v1, v2) {
  // 1. equal primitives
  if(v1 === v2) {
    return true;
  }

  // 2. equal @values
  if(_isValue(v1) && _isValue(v2) &&
    v1['@value'] === v2['@value'] &&
    v1['@type'] === v2['@type'] &&
    v1['@language'] === v2['@language'] &&
    v1['@index'] === v2['@index']) {
    return true;
  }

  // 3. equal @ids
  if(_isObject(v1) && ('@id' in v1) && _isObject(v2) && ('@id' in v2)) {
    return v1['@id'] === v2['@id'];
  }

  return false;
};

/**
 * Gets the value for the given active context key and type, null if none is
 * set.
 *
 * @param ctx the active context.
 * @param key the context key.
 * @param [type] the type of value to get (eg: '@id', '@type'), if not
 *          specified gets the entire entry for a key, null if not found.
 *
 * @return the value.
 */
jsonld.getContextValue = function(ctx, key, type) {
  var rval = null;

  // return null for invalid key
  if(key === null) {
    return rval;
  }

  // get default language
  if(type === '@language' && (type in ctx)) {
    rval = ctx[type];
  }

  // get specific entry information
  if(ctx.mappings[key]) {
    var entry = ctx.mappings[key];

    if(_isUndefined(type)) {
      // return whole entry
      rval = entry;
    } else if(type in entry) {
      // return entry value for type
      rval = entry[type];
    }
  }

  return rval;
};

/** Registered RDF dataset parsers hashed by content-type. */
var _rdfParsers = {};

/**
 * Registers an RDF dataset parser by content-type, for use with
 * jsonld.fromRDF. An RDF dataset parser will always be given two parameters,
 * a string of input and a callback. An RDF dataset parser can be synchronous
 * or asynchronous.
 *
 * If the parser function returns undefined or null then it will be assumed to
 * be asynchronous w/a continuation-passing style and the callback parameter
 * given to the parser MUST be invoked.
 *
 * If it returns a Promise, then it will be assumed to be asynchronous, but the
 * callback parameter MUST NOT be invoked. It should instead be ignored.
 *
 * If it returns an RDF dataset, it will be assumed to be synchronous and the
 * callback parameter MUST NOT be invoked. It should instead be ignored.
 *
 * @param contentType the content-type for the parser.
 * @param parser(input, callback(err, dataset)) the parser function (takes a
 *          string as a parameter and either returns null/undefined and uses
 *          the given callback, returns a Promise, or returns an RDF dataset).
 */
jsonld.registerRDFParser = function(contentType, parser) {
  _rdfParsers[contentType] = parser;
};

/**
 * Unregisters an RDF dataset parser by content-type.
 *
 * @param contentType the content-type for the parser.
 */
jsonld.unregisterRDFParser = function(contentType) {
  delete _rdfParsers[contentType];
};

if(_nodejs) {
  // needed for serialization of XML literals
  if(typeof XMLSerializer === 'undefined') {
    var XMLSerializer = null;
  }
  if(typeof Node === 'undefined') {
    var Node = {
      ELEMENT_NODE: 1,
      ATTRIBUTE_NODE: 2,
      TEXT_NODE: 3,
      CDATA_SECTION_NODE: 4,
      ENTITY_REFERENCE_NODE: 5,
      ENTITY_NODE: 6,
      PROCESSING_INSTRUCTION_NODE: 7,
      COMMENT_NODE: 8,
      DOCUMENT_NODE: 9,
      DOCUMENT_TYPE_NODE: 10,
      DOCUMENT_FRAGMENT_NODE: 11,
      NOTATION_NODE:12
    };
  }
}

// constants
var XSD_BOOLEAN = 'http://www.w3.org/2001/XMLSchema#boolean';
var XSD_DOUBLE = 'http://www.w3.org/2001/XMLSchema#double';
var XSD_INTEGER = 'http://www.w3.org/2001/XMLSchema#integer';
var XSD_STRING = 'http://www.w3.org/2001/XMLSchema#string';

var RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
var RDF_LIST = RDF + 'List';
var RDF_FIRST = RDF + 'first';
var RDF_REST = RDF + 'rest';
var RDF_NIL = RDF + 'nil';
var RDF_TYPE = RDF + 'type';
var RDF_PLAIN_LITERAL = RDF + 'PlainLiteral';
var RDF_XML_LITERAL = RDF + 'XMLLiteral';
var RDF_OBJECT = RDF + 'object';
var RDF_LANGSTRING = RDF + 'langString';

var LINK_HEADER_REL = 'http://www.w3.org/ns/json-ld#context';
var MAX_CONTEXT_URLS = 10;

/**
 * A JSON-LD Error.
 *
 * @param msg the error message.
 * @param type the error type.
 * @param details the error details.
 */
var JsonLdError = function(msg, type, details) {
  if(_nodejs) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
  } else if(typeof Error !== 'undefined') {
    this.stack = (new Error()).stack;
  }
  this.name = type || 'jsonld.Error';
  this.message = msg || 'An unspecified JSON-LD error occurred.';
  this.details = details || {};
};
if(_nodejs) {
  require('util').inherits(JsonLdError, Error);
} else if(typeof Error !== 'undefined') {
  JsonLdError.prototype = new Error();
}

/**
 * Constructs a new JSON-LD Processor.
 */
var Processor = function() {};

/**
 * Recursively compacts an element using the given active context. All values
 * must be in expanded form before this method is called.
 *
 * @param activeCtx the active context to use.
 * @param activeProperty the compacted property associated with the element
 *          to compact, null for none.
 * @param element the element to compact.
 * @param options the compaction options.
 *
 * @return the compacted value.
 */
Processor.prototype.compact = function(
  activeCtx, activeProperty, element, options) {
  // recursively compact array
  if(_isArray(element)) {
    var rval = [];
    for(var i = 0; i < element.length; ++i) {
      // compact, dropping any null values
      var compacted = this.compact(
        activeCtx, activeProperty, element[i], options);
      if(compacted !== null) {
        rval.push(compacted);
      }
    }
    if(options.compactArrays && rval.length === 1) {
      // use single element if no container is specified
      var container = jsonld.getContextValue(
        activeCtx, activeProperty, '@container');
      if(container === null) {
        rval = rval[0];
      }
    }
    return rval;
  }

  // recursively compact object
  if(_isObject(element)) {
    if(options.link && '@id' in element && element['@id'] in options.link) {
      // check for a linked element to reuse
      var linked = options.link[element['@id']];
      for(var i = 0; i < linked.length; ++i) {
        if(linked[i].expanded === element) {
          return linked[i].compacted;
        }
      }
    }

    // do value compaction on @values and subject references
    if(_isValue(element) || _isSubjectReference(element)) {
      var rval = _compactValue(activeCtx, activeProperty, element);
      if(options.link && _isSubjectReference(element)) {
        // store linked element
        if(!(element['@id'] in options.link)) {
          options.link[element['@id']] = [];
        }
        options.link[element['@id']].push({expanded: element, compacted: rval});
      }
      return rval;
    }

    // FIXME: avoid misuse of active property as an expanded property?
    var insideReverse = (activeProperty === '@reverse');

    var rval = {};

    if(options.link && '@id' in element) {
      // store linked element
      if(!(element['@id'] in options.link)) {
        options.link[element['@id']] = [];
      }
      options.link[element['@id']].push({expanded: element, compacted: rval});
    }

    // process element keys in order
    var keys = Object.keys(element).sort();
    for(var ki = 0; ki < keys.length; ++ki) {
      var expandedProperty = keys[ki];
      var expandedValue = element[expandedProperty];

      // compact @id and @type(s)
      if(expandedProperty === '@id' || expandedProperty === '@type') {
        var compactedValue;

        // compact single @id
        if(_isString(expandedValue)) {
          compactedValue = _compactIri(
            activeCtx, expandedValue, null,
            {vocab: (expandedProperty === '@type')});
        } else {
          // expanded value must be a @type array
          compactedValue = [];
          for(var vi = 0; vi < expandedValue.length; ++vi) {
            compactedValue.push(_compactIri(
              activeCtx, expandedValue[vi], null, {vocab: true}));
          }
        }

        // use keyword alias and add value
        var alias = _compactIri(activeCtx, expandedProperty);
        var isArray = (_isArray(compactedValue) && expandedValue.length === 0);
        jsonld.addValue(
          rval, alias, compactedValue, {propertyIsArray: isArray});
        continue;
      }

      // handle @reverse
      if(expandedProperty === '@reverse') {
        // recursively compact expanded value
        var compactedValue = this.compact(
          activeCtx, '@reverse', expandedValue, options);

        // handle double-reversed properties
        for(var compactedProperty in compactedValue) {
          if(activeCtx.mappings[compactedProperty] &&
            activeCtx.mappings[compactedProperty].reverse) {
            var value = compactedValue[compactedProperty];
            var container = jsonld.getContextValue(
              activeCtx, compactedProperty, '@container');
            var useArray = (container === '@set' || !options.compactArrays);
            jsonld.addValue(
              rval, compactedProperty, value, {propertyIsArray: useArray});
            delete compactedValue[compactedProperty];
          }
        }

        if(Object.keys(compactedValue).length > 0) {
          // use keyword alias and add value
          var alias = _compactIri(activeCtx, expandedProperty);
          jsonld.addValue(rval, alias, compactedValue);
        }

        continue;
      }

      // handle @index property
      if(expandedProperty === '@index') {
        // drop @index if inside an @index container
        var container = jsonld.getContextValue(
          activeCtx, activeProperty, '@container');
        if(container === '@index') {
          continue;
        }

        // use keyword alias and add value
        var alias = _compactIri(activeCtx, expandedProperty);
        jsonld.addValue(rval, alias, expandedValue);
        continue;
      }

      // skip array processing for keywords that aren't @graph or @list
      if(expandedProperty !== '@graph' && expandedProperty !== '@list' &&
        _isKeyword(expandedProperty)) {
        // use keyword alias and add value as is
        var alias = _compactIri(activeCtx, expandedProperty);
        jsonld.addValue(rval, alias, expandedValue);
        continue;
      }

      // Note: expanded value must be an array due to expansion algorithm.

      // preserve empty arrays
      if(expandedValue.length === 0) {
        var itemActiveProperty = _compactIri(
          activeCtx, expandedProperty, expandedValue, {vocab: true},
          insideReverse);
        jsonld.addValue(
          rval, itemActiveProperty, expandedValue, {propertyIsArray: true});
      }

      // recusively process array values
      for(var vi = 0; vi < expandedValue.length; ++vi) {
        var expandedItem = expandedValue[vi];

        // compact property and get container type
        var itemActiveProperty = _compactIri(
          activeCtx, expandedProperty, expandedItem, {vocab: true},
          insideReverse);
        var container = jsonld.getContextValue(
          activeCtx, itemActiveProperty, '@container');

        // get @list value if appropriate
        var isList = _isList(expandedItem);
        var list = null;
        if(isList) {
          list = expandedItem['@list'];
        }

        // recursively compact expanded item
        var compactedItem = this.compact(
          activeCtx, itemActiveProperty, isList ? list : expandedItem, options);

        // handle @list
        if(isList) {
          // ensure @list value is an array
          if(!_isArray(compactedItem)) {
            compactedItem = [compactedItem];
          }

          if(container !== '@list') {
            // wrap using @list alias
            var wrapper = {};
            wrapper[_compactIri(activeCtx, '@list')] = compactedItem;
            compactedItem = wrapper;

            // include @index from expanded @list, if any
            if('@index' in expandedItem) {
              compactedItem[_compactIri(activeCtx, '@index')] =
                expandedItem['@index'];
            }
          } else if(itemActiveProperty in rval) {
            // can't use @list container for more than 1 list
            throw new JsonLdError(
              'JSON-LD compact error; property has a "@list" @container ' +
              'rule but there is more than a single @list that matches ' +
              'the compacted term in the document. Compaction might mix ' +
              'unwanted items into the list.',
              'jsonld.SyntaxError', {code: 'compaction to list of lists'});
          }
        }

        // handle language and index maps
        if(container === '@language' || container === '@index') {
          // get or create the map object
          var mapObject;
          if(itemActiveProperty in rval) {
            mapObject = rval[itemActiveProperty];
          } else {
            rval[itemActiveProperty] = mapObject = {};
          }

          // if container is a language map, simplify compacted value to
          // a simple string
          if(container === '@language' && _isValue(compactedItem)) {
            compactedItem = compactedItem['@value'];
          }

          // add compact value to map object using key from expanded value
          // based on the container type
          jsonld.addValue(mapObject, expandedItem[container], compactedItem);
        } else {
          // use an array if: compactArrays flag is false,
          // @container is @set or @list , value is an empty
          // array, or key is @graph
          var isArray = (!options.compactArrays || container === '@set' ||
            container === '@list' ||
            (_isArray(compactedItem) && compactedItem.length === 0) ||
            expandedProperty === '@list' || expandedProperty === '@graph');

          // add compact value
          jsonld.addValue(
            rval, itemActiveProperty, compactedItem,
            {propertyIsArray: isArray});
        }
      }
    }

    return rval;
  }

  // only primitives remain which are already compact
  return element;
};

/**
 * Recursively expands an element using the given context. Any context in
 * the element will be removed. All context URLs must have been retrieved
 * before calling this method.
 *
 * @param activeCtx the context to use.
 * @param activeProperty the property for the element, null for none.
 * @param element the element to expand.
 * @param options the expansion options.
 * @param insideList true if the element is a list, false if not.
 *
 * @return the expanded value.
 */
Processor.prototype.expand = function(
  activeCtx, activeProperty, element, options, insideList) {
  var self = this;

  // nothing to expand
  if(element === null || element === undefined) {
    return null;
  }

  if(!_isArray(element) && !_isObject(element)) {
    // drop free-floating scalars that are not in lists
    if(!insideList && (activeProperty === null ||
      _expandIri(activeCtx, activeProperty, {vocab: true}) === '@graph')) {
      return null;
    }

    // expand element according to value expansion rules
    return _expandValue(activeCtx, activeProperty, element);
  }

  // recursively expand array
  if(_isArray(element)) {
    var rval = [];
    var container = jsonld.getContextValue(
      activeCtx, activeProperty, '@container');
    insideList = insideList || container === '@list';
    for(var i = 0; i < element.length; ++i) {
      // expand element
      var e = self.expand(activeCtx, activeProperty, element[i], options);
      if(insideList && (_isArray(e) || _isList(e))) {
        // lists of lists are illegal
        throw new JsonLdError(
          'Invalid JSON-LD syntax; lists of lists are not permitted.',
          'jsonld.SyntaxError', {code: 'list of lists'});
      }
      // drop null values
      if(e !== null) {
        if(_isArray(e)) {
          rval = rval.concat(e);
        } else {
          rval.push(e);
        }
      }
    }
    return rval;
  }

  // recursively expand object:

  // if element has a context, process it
  if('@context' in element) {
    activeCtx = self.processContext(activeCtx, element['@context'], options);
  }

  // expand the active property
  var expandedActiveProperty = _expandIri(
    activeCtx, activeProperty, {vocab: true});

  var rval = {};
  var keys = Object.keys(element).sort();
  for(var ki = 0; ki < keys.length; ++ki) {
    var key = keys[ki];
    var value = element[key];
    var expandedValue;

    // skip @context
    if(key === '@context') {
      continue;
    }

    // expand property
    var expandedProperty = _expandIri(activeCtx, key, {vocab: true});

    // drop non-absolute IRI keys that aren't keywords
    if(expandedProperty === null ||
      !(_isAbsoluteIri(expandedProperty) || _isKeyword(expandedProperty))) {
      continue;
    }

    if(_isKeyword(expandedProperty)) {
      if(expandedActiveProperty === '@reverse') {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; a keyword cannot be used as a @reverse ' +
          'property.', 'jsonld.SyntaxError',
          {code: 'invalid reverse property map', value: value});
      }
      if(expandedProperty in rval) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; colliding keywords detected.',
          'jsonld.SyntaxError',
          {code: 'colliding keywords', keyword: expandedProperty});
      }
    }

    // syntax error if @id is not a string
    if(expandedProperty === '@id' && !_isString(value)) {
      if(!options.isFrame) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; "@id" value must a string.',
          'jsonld.SyntaxError', {code: 'invalid @id value', value: value});
      }
      if(!_isObject(value)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; "@id" value must be a string or an ' +
          'object.', 'jsonld.SyntaxError',
          {code: 'invalid @id value', value: value});
      }
    }

    if(expandedProperty === '@type') {
      _validateTypeValue(value);
    }

    // @graph must be an array or an object
    if(expandedProperty === '@graph' &&
      !(_isObject(value) || _isArray(value))) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; "@graph" value must not be an ' +
        'object or an array.',
        'jsonld.SyntaxError', {code: 'invalid @graph value', value: value});
    }

    // @value must not be an object or an array
    if(expandedProperty === '@value' &&
      (_isObject(value) || _isArray(value))) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; "@value" value must not be an ' +
        'object or an array.',
        'jsonld.SyntaxError',
        {code: 'invalid value object value', value: value});
    }

    // @language must be a string
    if(expandedProperty === '@language') {
      if(value === null) {
        // drop null @language values, they expand as if they didn't exist
        continue;
      }
      if(!_isString(value)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; "@language" value must be a string.',
          'jsonld.SyntaxError',
          {code: 'invalid language-tagged string', value: value});
      }
      // ensure language value is lowercase
      value = value.toLowerCase();
    }

    // @index must be a string
    if(expandedProperty === '@index') {
      if(!_isString(value)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; "@index" value must be a string.',
          'jsonld.SyntaxError',
          {code: 'invalid @index value', value: value});
      }
    }

    // @reverse must be an object
    if(expandedProperty === '@reverse') {
      if(!_isObject(value)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; "@reverse" value must be an object.',
          'jsonld.SyntaxError', {code: 'invalid @reverse value', value: value});
      }

      expandedValue = self.expand(activeCtx, '@reverse', value, options);

      // properties double-reversed
      if('@reverse' in expandedValue) {
        for(var property in expandedValue['@reverse']) {
          jsonld.addValue(
            rval, property, expandedValue['@reverse'][property],
            {propertyIsArray: true});
        }
      }

      // FIXME: can this be merged with code below to simplify?
      // merge in all reversed properties
      var reverseMap = rval['@reverse'] || null;
      for(var property in expandedValue) {
        if(property === '@reverse') {
          continue;
        }
        if(reverseMap === null) {
          reverseMap = rval['@reverse'] = {};
        }
        jsonld.addValue(reverseMap, property, [], {propertyIsArray: true});
        var items = expandedValue[property];
        for(var ii = 0; ii < items.length; ++ii) {
          var item = items[ii];
          if(_isValue(item) || _isList(item)) {
            throw new JsonLdError(
              'Invalid JSON-LD syntax; "@reverse" value must not be a ' +
              '@value or an @list.', 'jsonld.SyntaxError',
              {code: 'invalid reverse property value', value: expandedValue});
          }
          jsonld.addValue(
            reverseMap, property, item, {propertyIsArray: true});
        }
      }

      continue;
    }

    var container = jsonld.getContextValue(activeCtx, key, '@container');

    if(container === '@language' && _isObject(value)) {
      // handle language map container (skip if value is not an object)
      expandedValue = _expandLanguageMap(value);
    } else if(container === '@index' && _isObject(value)) {
      // handle index container (skip if value is not an object)
      expandedValue = (function _expandIndexMap(activeProperty) {
        var rval = [];
        var keys = Object.keys(value).sort();
        for(var ki = 0; ki < keys.length; ++ki) {
          var key = keys[ki];
          var val = value[key];
          if(!_isArray(val)) {
            val = [val];
          }
          val = self.expand(activeCtx, activeProperty, val, options, false);
          for(var vi = 0; vi < val.length; ++vi) {
            var item = val[vi];
            if(!('@index' in item)) {
              item['@index'] = key;
            }
            rval.push(item);
          }
        }
        return rval;
      })(key);
    } else {
      // recurse into @list or @set
      var isList = (expandedProperty === '@list');
      if(isList || expandedProperty === '@set') {
        var nextActiveProperty = activeProperty;
        if(isList && expandedActiveProperty === '@graph') {
          nextActiveProperty = null;
        }
        expandedValue = self.expand(
          activeCtx, nextActiveProperty, value, options, isList);
        if(isList && _isList(expandedValue)) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; lists of lists are not permitted.',
            'jsonld.SyntaxError', {code: 'list of lists'});
        }
      } else {
        // recursively expand value with key as new active property
        expandedValue = self.expand(activeCtx, key, value, options, false);
      }
    }

    // drop null values if property is not @value
    if(expandedValue === null && expandedProperty !== '@value') {
      continue;
    }

    // convert expanded value to @list if container specifies it
    if(expandedProperty !== '@list' && !_isList(expandedValue) &&
      container === '@list') {
      // ensure expanded value is an array
      expandedValue = (_isArray(expandedValue) ?
        expandedValue : [expandedValue]);
      expandedValue = {'@list': expandedValue};
    }

    // FIXME: can this be merged with code above to simplify?
    // merge in reverse properties
    if(activeCtx.mappings[key] && activeCtx.mappings[key].reverse) {
      var reverseMap = rval['@reverse'] = rval['@reverse'] || {};
      if(!_isArray(expandedValue)) {
        expandedValue = [expandedValue];
      }
      for(var ii = 0; ii < expandedValue.length; ++ii) {
        var item = expandedValue[ii];
        if(_isValue(item) || _isList(item)) {
          throw new JsonLdError(
            'Invalid JSON-LD syntax; "@reverse" value must not be a ' +
            '@value or an @list.', 'jsonld.SyntaxError',
            {code: 'invalid reverse property value', value: expandedValue});
        }
        jsonld.addValue(
          reverseMap, expandedProperty, item, {propertyIsArray: true});
      }
      continue;
    }

    // add value for property
    // use an array except for certain keywords
    var useArray =
      ['@index', '@id', '@type', '@value', '@language'].indexOf(
        expandedProperty) === -1;
    jsonld.addValue(
      rval, expandedProperty, expandedValue, {propertyIsArray: useArray});
  }

  // get property count on expanded output
  keys = Object.keys(rval);
  var count = keys.length;

  if('@value' in rval) {
    // @value must only have @language or @type
    if('@type' in rval && '@language' in rval) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; an element containing "@value" may not ' +
        'contain both "@type" and "@language".',
        'jsonld.SyntaxError', {code: 'invalid value object', element: rval});
    }
    var validCount = count - 1;
    if('@type' in rval) {
      validCount -= 1;
    }
    if('@index' in rval) {
      validCount -= 1;
    }
    if('@language' in rval) {
      validCount -= 1;
    }
    if(validCount !== 0) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; an element containing "@value" may only ' +
        'have an "@index" property and at most one other property ' +
        'which can be "@type" or "@language".',
        'jsonld.SyntaxError', {code: 'invalid value object', element: rval});
    }
    // drop null @values
    if(rval['@value'] === null) {
      rval = null;
    } else if('@language' in rval && !_isString(rval['@value'])) {
      // if @language is present, @value must be a string
      throw new JsonLdError(
        'Invalid JSON-LD syntax; only strings may be language-tagged.',
        'jsonld.SyntaxError',
        {code: 'invalid language-tagged value', element: rval});
    } else if('@type' in rval && (!_isAbsoluteIri(rval['@type']) ||
      rval['@type'].indexOf('_:') === 0)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; an element containing "@value" and "@type" ' +
        'must have an absolute IRI for the value of "@type".',
        'jsonld.SyntaxError', {code: 'invalid typed value', element: rval});
    }
  } else if('@type' in rval && !_isArray(rval['@type'])) {
    // convert @type to an array
    rval['@type'] = [rval['@type']];
  } else if('@set' in rval || '@list' in rval) {
    // handle @set and @list
    if(count > 1 && !(count === 2 && '@index' in rval)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; if an element has the property "@set" ' +
        'or "@list", then it can have at most one other property that is ' +
        '"@index".', 'jsonld.SyntaxError',
        {code: 'invalid set or list object', element: rval});
    }
    // optimize away @set
    if('@set' in rval) {
      rval = rval['@set'];
      keys = Object.keys(rval);
      count = keys.length;
    }
  } else if(count === 1 && '@language' in rval) {
    // drop objects with only @language
    rval = null;
  }

  // drop certain top-level objects that do not occur in lists
  if(_isObject(rval) &&
    !options.keepFreeFloatingNodes && !insideList &&
    (activeProperty === null || expandedActiveProperty === '@graph')) {
    // drop empty object, top-level @value/@list, or object with only @id
    if(count === 0 || '@value' in rval || '@list' in rval ||
      (count === 1 && '@id' in rval)) {
      rval = null;
    }
  }

  return rval;
};

/**
 * Creates a JSON-LD node map (node ID => node).
 *
 * @param input the expanded JSON-LD to create a node map of.
 * @param [options] the options to use:
 *          [issuer] a jsonld.IdentifierIssuer to use to label blank nodes.
 *          [namer] (deprecated).
 *
 * @return the node map.
 */
Processor.prototype.createNodeMap = function(input, options) {
  options = options || {};

  // produce a map of all subjects and name each bnode
  var issuer = options.namer || options.issuer || new IdentifierIssuer('_:b');
  var graphs = {'@default': {}};
  _createNodeMap(input, graphs, '@default', issuer);

  // add all non-default graphs to default graph
  return _mergeNodeMaps(graphs);
};

/**
 * Performs JSON-LD flattening.
 *
 * @param input the expanded JSON-LD to flatten.
 *
 * @return the flattened output.
 */
Processor.prototype.flatten = function(input) {
  var defaultGraph = this.createNodeMap(input);

  // produce flattened output
  var flattened = [];
  var keys = Object.keys(defaultGraph).sort();
  for(var ki = 0; ki < keys.length; ++ki) {
    var node = defaultGraph[keys[ki]];
    // only add full subjects to top-level
    if(!_isSubjectReference(node)) {
      flattened.push(node);
    }
  }
  return flattened;
};

/**
 * Performs JSON-LD framing.
 *
 * @param input the expanded JSON-LD to frame.
 * @param frame the expanded JSON-LD frame to use.
 * @param options the framing options.
 *
 * @return the framed output.
 */
Processor.prototype.frame = function(input, frame, options) {
  // create framing state
  var state = {
    options: options,
    graphs: {'@default': {}, '@merged': {}},
    subjectStack: [],
    link: {}
  };

  // produce a map of all graphs and name each bnode
  // FIXME: currently uses subjects from @merged graph only
  var issuer = new IdentifierIssuer('_:b');
  _createNodeMap(input, state.graphs, '@merged', issuer);
  state.subjects = state.graphs['@merged'];

  // frame the subjects
  var framed = [];
  _frame(state, Object.keys(state.subjects).sort(), frame, framed, null);
  return framed;
};

/**
 * Performs normalization on the given RDF dataset.
 *
 * @param dataset the RDF dataset to normalize.
 * @param options the normalization options.
 * @param callback(err, normalized) called once the operation completes.
 */
Processor.prototype.normalize = function(dataset, options, callback) {
  if(options.algorithm === 'URDNA2015') {
    return new URDNA2015(options).main(dataset, callback);
  }
  if(options.algorithm === 'URGNA2012') {
    return new URGNA2012(options).main(dataset, callback);
  }
  callback(new Error(
    'Invalid RDF Dataset Normalization algorithm: ' + options.algorithm));
};

/**
 * Converts an RDF dataset to JSON-LD.
 *
 * @param dataset the RDF dataset.
 * @param options the RDF serialization options.
 * @param callback(err, output) called once the operation completes.
 */
Processor.prototype.fromRDF = function(dataset, options, callback) {
  var defaultGraph = {};
  var graphMap = {'@default': defaultGraph};
  var referencedOnce = {};

  for(var name in dataset) {
    var graph = dataset[name];
    if(!(name in graphMap)) {
      graphMap[name] = {};
    }
    if(name !== '@default' && !(name in defaultGraph)) {
      defaultGraph[name] = {'@id': name};
    }
    var nodeMap = graphMap[name];
    for(var ti = 0; ti < graph.length; ++ti) {
      var triple = graph[ti];

      // get subject, predicate, object
      var s = triple.subject.value;
      var p = triple.predicate.value;
      var o = triple.object;

      if(!(s in nodeMap)) {
        nodeMap[s] = {'@id': s};
      }
      var node = nodeMap[s];

      var objectIsId = (o.type === 'IRI' || o.type === 'blank node');
      if(objectIsId && !(o.value in nodeMap)) {
        nodeMap[o.value] = {'@id': o.value};
      }

      if(p === RDF_TYPE && !options.useRdfType && objectIsId) {
        jsonld.addValue(node, '@type', o.value, {propertyIsArray: true});
        continue;
      }

      var value = _RDFToObject(o, options.useNativeTypes);
      jsonld.addValue(node, p, value, {propertyIsArray: true});

      // object may be an RDF list/partial list node but we can't know easily
      // until all triples are read
      if(objectIsId) {
        if(o.value === RDF_NIL) {
          // track rdf:nil uniquely per graph
          var object = nodeMap[o.value];
          if(!('usages' in object)) {
            object.usages = [];
          }
          object.usages.push({
            node: node,
            property: p,
            value: value
          });
        } else if(o.value in referencedOnce) {
          // object referenced more than once
          referencedOnce[o.value] = false;
        } else {
          // keep track of single reference
          referencedOnce[o.value] = {
            node: node,
            property: p,
            value: value
          };
        }
      }
    }
  }

  // convert linked lists to @list arrays
  for(var name in graphMap) {
    var graphObject = graphMap[name];

    // no @lists to be converted, continue
    if(!(RDF_NIL in graphObject)) {
      continue;
    }

    // iterate backwards through each RDF list
    var nil = graphObject[RDF_NIL];
    for(var i = 0; i < nil.usages.length; ++i) {
      var usage = nil.usages[i];
      var node = usage.node;
      var property = usage.property;
      var head = usage.value;
      var list = [];
      var listNodes = [];

      // ensure node is a well-formed list node; it must:
      // 1. Be referenced only once.
      // 2. Have an array for rdf:first that has 1 item.
      // 3. Have an array for rdf:rest that has 1 item.
      // 4. Have no keys other than: @id, rdf:first, rdf:rest, and,
      //   optionally, @type where the value is rdf:List.
      var nodeKeyCount = Object.keys(node).length;
      while(property === RDF_REST &&
        _isObject(referencedOnce[node['@id']]) &&
        _isArray(node[RDF_FIRST]) && node[RDF_FIRST].length === 1 &&
        _isArray(node[RDF_REST]) && node[RDF_REST].length === 1 &&
        (nodeKeyCount === 3 || (nodeKeyCount === 4 && _isArray(node['@type']) &&
          node['@type'].length === 1 && node['@type'][0] === RDF_LIST))) {
        list.push(node[RDF_FIRST][0]);
        listNodes.push(node['@id']);

        // get next node, moving backwards through list
        usage = referencedOnce[node['@id']];
        node = usage.node;
        property = usage.property;
        head = usage.value;
        nodeKeyCount = Object.keys(node).length;

        // if node is not a blank node, then list head found
        if(node['@id'].indexOf('_:') !== 0) {
          break;
        }
      }

      // the list is nested in another list
      if(property === RDF_FIRST) {
        // empty list
        if(node['@id'] === RDF_NIL) {
          // can't convert rdf:nil to a @list object because it would
          // result in a list of lists which isn't supported
          continue;
        }

        // preserve list head
        head = graphObject[head['@id']][RDF_REST][0];
        list.pop();
        listNodes.pop();
      }

      // transform list into @list object
      delete head['@id'];
      head['@list'] = list.reverse();
      for(var j = 0; j < listNodes.length; ++j) {
        delete graphObject[listNodes[j]];
      }
    }

    delete nil.usages;
  }

  var result = [];
  var subjects = Object.keys(defaultGraph).sort();
  for(var i = 0; i < subjects.length; ++i) {
    var subject = subjects[i];
    var node = defaultGraph[subject];
    if(subject in graphMap) {
      var graph = node['@graph'] = [];
      var graphObject = graphMap[subject];
      var subjects_ = Object.keys(graphObject).sort();
      for(var si = 0; si < subjects_.length; ++si) {
        var node_ = graphObject[subjects_[si]];
        // only add full subjects to top-level
        if(!_isSubjectReference(node_)) {
          graph.push(node_);
        }
      }
    }
    // only add full subjects to top-level
    if(!_isSubjectReference(node)) {
      result.push(node);
    }
  }

  callback(null, result);
};

/**
 * Outputs an RDF dataset for the expanded JSON-LD input.
 *
 * @param input the expanded JSON-LD input.
 * @param options the RDF serialization options.
 *
 * @return the RDF dataset.
 */
Processor.prototype.toRDF = function(input, options) {
  // create node map for default graph (and any named graphs)
  var issuer = new IdentifierIssuer('_:b');
  var nodeMap = {'@default': {}};
  _createNodeMap(input, nodeMap, '@default', issuer);

  var dataset = {};
  var graphNames = Object.keys(nodeMap).sort();
  for(var i = 0; i < graphNames.length; ++i) {
    var graphName = graphNames[i];
    // skip relative IRIs
    if(graphName === '@default' || _isAbsoluteIri(graphName)) {
      dataset[graphName] = _graphToRDF(nodeMap[graphName], issuer, options);
    }
  }
  return dataset;
};

/**
 * Processes a local context and returns a new active context.
 *
 * @param activeCtx the current active context.
 * @param localCtx the local context to process.
 * @param options the context processing options.
 *
 * @return the new active context.
 */
Processor.prototype.processContext = function(activeCtx, localCtx, options) {
  // normalize local context to an array of @context objects
  if(_isObject(localCtx) && '@context' in localCtx &&
    _isArray(localCtx['@context'])) {
    localCtx = localCtx['@context'];
  }
  var ctxs = _isArray(localCtx) ? localCtx : [localCtx];

  // no contexts in array, clone existing context
  if(ctxs.length === 0) {
    return activeCtx.clone();
  }

  // process each context in order, update active context
  // on each iteration to ensure proper caching
  var rval = activeCtx;
  for(var i = 0; i < ctxs.length; ++i) {
    var ctx = ctxs[i];

    // reset to initial context
    if(ctx === null) {
      rval = activeCtx = _getInitialContext(options);
      continue;
    }

    // dereference @context key if present
    if(_isObject(ctx) && '@context' in ctx) {
      ctx = ctx['@context'];
    }

    // context must be an object by now, all URLs retrieved before this call
    if(!_isObject(ctx)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context must be an object.',
        'jsonld.SyntaxError', {code: 'invalid local context', context: ctx});
    }

    // get context from cache if available
    if(jsonld.cache.activeCtx) {
      var cached = jsonld.cache.activeCtx.get(activeCtx, ctx);
      if(cached) {
        rval = activeCtx = cached;
        continue;
      }
    }

    // update active context and clone new one before updating
    activeCtx = rval;
    rval = rval.clone();

    // define context mappings for keys in local context
    var defined = {};

    // handle @base
    if('@base' in ctx) {
      var base = ctx['@base'];

      // clear base
      if(base === null) {
        base = null;
      } else if(!_isString(base)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; the value of "@base" in a ' +
          '@context must be a string or null.',
          'jsonld.SyntaxError', {code: 'invalid base IRI', context: ctx});
      } else if(base !== '' && !_isAbsoluteIri(base)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; the value of "@base" in a ' +
          '@context must be an absolute IRI or the empty string.',
          'jsonld.SyntaxError', {code: 'invalid base IRI', context: ctx});
      }

      if(base !== null) {
        base = jsonld.url.parse(base || '');
      }
      rval['@base'] = base;
      defined['@base'] = true;
    }

    // handle @vocab
    if('@vocab' in ctx) {
      var value = ctx['@vocab'];
      if(value === null) {
        delete rval['@vocab'];
      } else if(!_isString(value)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; the value of "@vocab" in a ' +
          '@context must be a string or null.',
          'jsonld.SyntaxError', {code: 'invalid vocab mapping', context: ctx});
      } else if(!_isAbsoluteIri(value)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; the value of "@vocab" in a ' +
          '@context must be an absolute IRI.',
          'jsonld.SyntaxError', {code: 'invalid vocab mapping', context: ctx});
      } else {
        rval['@vocab'] = value;
      }
      defined['@vocab'] = true;
    }

    // handle @language
    if('@language' in ctx) {
      var value = ctx['@language'];
      if(value === null) {
        delete rval['@language'];
      } else if(!_isString(value)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; the value of "@language" in a ' +
          '@context must be a string or null.',
          'jsonld.SyntaxError',
          {code: 'invalid default language', context: ctx});
      } else {
        rval['@language'] = value.toLowerCase();
      }
      defined['@language'] = true;
    }

    // process all other keys
    for(var key in ctx) {
      _createTermDefinition(rval, ctx, key, defined);
    }

    // cache result
    if(jsonld.cache.activeCtx) {
      jsonld.cache.activeCtx.set(activeCtx, ctx, rval);
    }
  }

  return rval;
};

/**
 * Expands a language map.
 *
 * @param languageMap the language map to expand.
 *
 * @return the expanded language map.
 */
function _expandLanguageMap(languageMap) {
  var rval = [];
  var keys = Object.keys(languageMap).sort();
  for(var ki = 0; ki < keys.length; ++ki) {
    var key = keys[ki];
    var val = languageMap[key];
    if(!_isArray(val)) {
      val = [val];
    }
    for(var vi = 0; vi < val.length; ++vi) {
      var item = val[vi];
      if(item === null) {
          // null values are allowed (8.5) but ignored (3.1)
          continue;
      }
      if(!_isString(item)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; language map values must be strings.',
          'jsonld.SyntaxError',
          {code: 'invalid language map value', languageMap: languageMap});
      }
      rval.push({
        '@value': item,
        '@language': key.toLowerCase()
      });
    }
  }
  return rval;
}

/**
 * Labels the blank nodes in the given value using the given IdentifierIssuer.
 *
 * @param issuer the IdentifierIssuer to use.
 * @param element the element with blank nodes to rename.
 *
 * @return the element.
 */
function _labelBlankNodes(issuer, element) {
  if(_isArray(element)) {
    for(var i = 0; i < element.length; ++i) {
      element[i] = _labelBlankNodes(issuer, element[i]);
    }
  } else if(_isList(element)) {
    element['@list'] = _labelBlankNodes(issuer, element['@list']);
  } else if(_isObject(element)) {
    // relabel blank node
    if(_isBlankNode(element)) {
      element['@id'] = issuer.getId(element['@id']);
    }

    // recursively apply to all keys
    var keys = Object.keys(element).sort();
    for(var ki = 0; ki < keys.length; ++ki) {
      var key = keys[ki];
      if(key !== '@id') {
        element[key] = _labelBlankNodes(issuer, element[key]);
      }
    }
  }

  return element;
}

/**
 * Expands the given value by using the coercion and keyword rules in the
 * given context.
 *
 * @param activeCtx the active context to use.
 * @param activeProperty the active property the value is associated with.
 * @param value the value to expand.
 *
 * @return the expanded value.
 */
function _expandValue(activeCtx, activeProperty, value) {
  // nothing to expand
  if(value === null || value === undefined) {
    return null;
  }

  // special-case expand @id and @type (skips '@id' expansion)
  var expandedProperty = _expandIri(activeCtx, activeProperty, {vocab: true});
  if(expandedProperty === '@id') {
    return _expandIri(activeCtx, value, {base: true});
  } else if(expandedProperty === '@type') {
    return _expandIri(activeCtx, value, {vocab: true, base: true});
  }

  // get type definition from context
  var type = jsonld.getContextValue(activeCtx, activeProperty, '@type');

  // do @id expansion (automatic for @graph)
  if(type === '@id' || (expandedProperty === '@graph' && _isString(value))) {
    return {'@id': _expandIri(activeCtx, value, {base: true})};
  }
  // do @id expansion w/vocab
  if(type === '@vocab') {
    return {'@id': _expandIri(activeCtx, value, {vocab: true, base: true})};
  }

  // do not expand keyword values
  if(_isKeyword(expandedProperty)) {
    return value;
  }

  var rval = {};

  if(type !== null) {
    // other type
    rval['@type'] = type;
  } else if(_isString(value)) {
    // check for language tagging for strings
    var language = jsonld.getContextValue(
      activeCtx, activeProperty, '@language');
    if(language !== null) {
      rval['@language'] = language;
    }
  }
  // do conversion of values that aren't basic JSON types to strings
  if(['boolean', 'number', 'string'].indexOf(typeof value) === -1) {
    value = value.toString();
  }
  rval['@value'] = value;

  return rval;
}

/**
 * Creates an array of RDF triples for the given graph.
 *
 * @param graph the graph to create RDF triples for.
 * @param issuer a IdentifierIssuer for assigning blank node names.
 * @param options the RDF serialization options.
 *
 * @return the array of RDF triples for the given graph.
 */
function _graphToRDF(graph, issuer, options) {
  var rval = [];

  var ids = Object.keys(graph).sort();
  for(var i = 0; i < ids.length; ++i) {
    var id = ids[i];
    var node = graph[id];
    var properties = Object.keys(node).sort();
    for(var pi = 0; pi < properties.length; ++pi) {
      var property = properties[pi];
      var items = node[property];
      if(property === '@type') {
        property = RDF_TYPE;
      } else if(_isKeyword(property)) {
        continue;
      }

      for(var ii = 0; ii < items.length; ++ii) {
        var item = items[ii];

        // RDF subject
        var subject = {};
        subject.type = (id.indexOf('_:') === 0) ? 'blank node' : 'IRI';
        subject.value = id;

        // skip relative IRI subjects
        if(!_isAbsoluteIri(id)) {
          continue;
        }

        // RDF predicate
        var predicate = {};
        predicate.type = (property.indexOf('_:') === 0) ? 'blank node' : 'IRI';
        predicate.value = property;

        // skip relative IRI predicates
        if(!_isAbsoluteIri(property)) {
          continue;
        }

        // skip blank node predicates unless producing generalized RDF
        if(predicate.type === 'blank node' && !options.produceGeneralizedRdf) {
          continue;
        }

        // convert @list to triples
        if(_isList(item)) {
          _listToRDF(item['@list'], issuer, subject, predicate, rval);
        } else {
          // convert value or node object to triple
          var object = _objectToRDF(item);
          // skip null objects (they are relative IRIs)
          if(object) {
            rval.push({subject: subject, predicate: predicate, object: object});
          }
        }
      }
    }
  }

  return rval;
}

/**
 * Converts a @list value into linked list of blank node RDF triples
 * (an RDF collection).
 *
 * @param list the @list value.
 * @param issuer a IdentifierIssuer for assigning blank node names.
 * @param subject the subject for the head of the list.
 * @param predicate the predicate for the head of the list.
 * @param triples the array of triples to append to.
 */
function _listToRDF(list, issuer, subject, predicate, triples) {
  var first = {type: 'IRI', value: RDF_FIRST};
  var rest = {type: 'IRI', value: RDF_REST};
  var nil = {type: 'IRI', value: RDF_NIL};

  for(var i = 0; i < list.length; ++i) {
    var item = list[i];

    var blankNode = {type: 'blank node', value: issuer.getId()};
    triples.push({subject: subject, predicate: predicate, object: blankNode});

    subject = blankNode;
    predicate = first;
    var object = _objectToRDF(item);

    // skip null objects (they are relative IRIs)
    if(object) {
      triples.push({subject: subject, predicate: predicate, object: object});
    }

    predicate = rest;
  }

  triples.push({subject: subject, predicate: predicate, object: nil});
}

/**
 * Converts a JSON-LD value object to an RDF literal or a JSON-LD string or
 * node object to an RDF resource.
 *
 * @param item the JSON-LD value or node object.
 *
 * @return the RDF literal or RDF resource.
 */
function _objectToRDF(item) {
  var object = {};

  // convert value object to RDF
  if(_isValue(item)) {
    object.type = 'literal';
    var value = item['@value'];
    var datatype = item['@type'] || null;

    // convert to XSD datatypes as appropriate
    if(_isBoolean(value)) {
      object.value = value.toString();
      object.datatype = datatype || XSD_BOOLEAN;
    } else if(_isDouble(value) || datatype === XSD_DOUBLE) {
      if(!_isDouble(value)) {
        value = parseFloat(value);
      }
      // canonical double representation
      object.value = value.toExponential(15).replace(/(\d)0*e\+?/, '$1E');
      object.datatype = datatype || XSD_DOUBLE;
    } else if(_isNumber(value)) {
      object.value = value.toFixed(0);
      object.datatype = datatype || XSD_INTEGER;
    } else if('@language' in item) {
      object.value = value;
      object.datatype = datatype || RDF_LANGSTRING;
      object.language = item['@language'];
    } else {
      object.value = value;
      object.datatype = datatype || XSD_STRING;
    }
  } else {
    // convert string/node object to RDF
    var id = _isObject(item) ? item['@id'] : item;
    object.type = (id.indexOf('_:') === 0) ? 'blank node' : 'IRI';
    object.value = id;
  }

  // skip relative IRIs
  if(object.type === 'IRI' && !_isAbsoluteIri(object.value)) {
    return null;
  }

  return object;
}

/**
 * Converts an RDF triple object to a JSON-LD object.
 *
 * @param o the RDF triple object to convert.
 * @param useNativeTypes true to output native types, false not to.
 *
 * @return the JSON-LD object.
 */
function _RDFToObject(o, useNativeTypes) {
  // convert IRI/blank node object to JSON-LD
  if(o.type === 'IRI' || o.type === 'blank node') {
    return {'@id': o.value};
  }

  // convert literal to JSON-LD
  var rval = {'@value': o.value};

  // add language
  if(o.language) {
    rval['@language'] = o.language;
  } else {
    var type = o.datatype;
    if(!type) {
      type = XSD_STRING;
    }
    // use native types for certain xsd types
    if(useNativeTypes) {
      if(type === XSD_BOOLEAN) {
        if(rval['@value'] === 'true') {
          rval['@value'] = true;
        } else if(rval['@value'] === 'false') {
          rval['@value'] = false;
        }
      } else if(_isNumeric(rval['@value'])) {
        if(type === XSD_INTEGER) {
          var i = parseInt(rval['@value'], 10);
          if(i.toFixed(0) === rval['@value']) {
            rval['@value'] = i;
          }
        } else if(type === XSD_DOUBLE) {
          rval['@value'] = parseFloat(rval['@value']);
        }
      }
      // do not add native type
      if([XSD_BOOLEAN, XSD_INTEGER, XSD_DOUBLE, XSD_STRING]
        .indexOf(type) === -1) {
        rval['@type'] = type;
      }
    } else if(type !== XSD_STRING) {
      rval['@type'] = type;
    }
  }

  return rval;
}

/**
 * Compares two RDF triples for equality.
 *
 * @param t1 the first triple.
 * @param t2 the second triple.
 *
 * @return true if the triples are the same, false if not.
 */
function _compareRDFTriples(t1, t2) {
  var attrs = ['subject', 'predicate', 'object'];
  for(var i = 0; i < attrs.length; ++i) {
    var attr = attrs[i];
    if(t1[attr].type !== t2[attr].type || t1[attr].value !== t2[attr].value) {
      return false;
    }
  }
  if(t1.object.language !== t2.object.language) {
    return false;
  }
  if(t1.object.datatype !== t2.object.datatype) {
    return false;
  }
  return true;
}

/////////////////////////////// DEFINE URDNA2015 //////////////////////////////

var URDNA2015 = (function() {

var POSITIONS = {'subject': 's', 'object': 'o', 'name': 'g'};

var Normalize = function(options) {
  options = options || {};
  this.name = 'URDNA2015';
  this.options = options;
  this.blankNodeInfo = {};
  this.hashToBlankNodes = {};
  this.canonicalIssuer = new IdentifierIssuer('_:c14n');
  this.quads = [];
  this.schedule = {};
  if('maxCallStackDepth' in options) {
    this.schedule.MAX_DEPTH = options.maxCallStackDepth;
  } else {
    this.schedule.MAX_DEPTH = 500;
  }
  if('maxTotalCallStackDepth' in options) {
    this.schedule.MAX_TOTAL_DEPTH = options.maxCallStackDepth;
  } else {
    this.schedule.MAX_TOTAL_DEPTH = 0xFFFFFFFF;
  }
  this.schedule.depth = 0;
  this.schedule.totalDepth = 0;
  if('timeSlice' in options) {
    this.schedule.timeSlice = options.timeSlice;
  } else {
    // milliseconds
    this.schedule.timeSlice = 10;
  }
};

// do some work in a time slice, but in serial
Normalize.prototype.doWork = function(fn, callback) {
  var schedule = this.schedule;

  if(schedule.totalDepth >= schedule.MAX_TOTAL_DEPTH) {
    return callback(new Error(
      'Maximum total call stack depth exceeded; normalization aborting.'));
  }

  (function work() {
    if(schedule.depth === schedule.MAX_DEPTH) {
      // stack too deep, run on next tick
      schedule.depth = 0;
      schedule.running = false;
      return jsonld.nextTick(work);
    }

    // if not yet running, force run
    var now = new Date().getTime();
    if(!schedule.running) {
      schedule.start = new Date().getTime();
      schedule.deadline = schedule.start + schedule.timeSlice;
    }

    // TODO: should also include an estimate of expectedWorkTime
    if(now < schedule.deadline) {
      schedule.running = true;
      schedule.depth++;
      schedule.totalDepth++;
      return fn(function(err, result) {
        schedule.depth--;
        schedule.totalDepth--;
        callback(err, result);
      });
    }

    // not enough time left in this slice, run after letting browser
    // do some other things
    schedule.depth = 0;
    schedule.running = false;
    jsonld.setImmediate(work);
  })();
};

// asynchronously loop
Normalize.prototype.forEach = function(iterable, fn, callback) {
  var self = this;
  var iterator;
  var idx = 0;
  var length;
  if(_isArray(iterable)) {
    length = iterable.length;
    iterator = function() {
      if(idx === length) {
        return false;
      }
      iterator.value = iterable[idx++];
      iterator.key = idx;
      return true;
    };
  } else {
    var keys = Object.keys(iterable);
    length = keys.length;
    iterator = function() {
      if(idx === length) {
        return false;
      }
      iterator.key = keys[idx++];
      iterator.value = iterable[iterator.key];
      return true;
    };
  }

  (function iterate(err, result) {
    if(err) {
      return callback(err);
    }
    if(iterator()) {
      return self.doWork(function() {
        fn(iterator.value, iterator.key, iterate);
      });
    }
    callback();
  })();
};

// asynchronous waterfall
Normalize.prototype.waterfall = function(fns, callback) {
  var self = this;
  self.forEach(fns, function(fn, idx, callback) {
    self.doWork(fn, callback);
  }, callback);
};

// asynchronous while
Normalize.prototype.whilst = function(condition, fn, callback) {
  var self = this;
  (function loop(err) {
    if(err) {
      return callback(err);
    }
    if(!condition()) {
      return callback();
    }
    self.doWork(fn, loop);
  })();
};

// 4.4) Normalization Algorithm
Normalize.prototype.main = function(dataset, callback) {
  var self = this;
  self.schedule.start = new Date().getTime();
  var result;

  // handle invalid output format
  if(self.options.format) {
    if(self.options.format !== 'application/nquads') {
      return callback(new JsonLdError(
        'Unknown output format.',
        'jsonld.UnknownFormat', {format: self.options.format}));
    }
  }

  // 1) Create the normalization state.

  // Note: Optimize by generating non-normalized blank node map concurrently.
  var nonNormalized = {};

  self.waterfall([
    function(callback) {
      // 2) For every quad in input dataset:
      self.forEach(dataset, function(triples, graphName, callback) {
        if(graphName === '@default') {
          graphName = null;
        }
        self.forEach(triples, function(quad, idx, callback) {
          if(graphName !== null) {
            if(graphName.indexOf('_:') === 0) {
              quad.name = {type: 'blank node', value: graphName};
            } else {
              quad.name = {type: 'IRI', value: graphName};
            }
          }
          self.quads.push(quad);

          // 2.1) For each blank node that occurs in the quad, add a reference
          // to the quad using the blank node identifier in the blank node to
          // quads map, creating a new entry if necessary.
          self.forEachComponent(quad, function(component) {
            if(component.type !== 'blank node') {
              return;
            }
            var id = component.value;
            if(id in self.blankNodeInfo) {
              self.blankNodeInfo[id].quads.push(quad);
            } else {
              nonNormalized[id] = true;
              self.blankNodeInfo[id] = {quads: [quad]};
            }
          });
          callback();
        }, callback);
      }, callback);
    },
    function(callback) {
      // 3) Create a list of non-normalized blank node identifiers
      // non-normalized identifiers and populate it using the keys from the
      // blank node to quads map.
      // Note: We use a map here and it was generated during step 2.

      // 4) Initialize simple, a boolean flag, to true.
      var simple = true;

      // 5) While simple is true, issue canonical identifiers for blank nodes:
      self.whilst(function() { return simple; }, function(callback) {
        // 5.1) Set simple to false.
        simple = false;

        // 5.2) Clear hash to blank nodes map.
        self.hashToBlankNodes = {};

        self.waterfall([
          function(callback) {
            // 5.3) For each blank node identifier identifier in non-normalized
            // identifiers:
            self.forEach(nonNormalized, function(value, id, callback) {
              // 5.3.1) Create a hash, hash, according to the Hash First Degree
              // Quads algorithm.
              self.hashFirstDegreeQuads(id, function(err, hash) {
                if(err) {
                  return callback(err);
                }
                // 5.3.2) Add hash and identifier to hash to blank nodes map,
                // creating a new entry if necessary.
                if(hash in self.hashToBlankNodes) {
                  self.hashToBlankNodes[hash].push(id);
                } else {
                  self.hashToBlankNodes[hash] = [id];
                }
                callback();
              });
            }, callback);
          },
          function(callback) {
            // 5.4) For each hash to identifier list mapping in hash to blank
            // nodes map, lexicographically-sorted by hash:
            var hashes = Object.keys(self.hashToBlankNodes).sort();
            self.forEach(hashes, function(hash, i, callback) {
              // 5.4.1) If the length of identifier list is greater than 1,
              // continue to the next mapping.
              var idList = self.hashToBlankNodes[hash];
              if(idList.length > 1) {
                return callback();
              }

              // 5.4.2) Use the Issue Identifier algorithm, passing canonical
              // issuer and the single blank node identifier in identifier
              // list, identifier, to issue a canonical replacement identifier
              // for identifier.
              // TODO: consider changing `getId` to `issue`
              var id = idList[0];
              self.canonicalIssuer.getId(id);

              // 5.4.3) Remove identifier from non-normalized identifiers.
              delete nonNormalized[id];

              // 5.4.4) Remove hash from the hash to blank nodes map.
              delete self.hashToBlankNodes[hash];

              // 5.4.5) Set simple to true.
              simple = true;
              callback();
            }, callback);
          }
        ], callback);
      }, callback);
    },
    function(callback) {
      // 6) For each hash to identifier list mapping in hash to blank nodes map,
      // lexicographically-sorted by hash:
      var hashes = Object.keys(self.hashToBlankNodes).sort();
      self.forEach(hashes, function(hash, idx, callback) {
        // 6.1) Create hash path list where each item will be a result of
        // running the Hash N-Degree Quads algorithm.
        var hashPathList = [];

        // 6.2) For each blank node identifier identifier in identifier list:
        var idList = self.hashToBlankNodes[hash];
        self.waterfall([
          function(callback) {
            self.forEach(idList, function(id, idx, callback) {
              // 6.2.1) If a canonical identifier has already been issued for
              // identifier, continue to the next identifier.
              if(self.canonicalIssuer.hasId(id)) {
                return callback();
              }

              // 6.2.2) Create temporary issuer, an identifier issuer
              // initialized with the prefix _:b.
              var issuer = new IdentifierIssuer('_:b');

              // 6.2.3) Use the Issue Identifier algorithm, passing temporary
              // issuer and identifier, to issue a new temporary blank node
              // identifier for identifier.
              issuer.getId(id);

              // 6.2.4) Run the Hash N-Degree Quads algorithm, passing
              // temporary issuer, and append the result to the hash path list.
              self.hashNDegreeQuads(id, issuer, function(err, result) {
                if(err) {
                  return callback(err);
                }
                hashPathList.push(result);
                callback();
              });
            }, callback);
          },
          function(callback) {
            // 6.3) For each result in the hash path list,
            // lexicographically-sorted by the hash in result:
            hashPathList.sort(function(a, b) {
              return (a.hash < b.hash) ? -1 : ((a.hash > b.hash) ? 1 : 0);
            });
            self.forEach(hashPathList, function(result, idx, callback) {
              // 6.3.1) For each blank node identifier, existing identifier,
              // that was issued a temporary identifier by identifier issuer
              // in result, issue a canonical identifier, in the same order,
              // using the Issue Identifier algorithm, passing canonical
              // issuer and existing identifier.
              for(var existing in result.issuer.existing) {
                self.canonicalIssuer.getId(existing);
              }
              callback();
            }, callback);
          }
        ], callback);
      }, callback);
    }, function(callback) {
      /* Note: At this point all blank nodes in the set of RDF quads have been
      assigned canonical identifiers, which have been stored in the canonical
      issuer. Here each quad is updated by assigning each of its blank nodes
      its new identifier. */

      // 7) For each quad, quad, in input dataset:
      var normalized = [];
      self.waterfall([
        function(callback) {
          self.forEach(self.quads, function(quad, idx, callback) {
            // 7.1) Create a copy, quad copy, of quad and replace any existing
            // blank node identifiers using the canonical identifiers
            // previously issued by canonical issuer.
            // Note: We optimize away the copy here.
            self.forEachComponent(quad, function(component) {
              if(component.type === 'blank node' &&
                component.value.indexOf(self.canonicalIssuer.prefix) !== 0) {
                component.value = self.canonicalIssuer.getId(component.value);
              }
            });
            // 7.2) Add quad copy to the normalized dataset.
            normalized.push(_toNQuad(quad));
            callback();
          }, callback);
        },
        function(callback) {
          // sort normalized output
          normalized.sort();

          // 8) Return the normalized dataset.
          if(self.options.format === 'application/nquads') {
            result = normalized.join('');
            return callback();
          }

          result = _parseNQuads(normalized.join(''));
          callback();
        }
      ], callback);
    }
  ], function(err) {
    callback(err, result);
  });
};

// 4.6) Hash First Degree Quads
Normalize.prototype.hashFirstDegreeQuads = function(id, callback) {
  var self = this;

  // return cached hash
  var info = self.blankNodeInfo[id];
  if('hash' in info) {
    return callback(null, info.hash);
  }

  // 1) Initialize nquads to an empty list. It will be used to store quads in
  // N-Quads format.
  var nquads = [];

  // 2) Get the list of quads quads associated with the reference blank node
  // identifier in the blank node to quads map.
  var quads = info.quads;

  // 3) For each quad quad in quads:
  self.forEach(quads, function(quad, idx, callback) {
    // 3.1) Serialize the quad in N-Quads format with the following special
    // rule:

    // 3.1.1) If any component in quad is an blank node, then serialize it
    // using a special identifier as follows:
    var copy = {predicate: quad.predicate};
    self.forEachComponent(quad, function(component, key) {
      // 3.1.2) If the blank node's existing blank node identifier matches the
      // reference blank node identifier then use the blank node identifier _:a,
      // otherwise, use the blank node identifier _:z.
      copy[key] = self.modifyFirstDegreeComponent(id, component, key);
    });
    nquads.push(_toNQuad(copy));
    callback();
  }, function(err) {
    if(err) {
      return callback(err);
    }
    // 4) Sort nquads in lexicographical order.
    nquads.sort();

    // 5) Return the hash that results from passing the sorted, joined nquads
    // through the hash algorithm.
    info.hash = NormalizeHash.hashNQuads(self.name, nquads);
    callback(null, info.hash);
  });
};

// helper for modifying component during Hash First Degree Quads
Normalize.prototype.modifyFirstDegreeComponent = function(id, component) {
  if(component.type !== 'blank node') {
    return component;
  }
  component = _clone(component);
  component.value = (component.value === id ? '_:a' : '_:z');
  return component;
};

// 4.7) Hash Related Blank Node
Normalize.prototype.hashRelatedBlankNode = function(
  related, quad, issuer, position, callback) {
  var self = this;

  // 1) Set the identifier to use for related, preferring first the canonical
  // identifier for related if issued, second the identifier issued by issuer
  // if issued, and last, if necessary, the result of the Hash First Degree
  // Quads algorithm, passing related.
  var id;
  self.waterfall([
    function(callback) {
      if(self.canonicalIssuer.hasId(related)) {
        id = self.canonicalIssuer.getId(related);
        return callback();
      }
      if(issuer.hasId(related)) {
        id = issuer.getId(related);
        return callback();
      }
      self.hashFirstDegreeQuads(related, function(err, hash) {
        if(err) {
          return callback(err);
        }
        id = hash;
        callback();
      });
    }
  ], function(err) {
    if(err) {
      return callback(err);
    }

    // 2) Initialize a string input to the value of position.
    // Note: We use a hash object instead.
    var md = new NormalizeHash(self.name);
    md.update(position);

    // 3) If position is not g, append <, the value of the predicate in quad,
    // and > to input.
    if(position !== 'g') {
      md.update(self.getRelatedPredicate(quad));
    }

    // 4) Append identifier to input.
    md.update(id);

    // 5) Return the hash that results from passing input through the hash
    // algorithm.
    return callback(null, md.digest());
  });
};

// helper for getting a related predicate
Normalize.prototype.getRelatedPredicate = function(quad) {
  return '<' + quad.predicate.value + '>';
};

// 4.8) Hash N-Degree Quads
Normalize.prototype.hashNDegreeQuads = function(id, issuer, callback) {
  var self = this;

  // 1) Create a hash to related blank nodes map for storing hashes that
  // identify related blank nodes.
  // Note: 2) and 3) handled within `createHashToRelated`
  var hashToRelated;
  var md = new NormalizeHash(self.name);
  self.waterfall([
    function(callback) {
      self.createHashToRelated(id, issuer, function(err, result) {
        if(err) {
          return callback(err);
        }
        hashToRelated = result;
        callback();
      });
    },
    function(callback) {
      // 4) Create an empty string, data to hash.
      // Note: We created a hash object `md` above instead.

      // 5) For each related hash to blank node list mapping in hash to related
      // blank nodes map, sorted lexicographically by related hash:
      var hashes = Object.keys(hashToRelated).sort();
      self.forEach(hashes, function(hash, idx, callback) {
        // 5.1) Append the related hash to the data to hash.
        md.update(hash);

        // 5.2) Create a string chosen path.
        var chosenPath = '';

        // 5.3) Create an unset chosen issuer variable.
        var chosenIssuer;

        // 5.4) For each permutation of blank node list:
        var permutator = new Permutator(hashToRelated[hash]);
        self.whilst(
          function() { return permutator.hasNext(); },
          function(nextPermutation) {
          var permutation = permutator.next();

          // 5.4.1) Create a copy of issuer, issuer copy.
          var issuerCopy = issuer.clone();

          // 5.4.2) Create a string path.
          var path = '';

          // 5.4.3) Create a recursion list, to store blank node identifiers
          // that must be recursively processed by this algorithm.
          var recursionList = [];

          self.waterfall([
            function(callback) {
              // 5.4.4) For each related in permutation:
              self.forEach(permutation, function(related, idx, callback) {
                // 5.4.4.1) If a canonical identifier has been issued for
                // related, append it to path.
                if(self.canonicalIssuer.hasId(related)) {
                  path += self.canonicalIssuer.getId(related);
                } else {
                  // 5.4.4.2) Otherwise:
                  // 5.4.4.2.1) If issuer copy has not issued an identifier for
                  // related, append related to recursion list.
                  if(!issuerCopy.hasId(related)) {
                    recursionList.push(related);
                  }
                  // 5.4.4.2.2) Use the Issue Identifier algorithm, passing
                  // issuer copy and related and append the result to path.
                  path += issuerCopy.getId(related);
                }

                // 5.4.4.3) If chosen path is not empty and the length of path
                // is greater than or equal to the length of chosen path and
                // path is lexicographically greater than chosen path, then
                // skip to the next permutation.
                if(chosenPath.length !== 0 &&
                  path.length >= chosenPath.length && path > chosenPath) {
                  // FIXME: may cause inaccurate total depth calculation
                  return nextPermutation();
                }
                callback();
              }, callback);
            },
            function(callback) {
              // 5.4.5) For each related in recursion list:
              self.forEach(recursionList, function(related, idx, callback) {
                // 5.4.5.1) Set result to the result of recursively executing
                // the Hash N-Degree Quads algorithm, passing related for
                // identifier and issuer copy for path identifier issuer.
                self.hashNDegreeQuads(
                  related, issuerCopy, function(err, result) {
                  if(err) {
                    return callback(err);
                  }

                  // 5.4.5.2) Use the Issue Identifier algorithm, passing issuer
                  // copy and related and append the result to path.
                  path += issuerCopy.getId(related);

                  // 5.4.5.3) Append <, the hash in result, and > to path.
                  path += '<' + result.hash + '>';

                  // 5.4.5.4) Set issuer copy to the identifier issuer in
                  // result.
                  issuerCopy = result.issuer;

                  // 5.4.5.5) If chosen path is not empty and the length of path
                  // is greater than or equal to the length of chosen path and
                  // path is lexicographically greater than chosen path, then
                  // skip to the next permutation.
                  if(chosenPath.length !== 0 &&
                    path.length >= chosenPath.length && path > chosenPath) {
                    // FIXME: may cause inaccurate total depth calculation
                    return nextPermutation();
                  }
                  callback();
                });
              }, callback);
            },
            function(callback) {
              // 5.4.6) If chosen path is empty or path is lexicographically
              // less than chosen path, set chosen path to path and chosen
              // issuer to issuer copy.
              if(chosenPath.length === 0 || path < chosenPath) {
                chosenPath = path;
                chosenIssuer = issuerCopy;
              }
              callback();
            }
          ], nextPermutation);
        }, function(err) {
          if(err) {
            return callback(err);
          }

          // 5.5) Append chosen path to data to hash.
          md.update(chosenPath);

          // 5.6) Replace issuer, by reference, with chosen issuer.
          issuer = chosenIssuer;
          callback();
        });
      }, callback);
    }
  ], function(err) {
    // 6) Return issuer and the hash that results from passing data to hash
    // through the hash algorithm.
    callback(err, {hash: md.digest(), issuer: issuer});
  });
};

// helper for creating hash to related blank nodes map
Normalize.prototype.createHashToRelated = function(id, issuer, callback) {
  var self = this;

  // 1) Create a hash to related blank nodes map for storing hashes that
  // identify related blank nodes.
  var hashToRelated = {};

  // 2) Get a reference, quads, to the list of quads in the blank node to
  // quads map for the key identifier.
  var quads = self.blankNodeInfo[id].quads;

  // 3) For each quad in quads:
  self.forEach(quads, function(quad, idx, callback) {
    // 3.1) For each component in quad, if component is the subject, object,
    // and graph name and it is a blank node that is not identified by
    // identifier:
    self.forEach(quad, function(component, key, callback) {
      if(key === 'predicate' ||
        !(component.type === 'blank node' && component.value !== id)) {
        return callback();
      }
      // 3.1.1) Set hash to the result of the Hash Related Blank Node
      // algorithm, passing the blank node identifier for component as
      // related, quad, path identifier issuer as issuer, and position as
      // either s, o, or g based on whether component is a subject, object,
      // graph name, respectively.
      var related = component.value;
      var position = POSITIONS[key];
      self.hashRelatedBlankNode(
        related, quad, issuer, position, function(err, hash) {
        if(err) {
          return callback(err);
        }
        // 3.1.2) Add a mapping of hash to the blank node identifier for
        // component to hash to related blank nodes map, adding an entry as
        // necessary.
        if(hash in hashToRelated) {
          hashToRelated[hash].push(related);
        } else {
          hashToRelated[hash] = [related];
        }
        callback();
      });
    }, callback);
  }, function(err) {
    callback(err, hashToRelated);
  });
};

// helper that iterates over quad components (skips predicate)
Normalize.prototype.forEachComponent = function(quad, op) {
  for(var key in quad) {
    // skip `predicate`
    if(key === 'predicate') {
      continue;
    }
    op(quad[key], key, quad);
  }
};

return Normalize;

})(); // end of define URDNA2015

/////////////////////////////// DEFINE URGNA2012 //////////////////////////////

var URGNA2012 = (function() {

var Normalize = function(options) {
  URDNA2015.call(this, options);
  this.name = 'URGNA2012';
};
Normalize.prototype = new URDNA2015();

// helper for modifying component during Hash First Degree Quads
Normalize.prototype.modifyFirstDegreeComponent = function(id, component, key) {
  if(component.type !== 'blank node') {
    return component;
  }
  component = _clone(component);
  if(key === 'name') {
    component.value = '_:g';
  } else {
    component.value = (component.value === id ? '_:a' : '_:z');
  }
  return component;
};

// helper for getting a related predicate
Normalize.prototype.getRelatedPredicate = function(quad) {
  return quad.predicate.value;
};

// helper for creating hash to related blank nodes map
Normalize.prototype.createHashToRelated = function(id, issuer, callback) {
  var self = this;

  // 1) Create a hash to related blank nodes map for storing hashes that
  // identify related blank nodes.
  var hashToRelated = {};

  // 2) Get a reference, quads, to the list of quads in the blank node to
  // quads map for the key identifier.
  var quads = self.blankNodeInfo[id].quads;

  // 3) For each quad in quads:
  self.forEach(quads, function(quad, idx, callback) {
    // 3.1) If the quad's subject is a blank node that does not match
    // identifier, set hash to the result of the Hash Related Blank Node
    // algorithm, passing the blank node identifier for subject as related,
    // quad, path identifier issuer as issuer, and p as position.
    var position;
    var related;
    if(quad.subject.type === 'blank node' && quad.subject.value !== id) {
      related = quad.subject.value;
      position = 'p';
    } else if(quad.object.type === 'blank node' && quad.object.value !== id) {
      // 3.2) Otherwise, if quad's object is a blank node that does not match
      // identifier, to the result of the Hash Related Blank Node algorithm,
      // passing the blank node identifier for object as related, quad, path
      // identifier issuer as issuer, and r as position.
      related = quad.object.value;
      position = 'r';
    } else {
      // 3.3) Otherwise, continue to the next quad.
      return callback();
    }
    // 3.4) Add a mapping of hash to the blank node identifier for the
    // component that matched (subject or object) to hash to related blank
    // nodes map, adding an entry as necessary.
    self.hashRelatedBlankNode(
      related, quad, issuer, position, function(err, hash) {
      if(hash in hashToRelated) {
        hashToRelated[hash].push(related);
      } else {
        hashToRelated[hash] = [related];
      }
      callback();
    });
  }, function(err) {
    callback(err, hashToRelated);
  });
};

return Normalize;

})(); // end of define URGNA2012

/**
 * Recursively flattens the subjects in the given JSON-LD expanded input
 * into a node map.
 *
 * @param input the JSON-LD expanded input.
 * @param graphs a map of graph name to subject map.
 * @param graph the name of the current graph.
 * @param issuer the blank node identifier issuer.
 * @param name the name assigned to the current input if it is a bnode.
 * @param list the list to append to, null for none.
 */
function _createNodeMap(input, graphs, graph, issuer, name, list) {
  // recurse through array
  if(_isArray(input)) {
    for(var i = 0; i < input.length; ++i) {
      _createNodeMap(input[i], graphs, graph, issuer, undefined, list);
    }
    return;
  }

  // add non-object to list
  if(!_isObject(input)) {
    if(list) {
      list.push(input);
    }
    return;
  }

  // add values to list
  if(_isValue(input)) {
    if('@type' in input) {
      var type = input['@type'];
      // rename @type blank node
      if(type.indexOf('_:') === 0) {
        input['@type'] = type = issuer.getId(type);
      }
    }
    if(list) {
      list.push(input);
    }
    return;
  }

  // Note: At this point, input must be a subject.

  // spec requires @type to be named first, so assign names early
  if('@type' in input) {
    var types = input['@type'];
    for(var i = 0; i < types.length; ++i) {
      var type = types[i];
      if(type.indexOf('_:') === 0) {
        issuer.getId(type);
      }
    }
  }

  // get name for subject
  if(_isUndefined(name)) {
    name = _isBlankNode(input) ? issuer.getId(input['@id']) : input['@id'];
  }

  // add subject reference to list
  if(list) {
    list.push({'@id': name});
  }

  // create new subject or merge into existing one
  var subjects = graphs[graph];
  var subject = subjects[name] = subjects[name] || {};
  subject['@id'] = name;
  var properties = Object.keys(input).sort();
  for(var pi = 0; pi < properties.length; ++pi) {
    var property = properties[pi];

    // skip @id
    if(property === '@id') {
      continue;
    }

    // handle reverse properties
    if(property === '@reverse') {
      var referencedNode = {'@id': name};
      var reverseMap = input['@reverse'];
      for(var reverseProperty in reverseMap) {
        var items = reverseMap[reverseProperty];
        for(var ii = 0; ii < items.length; ++ii) {
          var item = items[ii];
          var itemName = item['@id'];
          if(_isBlankNode(item)) {
            itemName = issuer.getId(itemName);
          }
          _createNodeMap(item, graphs, graph, issuer, itemName);
          jsonld.addValue(
            subjects[itemName], reverseProperty, referencedNode,
            {propertyIsArray: true, allowDuplicate: false});
        }
      }
      continue;
    }

    // recurse into graph
    if(property === '@graph') {
      // add graph subjects map entry
      if(!(name in graphs)) {
        graphs[name] = {};
      }
      var g = (graph === '@merged') ? graph : name;
      _createNodeMap(input[property], graphs, g, issuer);
      continue;
    }

    // copy non-@type keywords
    if(property !== '@type' && _isKeyword(property)) {
      if(property === '@index' && property in subject &&
        (input[property] !== subject[property] ||
        input[property]['@id'] !== subject[property]['@id'])) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; conflicting @index property detected.',
          'jsonld.SyntaxError',
          {code: 'conflicting indexes', subject: subject});
      }
      subject[property] = input[property];
      continue;
    }

    // iterate over objects
    var objects = input[property];

    // if property is a bnode, assign it a new id
    if(property.indexOf('_:') === 0) {
      property = issuer.getId(property);
    }

    // ensure property is added for empty arrays
    if(objects.length === 0) {
      jsonld.addValue(subject, property, [], {propertyIsArray: true});
      continue;
    }
    for(var oi = 0; oi < objects.length; ++oi) {
      var o = objects[oi];

      if(property === '@type') {
        // rename @type blank nodes
        o = (o.indexOf('_:') === 0) ? issuer.getId(o) : o;
      }

      // handle embedded subject or subject reference
      if(_isSubject(o) || _isSubjectReference(o)) {
        // relabel blank node @id
        var id = _isBlankNode(o) ? issuer.getId(o['@id']) : o['@id'];

        // add reference and recurse
        jsonld.addValue(
          subject, property, {'@id': id},
          {propertyIsArray: true, allowDuplicate: false});
        _createNodeMap(o, graphs, graph, issuer, id);
      } else if(_isList(o)) {
        // handle @list
        var _list = [];
        _createNodeMap(o['@list'], graphs, graph, issuer, name, _list);
        o = {'@list': _list};
        jsonld.addValue(
          subject, property, o,
          {propertyIsArray: true, allowDuplicate: false});
      } else {
        // handle @value
        _createNodeMap(o, graphs, graph, issuer, name);
        jsonld.addValue(
          subject, property, o, {propertyIsArray: true, allowDuplicate: false});
      }
    }
  }
}

function _mergeNodeMaps(graphs) {
  // add all non-default graphs to default graph
  var defaultGraph = graphs['@default'];
  var graphNames = Object.keys(graphs).sort();
  for(var i = 0; i < graphNames.length; ++i) {
    var graphName = graphNames[i];
    if(graphName === '@default') {
      continue;
    }
    var nodeMap = graphs[graphName];
    var subject = defaultGraph[graphName];
    if(!subject) {
      defaultGraph[graphName] = subject = {
        '@id': graphName,
        '@graph': []
      };
    } else if(!('@graph' in subject)) {
      subject['@graph'] = [];
    }
    var graph = subject['@graph'];
    var ids = Object.keys(nodeMap).sort();
    for(var ii = 0; ii < ids.length; ++ii) {
      var node = nodeMap[ids[ii]];
      // only add full subjects
      if(!_isSubjectReference(node)) {
        graph.push(node);
      }
    }
  }
  return defaultGraph;
}

/**
 * Frames subjects according to the given frame.
 *
 * @param state the current framing state.
 * @param subjects the subjects to filter.
 * @param frame the frame.
 * @param parent the parent subject or top-level array.
 * @param property the parent property, initialized to null.
 */
function _frame(state, subjects, frame, parent, property) {
  // validate the frame
  _validateFrame(frame);
  frame = frame[0];

  // get flags for current frame
  var options = state.options;
  var flags = {
    embed: _getFrameFlag(frame, options, 'embed'),
    explicit: _getFrameFlag(frame, options, 'explicit'),
    requireAll: _getFrameFlag(frame, options, 'requireAll')
  };

  // filter out subjects that match the frame
  var matches = _filterSubjects(state, subjects, frame, flags);

  // add matches to output
  var ids = Object.keys(matches).sort();
  for(var idx = 0; idx < ids.length; ++idx) {
    var id = ids[idx];
    var subject = matches[id];

    if(flags.embed === '@link' && id in state.link) {
      // TODO: may want to also match an existing linked subject against
      // the current frame ... so different frames could produce different
      // subjects that are only shared in-memory when the frames are the same

      // add existing linked subject
      _addFrameOutput(parent, property, state.link[id]);
      continue;
    }

    /* Note: In order to treat each top-level match as a compartmentalized
    result, clear the unique embedded subjects map when the property is null,
    which only occurs at the top-level. */
    if(property === null) {
      state.uniqueEmbeds = {};
    }

    // start output for subject
    var output = {};
    output['@id'] = id;
    state.link[id] = output;

    // if embed is @never or if a circular reference would be created by an
    // embed, the subject cannot be embedded, just add the reference;
    // note that a circular reference won't occur when the embed flag is
    // `@link` as the above check will short-circuit before reaching this point
    if(flags.embed === '@never' ||
      _createsCircularReference(subject, state.subjectStack)) {
      _addFrameOutput(parent, property, output);
      continue;
    }

    // if only the last match should be embedded
    if(flags.embed === '@last') {
      // remove any existing embed
      if(id in state.uniqueEmbeds) {
        _removeEmbed(state, id);
      }
      state.uniqueEmbeds[id] = {parent: parent, property: property};
    }

    // push matching subject onto stack to enable circular embed checks
    state.subjectStack.push(subject);

    // iterate over subject properties
    var props = Object.keys(subject).sort();
    for(var i = 0; i < props.length; i++) {
      var prop = props[i];

      // copy keywords to output
      if(_isKeyword(prop)) {
        output[prop] = _clone(subject[prop]);
        continue;
      }

      // explicit is on and property isn't in the frame, skip processing
      if(flags.explicit && !(prop in frame)) {
        continue;
      }

      // add objects
      var objects = subject[prop];
      for(var oi = 0; oi < objects.length; ++oi) {
        var o = objects[oi];

        // recurse into list
        if(_isList(o)) {
          // add empty list
          var list = {'@list': []};
          _addFrameOutput(output, prop, list);

          // add list objects
          var src = o['@list'];
          for(var n in src) {
            o = src[n];
            if(_isSubjectReference(o)) {
              var subframe = (prop in frame ?
                frame[prop][0]['@list'] : _createImplicitFrame(flags));
              // recurse into subject reference
              _frame(state, [o['@id']], subframe, list, '@list');
            } else {
              // include other values automatically
              _addFrameOutput(list, '@list', _clone(o));
            }
          }
          continue;
        }

        if(_isSubjectReference(o)) {
          // recurse into subject reference
          var subframe = (prop in frame ?
            frame[prop] : _createImplicitFrame(flags));
          _frame(state, [o['@id']], subframe, output, prop);
        } else {
          // include other values automatically
          _addFrameOutput(output, prop, _clone(o));
        }
      }
    }

    // handle defaults
    var props = Object.keys(frame).sort();
    for(var i = 0; i < props.length; ++i) {
      var prop = props[i];

      // skip keywords
      if(_isKeyword(prop)) {
        continue;
      }

      // if omit default is off, then include default values for properties
      // that appear in the next frame but are not in the matching subject
      var next = frame[prop][0];
      var omitDefaultOn = _getFrameFlag(next, options, 'omitDefault');
      if(!omitDefaultOn && !(prop in output)) {
        var preserve = '@null';
        if('@default' in next) {
          preserve = _clone(next['@default']);
        }
        if(!_isArray(preserve)) {
          preserve = [preserve];
        }
        output[prop] = [{'@preserve': preserve}];
      }
    }

    // add output to parent
    _addFrameOutput(parent, property, output);

    // pop matching subject from circular ref-checking stack
    state.subjectStack.pop();
  }
}

/**
 * Creates an implicit frame when recursing through subject matches. If
 * a frame doesn't have an explicit frame for a particular property, then
 * a wildcard child frame will be created that uses the same flags that the
 * parent frame used.
 *
 * @param flags the current framing flags.
 *
 * @return the implicit frame.
 */
function _createImplicitFrame(flags) {
  var frame = {};
  for(var key in flags) {
    if(flags[key] !== undefined) {
      frame['@' + key] = [flags[key]];
    }
  }
  return [frame];
}

/**
 * Checks the current subject stack to see if embedding the given subject
 * would cause a circular reference.
 *
 * @param subjectToEmbed the subject to embed.
 * @param subjectStack the current stack of subjects.
 *
 * @return true if a circular reference would be created, false if not.
 */
function _createsCircularReference(subjectToEmbed, subjectStack) {
  for(var i = subjectStack.length - 1; i >= 0; --i) {
    if(subjectStack[i]['@id'] === subjectToEmbed['@id']) {
      return true;
    }
  }
  return false;
}

/**
 * Gets the frame flag value for the given flag name.
 *
 * @param frame the frame.
 * @param options the framing options.
 * @param name the flag name.
 *
 * @return the flag value.
 */
function _getFrameFlag(frame, options, name) {
  var flag = '@' + name;
  var rval = (flag in frame ? frame[flag][0] : options[name]);
  if(name === 'embed') {
    // default is "@last"
    // backwards-compatibility support for "embed" maps:
    // true => "@last"
    // false => "@never"
    if(rval === true) {
      rval = '@last';
    } else if(rval === false) {
      rval = '@never';
    } else if(rval !== '@always' && rval !== '@never' && rval !== '@link') {
      rval = '@last';
    }
  }
  return rval;
}

/**
 * Validates a JSON-LD frame, throwing an exception if the frame is invalid.
 *
 * @param frame the frame to validate.
 */
function _validateFrame(frame) {
  if(!_isArray(frame) || frame.length !== 1 || !_isObject(frame[0])) {
    throw new JsonLdError(
      'Invalid JSON-LD syntax; a JSON-LD frame must be a single object.',
      'jsonld.SyntaxError', {frame: frame});
  }
}

/**
 * Returns a map of all of the subjects that match a parsed frame.
 *
 * @param state the current framing state.
 * @param subjects the set of subjects to filter.
 * @param frame the parsed frame.
 * @param flags the frame flags.
 *
 * @return all of the matched subjects.
 */
function _filterSubjects(state, subjects, frame, flags) {
  // filter subjects in @id order
  var rval = {};
  for(var i = 0; i < subjects.length; ++i) {
    var id = subjects[i];
    var subject = state.subjects[id];
    if(_filterSubject(subject, frame, flags)) {
      rval[id] = subject;
    }
  }
  return rval;
}

/**
 * Returns true if the given subject matches the given frame.
 *
 * @param subject the subject to check.
 * @param frame the frame to check.
 * @param flags the frame flags.
 *
 * @return true if the subject matches, false if not.
 */
function _filterSubject(subject, frame, flags) {
  // check @type (object value means 'any' type, fall through to ducktyping)
  if('@type' in frame &&
    !(frame['@type'].length === 1 && _isObject(frame['@type'][0]))) {
    var types = frame['@type'];
    for(var i = 0; i < types.length; ++i) {
      // any matching @type is a match
      if(jsonld.hasValue(subject, '@type', types[i])) {
        return true;
      }
    }
    return false;
  }

  // check ducktype
  var wildcard = true;
  var matchesSome = false;
  for(var key in frame) {
    if(_isKeyword(key)) {
      // skip non-@id and non-@type
      if(key !== '@id' && key !== '@type') {
        continue;
      }
      wildcard = false;

      // check @id for a specific @id value
      if(key === '@id' && _isString(frame[key])) {
        if(subject[key] !== frame[key]) {
          return false;
        }
        matchesSome = true;
        continue;
      }
    }

    wildcard = false;

    if(key in subject) {
      // frame[key] === [] means do not match if property is present
      if(_isArray(frame[key]) && frame[key].length === 0 &&
        subject[key] !== undefined) {
        return false;
      }
      matchesSome = true;
      continue;
    }

    // all properties must match to be a duck unless a @default is specified
    var hasDefault = (_isArray(frame[key]) && _isObject(frame[key][0]) &&
      '@default' in frame[key][0]);
    if(flags.requireAll && !hasDefault) {
      return false;
    }
  }

  // return true if wildcard or subject matches some properties
  return wildcard || matchesSome;
}

/**
 * Removes an existing embed.
 *
 * @param state the current framing state.
 * @param id the @id of the embed to remove.
 */
function _removeEmbed(state, id) {
  // get existing embed
  var embeds = state.uniqueEmbeds;
  var embed = embeds[id];
  var parent = embed.parent;
  var property = embed.property;

  // create reference to replace embed
  var subject = {'@id': id};

  // remove existing embed
  if(_isArray(parent)) {
    // replace subject with reference
    for(var i = 0; i < parent.length; ++i) {
      if(jsonld.compareValues(parent[i], subject)) {
        parent[i] = subject;
        break;
      }
    }
  } else {
    // replace subject with reference
    var useArray = _isArray(parent[property]);
    jsonld.removeValue(parent, property, subject, {propertyIsArray: useArray});
    jsonld.addValue(parent, property, subject, {propertyIsArray: useArray});
  }

  // recursively remove dependent dangling embeds
  var removeDependents = function(id) {
    // get embed keys as a separate array to enable deleting keys in map
    var ids = Object.keys(embeds);
    for(var i = 0; i < ids.length; ++i) {
      var next = ids[i];
      if(next in embeds && _isObject(embeds[next].parent) &&
        embeds[next].parent['@id'] === id) {
        delete embeds[next];
        removeDependents(next);
      }
    }
  };
  removeDependents(id);
}

/**
 * Adds framing output to the given parent.
 *
 * @param parent the parent to add to.
 * @param property the parent property.
 * @param output the output to add.
 */
function _addFrameOutput(parent, property, output) {
  if(_isObject(parent)) {
    jsonld.addValue(parent, property, output, {propertyIsArray: true});
  } else {
    parent.push(output);
  }
}

/**
 * Removes the @preserve keywords as the last step of the framing algorithm.
 *
 * @param ctx the active context used to compact the input.
 * @param input the framed, compacted output.
 * @param options the compaction options used.
 *
 * @return the resulting output.
 */
function _removePreserve(ctx, input, options) {
  // recurse through arrays
  if(_isArray(input)) {
    var output = [];
    for(var i = 0; i < input.length; ++i) {
      var result = _removePreserve(ctx, input[i], options);
      // drop nulls from arrays
      if(result !== null) {
        output.push(result);
      }
    }
    input = output;
  } else if(_isObject(input)) {
    // remove @preserve
    if('@preserve' in input) {
      if(input['@preserve'] === '@null') {
        return null;
      }
      return input['@preserve'];
    }

    // skip @values
    if(_isValue(input)) {
      return input;
    }

    // recurse through @lists
    if(_isList(input)) {
      input['@list'] = _removePreserve(ctx, input['@list'], options);
      return input;
    }

    // handle in-memory linked nodes
    var idAlias = _compactIri(ctx, '@id');
    if(idAlias in input) {
      var id = input[idAlias];
      if(id in options.link) {
        var idx = options.link[id].indexOf(input);
        if(idx === -1) {
          // prevent circular visitation
          options.link[id].push(input);
        } else {
          // already visited
          return options.link[id][idx];
        }
      } else {
        // prevent circular visitation
        options.link[id] = [input];
      }
    }

    // recurse through properties
    for(var prop in input) {
      var result = _removePreserve(ctx, input[prop], options);
      var container = jsonld.getContextValue(ctx, prop, '@container');
      if(options.compactArrays && _isArray(result) && result.length === 1 &&
        container === null) {
        result = result[0];
      }
      input[prop] = result;
    }
  }
  return input;
}

/**
 * Compares two strings first based on length and then lexicographically.
 *
 * @param a the first string.
 * @param b the second string.
 *
 * @return -1 if a < b, 1 if a > b, 0 if a == b.
 */
function _compareShortestLeast(a, b) {
  if(a.length < b.length) {
    return -1;
  }
  if(b.length < a.length) {
    return 1;
  }
  if(a === b) {
    return 0;
  }
  return (a < b) ? -1 : 1;
}

/**
 * Picks the preferred compaction term from the given inverse context entry.
 *
 * @param activeCtx the active context.
 * @param iri the IRI to pick the term for.
 * @param value the value to pick the term for.
 * @param containers the preferred containers.
 * @param typeOrLanguage either '@type' or '@language'.
 * @param typeOrLanguageValue the preferred value for '@type' or '@language'.
 *
 * @return the preferred term.
 */
function _selectTerm(
  activeCtx, iri, value, containers, typeOrLanguage, typeOrLanguageValue) {
  if(typeOrLanguageValue === null) {
    typeOrLanguageValue = '@null';
  }

  // preferences for the value of @type or @language
  var prefs = [];

  // determine prefs for @id based on whether or not value compacts to a term
  if((typeOrLanguageValue === '@id' || typeOrLanguageValue === '@reverse') &&
    _isSubjectReference(value)) {
    // prefer @reverse first
    if(typeOrLanguageValue === '@reverse') {
      prefs.push('@reverse');
    }
    // try to compact value to a term
    var term = _compactIri(activeCtx, value['@id'], null, {vocab: true});
    if(term in activeCtx.mappings &&
      activeCtx.mappings[term] &&
      activeCtx.mappings[term]['@id'] === value['@id']) {
      // prefer @vocab
      prefs.push.apply(prefs, ['@vocab', '@id']);
    } else {
      // prefer @id
      prefs.push.apply(prefs, ['@id', '@vocab']);
    }
  } else {
    prefs.push(typeOrLanguageValue);
  }
  prefs.push('@none');

  var containerMap = activeCtx.inverse[iri];
  for(var ci = 0; ci < containers.length; ++ci) {
    // if container not available in the map, continue
    var container = containers[ci];
    if(!(container in containerMap)) {
      continue;
    }

    var typeOrLanguageValueMap = containerMap[container][typeOrLanguage];
    for(var pi = 0; pi < prefs.length; ++pi) {
      // if type/language option not available in the map, continue
      var pref = prefs[pi];
      if(!(pref in typeOrLanguageValueMap)) {
        continue;
      }

      // select term
      return typeOrLanguageValueMap[pref];
    }
  }

  return null;
}

/**
 * Compacts an IRI or keyword into a term or prefix if it can be. If the
 * IRI has an associated value it may be passed.
 *
 * @param activeCtx the active context to use.
 * @param iri the IRI to compact.
 * @param value the value to check or null.
 * @param relativeTo options for how to compact IRIs:
 *          vocab: true to split after @vocab, false not to.
 * @param reverse true if a reverse property is being compacted, false if not.
 *
 * @return the compacted term, prefix, keyword alias, or the original IRI.
 */
function _compactIri(activeCtx, iri, value, relativeTo, reverse) {
  // can't compact null
  if(iri === null) {
    return iri;
  }

  // default value and parent to null
  if(_isUndefined(value)) {
    value = null;
  }
  // default reverse to false
  if(_isUndefined(reverse)) {
    reverse = false;
  }
  relativeTo = relativeTo || {};

  var inverseCtx = activeCtx.getInverse();

  // if term is a keyword, it can only be compacted to a simple alias
  if(_isKeyword(iri)) {
    if(iri in inverseCtx) {
      return inverseCtx[iri]['@none']['@type']['@none'];
    }
    return iri;
  }

  // use inverse context to pick a term if iri is relative to vocab
  if(relativeTo.vocab && iri in inverseCtx) {
    var defaultLanguage = activeCtx['@language'] || '@none';

    // prefer @index if available in value
    var containers = [];
    if(_isObject(value) && '@index' in value) {
      containers.push('@index');
    }

    // defaults for term selection based on type/language
    var typeOrLanguage = '@language';
    var typeOrLanguageValue = '@null';

    if(reverse) {
      typeOrLanguage = '@type';
      typeOrLanguageValue = '@reverse';
      containers.push('@set');
    } else if(_isList(value)) {
      // choose the most specific term that works for all elements in @list
      // only select @list containers if @index is NOT in value
      if(!('@index' in value)) {
        containers.push('@list');
      }
      var list = value['@list'];
      var commonLanguage = (list.length === 0) ? defaultLanguage : null;
      var commonType = null;
      for(var i = 0; i < list.length; ++i) {
        var item = list[i];
        var itemLanguage = '@none';
        var itemType = '@none';
        if(_isValue(item)) {
          if('@language' in item) {
            itemLanguage = item['@language'];
          } else if('@type' in item) {
            itemType = item['@type'];
          } else {
            // plain literal
            itemLanguage = '@null';
          }
        } else {
          itemType = '@id';
        }
        if(commonLanguage === null) {
          commonLanguage = itemLanguage;
        } else if(itemLanguage !== commonLanguage && _isValue(item)) {
          commonLanguage = '@none';
        }
        if(commonType === null) {
          commonType = itemType;
        } else if(itemType !== commonType) {
          commonType = '@none';
        }
        // there are different languages and types in the list, so choose
        // the most generic term, no need to keep iterating the list
        if(commonLanguage === '@none' && commonType === '@none') {
          break;
        }
      }
      commonLanguage = commonLanguage || '@none';
      commonType = commonType || '@none';
      if(commonType !== '@none') {
        typeOrLanguage = '@type';
        typeOrLanguageValue = commonType;
      } else {
        typeOrLanguageValue = commonLanguage;
      }
    } else {
      if(_isValue(value)) {
        if('@language' in value && !('@index' in value)) {
          containers.push('@language');
          typeOrLanguageValue = value['@language'];
        } else if('@type' in value) {
          typeOrLanguage = '@type';
          typeOrLanguageValue = value['@type'];
        }
      } else {
        typeOrLanguage = '@type';
        typeOrLanguageValue = '@id';
      }
      containers.push('@set');
    }

    // do term selection
    containers.push('@none');
    var term = _selectTerm(
      activeCtx, iri, value, containers, typeOrLanguage, typeOrLanguageValue);
    if(term !== null) {
      return term;
    }
  }

  // no term match, use @vocab if available
  if(relativeTo.vocab) {
    if('@vocab' in activeCtx) {
      // determine if vocab is a prefix of the iri
      var vocab = activeCtx['@vocab'];
      if(iri.indexOf(vocab) === 0 && iri !== vocab) {
        // use suffix as relative iri if it is not a term in the active context
        var suffix = iri.substr(vocab.length);
        if(!(suffix in activeCtx.mappings)) {
          return suffix;
        }
      }
    }
  }

  // no term or @vocab match, check for possible CURIEs
  var choice = null;
  var idx = 0;
  var partialMatches = [];
  var iriMap = activeCtx.fastCurieMap;
  // check for partial matches of against `iri`, which means look until
  // iri.length - 1, not full length
  var maxPartialLength = iri.length - 1;
  for(; idx < maxPartialLength && iri[idx] in iriMap; ++idx) {
    iriMap = iriMap[iri[idx]];
    if('' in iriMap) {
      partialMatches.push(iriMap[''][0]);
    }
  }
  // check partial matches in reverse order to prefer longest ones first
  for(var i = partialMatches.length - 1; i >= 0; --i) {
    var entry = partialMatches[i];
    var terms = entry.terms;
    for(var ti = 0; ti < terms.length; ++ti) {
      // a CURIE is usable if:
      // 1. it has no mapping, OR
      // 2. value is null, which means we're not compacting an @value, AND
      //   the mapping matches the IRI
      var curie = terms[ti] + ':' + iri.substr(entry.iri.length);
      var isUsableCurie = (!(curie in activeCtx.mappings) ||
        (value === null && activeCtx.mappings[curie]['@id'] === iri));

      // select curie if it is shorter or the same length but lexicographically
      // less than the current choice
      if(isUsableCurie && (choice === null ||
        _compareShortestLeast(curie, choice) < 0)) {
        choice = curie;
      }
    }
  }

  // return chosen curie
  if(choice !== null) {
    return choice;
  }

  // compact IRI relative to base
  if(!relativeTo.vocab) {
    return _removeBase(activeCtx['@base'], iri);
  }

  // return IRI as is
  return iri;
}

/**
 * Performs value compaction on an object with '@value' or '@id' as the only
 * property.
 *
 * @param activeCtx the active context.
 * @param activeProperty the active property that points to the value.
 * @param value the value to compact.
 *
 * @return the compaction result.
 */
function _compactValue(activeCtx, activeProperty, value) {
  // value is a @value
  if(_isValue(value)) {
    // get context rules
    var type = jsonld.getContextValue(activeCtx, activeProperty, '@type');
    var language = jsonld.getContextValue(
      activeCtx, activeProperty, '@language');
    var container = jsonld.getContextValue(
      activeCtx, activeProperty, '@container');

    // whether or not the value has an @index that must be preserved
    var preserveIndex = (('@index' in value) &&
      container !== '@index');

    // if there's no @index to preserve ...
    if(!preserveIndex) {
      // matching @type or @language specified in context, compact value
      if(value['@type'] === type || value['@language'] === language) {
        return value['@value'];
      }
    }

    // return just the value of @value if all are true:
    // 1. @value is the only key or @index isn't being preserved
    // 2. there is no default language or @value is not a string or
    //   the key has a mapping with a null @language
    var keyCount = Object.keys(value).length;
    var isValueOnlyKey = (keyCount === 1 ||
      (keyCount === 2 && ('@index' in value) && !preserveIndex));
    var hasDefaultLanguage = ('@language' in activeCtx);
    var isValueString = _isString(value['@value']);
    var hasNullMapping = (activeCtx.mappings[activeProperty] &&
      activeCtx.mappings[activeProperty]['@language'] === null);
    if(isValueOnlyKey &&
      (!hasDefaultLanguage || !isValueString || hasNullMapping)) {
      return value['@value'];
    }

    var rval = {};

    // preserve @index
    if(preserveIndex) {
      rval[_compactIri(activeCtx, '@index')] = value['@index'];
    }

    if('@type' in value) {
      // compact @type IRI
      rval[_compactIri(activeCtx, '@type')] = _compactIri(
        activeCtx, value['@type'], null, {vocab: true});
    } else if('@language' in value) {
      // alias @language
      rval[_compactIri(activeCtx, '@language')] = value['@language'];
    }

    // alias @value
    rval[_compactIri(activeCtx, '@value')] = value['@value'];

    return rval;
  }

  // value is a subject reference
  var expandedProperty = _expandIri(activeCtx, activeProperty, {vocab: true});
  var type = jsonld.getContextValue(activeCtx, activeProperty, '@type');
  var compacted = _compactIri(
    activeCtx, value['@id'], null, {vocab: type === '@vocab'});

  // compact to scalar
  if(type === '@id' || type === '@vocab' || expandedProperty === '@graph') {
    return compacted;
  }

  var rval = {};
  rval[_compactIri(activeCtx, '@id')] = compacted;
  return rval;
}

/**
 * Creates a term definition during context processing.
 *
 * @param activeCtx the current active context.
 * @param localCtx the local context being processed.
 * @param term the term in the local context to define the mapping for.
 * @param defined a map of defining/defined keys to detect cycles and prevent
 *          double definitions.
 */
function _createTermDefinition(activeCtx, localCtx, term, defined) {
  if(term in defined) {
    // term already defined
    if(defined[term]) {
      return;
    }
    // cycle detected
    throw new JsonLdError(
      'Cyclical context definition detected.',
      'jsonld.CyclicalContext',
      {code: 'cyclic IRI mapping', context: localCtx, term: term});
  }

  // now defining term
  defined[term] = false;

  if(_isKeyword(term)) {
    throw new JsonLdError(
      'Invalid JSON-LD syntax; keywords cannot be overridden.',
      'jsonld.SyntaxError',
      {code: 'keyword redefinition', context: localCtx, term: term});
  }

  if(term === '') {
    throw new JsonLdError(
      'Invalid JSON-LD syntax; a term cannot be an empty string.',
      'jsonld.SyntaxError',
      {code: 'invalid term definition', context: localCtx});
  }

  // remove old mapping
  if(activeCtx.mappings[term]) {
    delete activeCtx.mappings[term];
  }

  // get context term value
  var value = localCtx[term];

  // clear context entry
  if(value === null || (_isObject(value) && value['@id'] === null)) {
    activeCtx.mappings[term] = null;
    defined[term] = true;
    return;
  }

  // convert short-hand value to object w/@id
  if(_isString(value)) {
    value = {'@id': value};
  }

  if(!_isObject(value)) {
    throw new JsonLdError(
      'Invalid JSON-LD syntax; @context property values must be ' +
      'strings or objects.',
      'jsonld.SyntaxError',
      {code: 'invalid term definition', context: localCtx});
  }

  // create new mapping
  var mapping = activeCtx.mappings[term] = {};
  mapping.reverse = false;

  if('@reverse' in value) {
    if('@id' in value) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; a @reverse term definition must not ' +
        'contain @id.', 'jsonld.SyntaxError',
        {code: 'invalid reverse property', context: localCtx});
    }
    var reverse = value['@reverse'];
    if(!_isString(reverse)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; a @context @reverse value must be a string.',
        'jsonld.SyntaxError', {code: 'invalid IRI mapping', context: localCtx});
    }

    // expand and add @id mapping
    var id = _expandIri(
      activeCtx, reverse, {vocab: true, base: false}, localCtx, defined);
    if(!_isAbsoluteIri(id)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; a @context @reverse value must be an ' +
        'absolute IRI or a blank node identifier.',
        'jsonld.SyntaxError', {code: 'invalid IRI mapping', context: localCtx});
    }
    mapping['@id'] = id;
    mapping.reverse = true;
  } else if('@id' in value) {
    var id = value['@id'];
    if(!_isString(id)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; a @context @id value must be an array ' +
        'of strings or a string.',
        'jsonld.SyntaxError', {code: 'invalid IRI mapping', context: localCtx});
    }
    if(id !== term) {
      // expand and add @id mapping
      id = _expandIri(
        activeCtx, id, {vocab: true, base: false}, localCtx, defined);
      if(!_isAbsoluteIri(id) && !_isKeyword(id)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; a @context @id value must be an ' +
          'absolute IRI, a blank node identifier, or a keyword.',
          'jsonld.SyntaxError',
          {code: 'invalid IRI mapping', context: localCtx});
      }
      mapping['@id'] = id;
    }
  }

  // always compute whether term has a colon as an optimization for
  // _compactIri
  var colon = term.indexOf(':');
  mapping._termHasColon = (colon !== -1);

  if(!('@id' in mapping)) {
    // see if the term has a prefix
    if(mapping._termHasColon) {
      var prefix = term.substr(0, colon);
      if(prefix in localCtx) {
        // define parent prefix
        _createTermDefinition(activeCtx, localCtx, prefix, defined);
      }

      if(activeCtx.mappings[prefix]) {
        // set @id based on prefix parent
        var suffix = term.substr(colon + 1);
        mapping['@id'] = activeCtx.mappings[prefix]['@id'] + suffix;
      } else {
        // term is an absolute IRI
        mapping['@id'] = term;
      }
    } else {
      // non-IRIs *must* define @ids if @vocab is not available
      if(!('@vocab' in activeCtx)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; @context terms must define an @id.',
          'jsonld.SyntaxError',
          {code: 'invalid IRI mapping', context: localCtx, term: term});
      }
      // prepend vocab to term
      mapping['@id'] = activeCtx['@vocab'] + term;
    }
  }

  // IRI mapping now defined
  defined[term] = true;

  if('@type' in value) {
    var type = value['@type'];
    if(!_isString(type)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; an @context @type values must be a string.',
        'jsonld.SyntaxError',
        {code: 'invalid type mapping', context: localCtx});
    }

    if(type !== '@id' && type !== '@vocab') {
      // expand @type to full IRI
      type = _expandIri(
        activeCtx, type, {vocab: true, base: false}, localCtx, defined);
      if(!_isAbsoluteIri(type)) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; an @context @type value must be an ' +
          'absolute IRI.',
          'jsonld.SyntaxError',
          {code: 'invalid type mapping', context: localCtx});
      }
      if(type.indexOf('_:') === 0) {
        throw new JsonLdError(
          'Invalid JSON-LD syntax; an @context @type values must be an IRI, ' +
          'not a blank node identifier.',
          'jsonld.SyntaxError',
          {code: 'invalid type mapping', context: localCtx});
      }
    }

    // add @type to mapping
    mapping['@type'] = type;
  }

  if('@container' in value) {
    var container = value['@container'];
    if(container !== '@list' && container !== '@set' &&
      container !== '@index' && container !== '@language') {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context @container value must be ' +
        'one of the following: @list, @set, @index, or @language.',
        'jsonld.SyntaxError',
        {code: 'invalid container mapping', context: localCtx});
    }
    if(mapping.reverse && container !== '@index' && container !== '@set' &&
      container !== null) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context @container value for a @reverse ' +
        'type definition must be @index or @set.', 'jsonld.SyntaxError',
        {code: 'invalid reverse property', context: localCtx});
    }

    // add @container to mapping
    mapping['@container'] = container;
  }

  if('@language' in value && !('@type' in value)) {
    var language = value['@language'];
    if(language !== null && !_isString(language)) {
      throw new JsonLdError(
        'Invalid JSON-LD syntax; @context @language value must be ' +
        'a string or null.', 'jsonld.SyntaxError',
        {code: 'invalid language mapping', context: localCtx});
    }

    // add @language to mapping
    if(language !== null) {
      language = language.toLowerCase();
    }
    mapping['@language'] = language;
  }

  // disallow aliasing @context and @preserve
  var id = mapping['@id'];
  if(id === '@context' || id === '@preserve') {
    throw new JsonLdError(
      'Invalid JSON-LD syntax; @context and @preserve cannot be aliased.',
      'jsonld.SyntaxError', {code: 'invalid keyword alias', context: localCtx});
  }
}

/**
 * Expands a string to a full IRI. The string may be a term, a prefix, a
 * relative IRI, or an absolute IRI. The associated absolute IRI will be
 * returned.
 *
 * @param activeCtx the current active context.
 * @param value the string to expand.
 * @param relativeTo options for how to resolve relative IRIs:
 *          base: true to resolve against the base IRI, false not to.
 *          vocab: true to concatenate after @vocab, false not to.
 * @param localCtx the local context being processed (only given if called
 *          during context processing).
 * @param defined a map for tracking cycles in context definitions (only given
 *          if called during context processing).
 *
 * @return the expanded value.
 */
function _expandIri(activeCtx, value, relativeTo, localCtx, defined) {
  // already expanded
  if(value === null || _isKeyword(value)) {
    return value;
  }

  // ensure value is interpreted as a string
  value = String(value);

  // define term dependency if not defined
  if(localCtx && value in localCtx && defined[value] !== true) {
    _createTermDefinition(activeCtx, localCtx, value, defined);
  }

  relativeTo = relativeTo || {};
  if(relativeTo.vocab) {
    var mapping = activeCtx.mappings[value];

    // value is explicitly ignored with a null mapping
    if(mapping === null) {
      return null;
    }

    if(mapping) {
      // value is a term
      return mapping['@id'];
    }
  }

  // split value into prefix:suffix
  var colon = value.indexOf(':');
  if(colon !== -1) {
    var prefix = value.substr(0, colon);
    var suffix = value.substr(colon + 1);

    // do not expand blank nodes (prefix of '_') or already-absolute
    // IRIs (suffix of '//')
    if(prefix === '_' || suffix.indexOf('//') === 0) {
      return value;
    }

    // prefix dependency not defined, define it
    if(localCtx && prefix in localCtx) {
      _createTermDefinition(activeCtx, localCtx, prefix, defined);
    }

    // use mapping if prefix is defined
    var mapping = activeCtx.mappings[prefix];
    if(mapping) {
      return mapping['@id'] + suffix;
    }

    // already absolute IRI
    return value;
  }

  // prepend vocab
  if(relativeTo.vocab && '@vocab' in activeCtx) {
    return activeCtx['@vocab'] + value;
  }

  // prepend base
  var rval = value;
  if(relativeTo.base) {
    rval = jsonld.prependBase(activeCtx['@base'], rval);
  }

  return rval;
}

function _prependBase(base, iri) {
  // skip IRI processing
  if(base === null) {
    return iri;
  }
  // already an absolute IRI
  if(iri.indexOf(':') !== -1) {
    return iri;
  }

  // parse base if it is a string
  if(_isString(base)) {
    base = jsonld.url.parse(base || '');
  }

  // parse given IRI
  var rel = jsonld.url.parse(iri);

  // per RFC3986 5.2.2
  var transform = {
    protocol: base.protocol || ''
  };

  if(rel.authority !== null) {
    transform.authority = rel.authority;
    transform.path = rel.path;
    transform.query = rel.query;
  } else {
    transform.authority = base.authority;

    if(rel.path === '') {
      transform.path = base.path;
      if(rel.query !== null) {
        transform.query = rel.query;
      } else {
        transform.query = base.query;
      }
    } else {
      if(rel.path.indexOf('/') === 0) {
        // IRI represents an absolute path
        transform.path = rel.path;
      } else {
        // merge paths
        var path = base.path;

        // append relative path to the end of the last directory from base
        if(rel.path !== '') {
          path = path.substr(0, path.lastIndexOf('/') + 1);
          if(path.length > 0 && path.substr(-1) !== '/') {
            path += '/';
          }
          path += rel.path;
        }

        transform.path = path;
      }
      transform.query = rel.query;
    }
  }

  // remove slashes and dots in path
  transform.path = _removeDotSegments(transform.path, !!transform.authority);

  // construct URL
  var rval = transform.protocol;
  if(transform.authority !== null) {
    rval += '//' + transform.authority;
  }
  rval += transform.path;
  if(transform.query !== null) {
    rval += '?' + transform.query;
  }
  if(rel.fragment !== null) {
    rval += '#' + rel.fragment;
  }

  // handle empty base
  if(rval === '') {
    rval = './';
  }

  return rval;
}

/**
 * Removes a base IRI from the given absolute IRI.
 *
 * @param base the base IRI.
 * @param iri the absolute IRI.
 *
 * @return the relative IRI if relative to base, otherwise the absolute IRI.
 */
function _removeBase(base, iri) {
  // skip IRI processing
  if(base === null) {
    return iri;
  }

  if(_isString(base)) {
    base = jsonld.url.parse(base || '');
  }

  // establish base root
  var root = '';
  if(base.href !== '') {
    root += (base.protocol || '') + '//' + (base.authority || '');
  } else if(iri.indexOf('//')) {
    // support network-path reference with empty base
    root += '//';
  }

  // IRI not relative to base
  if(iri.indexOf(root) !== 0) {
    return iri;
  }

  // remove root from IRI and parse remainder
  var rel = jsonld.url.parse(iri.substr(root.length));

  // remove path segments that match (do not remove last segment unless there
  // is a hash or query)
  var baseSegments = base.normalizedPath.split('/');
  var iriSegments = rel.normalizedPath.split('/');
  var last = (rel.fragment || rel.query) ? 0 : 1;
  while(baseSegments.length > 0 && iriSegments.length > last) {
    if(baseSegments[0] !== iriSegments[0]) {
      break;
    }
    baseSegments.shift();
    iriSegments.shift();
  }

  // use '../' for each non-matching base segment
  var rval = '';
  if(baseSegments.length > 0) {
    // don't count the last segment (if it ends with '/' last path doesn't
    // count and if it doesn't end with '/' it isn't a path)
    baseSegments.pop();
    for(var i = 0; i < baseSegments.length; ++i) {
      rval += '../';
    }
  }

  // prepend remaining segments
  rval += iriSegments.join('/');

  // add query and hash
  if(rel.query !== null) {
    rval += '?' + rel.query;
  }
  if(rel.fragment !== null) {
    rval += '#' + rel.fragment;
  }

  // handle empty base
  if(rval === '') {
    rval = './';
  }

  return rval;
}

/**
 * Gets the initial context.
 *
 * @param options the options to use:
 *          [base] the document base IRI.
 *
 * @return the initial context.
 */
function _getInitialContext(options) {
  var base = jsonld.url.parse(options.base || '');
  return {
    '@base': base,
    mappings: {},
    inverse: null,
    getInverse: _createInverseContext,
    clone: _cloneActiveContext
  };

  /**
   * Generates an inverse context for use in the compaction algorithm, if
   * not already generated for the given active context.
   *
   * @return the inverse context.
   */
  function _createInverseContext() {
    var activeCtx = this;

    // lazily create inverse
    if(activeCtx.inverse) {
      return activeCtx.inverse;
    }
    var inverse = activeCtx.inverse = {};

    // variables for building fast CURIE map
    var fastCurieMap = activeCtx.fastCurieMap = {};
    var irisToTerms = {};

    // handle default language
    var defaultLanguage = activeCtx['@language'] || '@none';

    // create term selections for each mapping in the context, ordered by
    // shortest and then lexicographically least
    var mappings = activeCtx.mappings;
    var terms = Object.keys(mappings).sort(_compareShortestLeast);
    for(var i = 0; i < terms.length; ++i) {
      var term = terms[i];
      var mapping = mappings[term];
      if(mapping === null) {
        continue;
      }

      var container = mapping['@container'] || '@none';

      // iterate over every IRI in the mapping
      var ids = mapping['@id'];
      if(!_isArray(ids)) {
        ids = [ids];
      }
      for(var ii = 0; ii < ids.length; ++ii) {
        var iri = ids[ii];
        var entry = inverse[iri];
        var isKeyword = _isKeyword(iri);

        if(!entry) {
          // initialize entry
          inverse[iri] = entry = {};

          if(!isKeyword && !mapping._termHasColon) {
            // init IRI to term map and fast CURIE prefixes
            irisToTerms[iri] = [term];
            var fastCurieEntry = {iri: iri, terms: irisToTerms[iri]};
            if(iri[0] in fastCurieMap) {
              fastCurieMap[iri[0]].push(fastCurieEntry);
            } else {
              fastCurieMap[iri[0]] = [fastCurieEntry];
            }
          }
        } else if(!isKeyword && !mapping._termHasColon) {
          // add IRI to term match
          irisToTerms[iri].push(term);
        }

        // add new entry
        if(!entry[container]) {
          entry[container] = {
            '@language': {},
            '@type': {}
          };
        }
        entry = entry[container];

        if(mapping.reverse) {
          // term is preferred for values using @reverse
          _addPreferredTerm(mapping, term, entry['@type'], '@reverse');
        } else if('@type' in mapping) {
          // term is preferred for values using specific type
          _addPreferredTerm(mapping, term, entry['@type'], mapping['@type']);
        } else if('@language' in mapping) {
          // term is preferred for values using specific language
          var language = mapping['@language'] || '@null';
          _addPreferredTerm(mapping, term, entry['@language'], language);
        } else {
          // term is preferred for values w/default language or no type and
          // no language
          // add an entry for the default language
          _addPreferredTerm(mapping, term, entry['@language'], defaultLanguage);

          // add entries for no type and no language
          _addPreferredTerm(mapping, term, entry['@type'], '@none');
          _addPreferredTerm(mapping, term, entry['@language'], '@none');
        }
      }
    }

    // build fast CURIE map
    for(var key in fastCurieMap) {
      _buildIriMap(fastCurieMap, key, 1);
    }

    return inverse;
  }

  /**
   * Runs a recursive algorithm to build a lookup map for quickly finding
   * potential CURIEs.
   *
   * @param iriMap the map to build.
   * @param key the current key in the map to work on.
   * @param idx the index into the IRI to compare.
   */
  function _buildIriMap(iriMap, key, idx) {
    var entries = iriMap[key];
    var next = iriMap[key] = {};

    var iri;
    var letter;
    for(var i = 0; i < entries.length; ++i) {
      iri = entries[i].iri;
      if(idx >= iri.length) {
        letter = '';
      } else {
        letter = iri[idx];
      }
      if(letter in next) {
        next[letter].push(entries[i]);
      } else {
        next[letter] = [entries[i]];
      }
    }

    for(var key in next) {
      if(key === '') {
        continue;
      }
      _buildIriMap(next, key, idx + 1);
    }
  }

  /**
   * Adds the term for the given entry if not already added.
   *
   * @param mapping the term mapping.
   * @param term the term to add.
   * @param entry the inverse context typeOrLanguage entry to add to.
   * @param typeOrLanguageValue the key in the entry to add to.
   */
  function _addPreferredTerm(mapping, term, entry, typeOrLanguageValue) {
    if(!(typeOrLanguageValue in entry)) {
      entry[typeOrLanguageValue] = term;
    }
  }

  /**
   * Clones an active context, creating a child active context.
   *
   * @return a clone (child) of the active context.
   */
  function _cloneActiveContext() {
    var child = {};
    child['@base'] = this['@base'];
    child.mappings = _clone(this.mappings);
    child.clone = this.clone;
    child.inverse = null;
    child.getInverse = this.getInverse;
    if('@language' in this) {
      child['@language'] = this['@language'];
    }
    if('@vocab' in this) {
      child['@vocab'] = this['@vocab'];
    }
    return child;
  }
}

/**
 * Returns whether or not the given value is a keyword.
 *
 * @param v the value to check.
 *
 * @return true if the value is a keyword, false if not.
 */
function _isKeyword(v) {
  if(!_isString(v)) {
    return false;
  }
  switch(v) {
  case '@base':
  case '@context':
  case '@container':
  case '@default':
  case '@embed':
  case '@explicit':
  case '@graph':
  case '@id':
  case '@index':
  case '@language':
  case '@list':
  case '@omitDefault':
  case '@preserve':
  case '@requireAll':
  case '@reverse':
  case '@set':
  case '@type':
  case '@value':
  case '@vocab':
    return true;
  }
  return false;
}

/**
 * Returns true if the given value is an Object.
 *
 * @param v the value to check.
 *
 * @return true if the value is an Object, false if not.
 */
function _isObject(v) {
  return (Object.prototype.toString.call(v) === '[object Object]');
}

/**
 * Returns true if the given value is an empty Object.
 *
 * @param v the value to check.
 *
 * @return true if the value is an empty Object, false if not.
 */
function _isEmptyObject(v) {
  return _isObject(v) && Object.keys(v).length === 0;
}

/**
 * Returns true if the given value is an Array.
 *
 * @param v the value to check.
 *
 * @return true if the value is an Array, false if not.
 */
function _isArray(v) {
  return Array.isArray(v);
}

/**
 * Throws an exception if the given value is not a valid @type value.
 *
 * @param v the value to check.
 */
function _validateTypeValue(v) {
  // can be a string or an empty object
  if(_isString(v) || _isEmptyObject(v)) {
    return;
  }

  // must be an array
  var isValid = false;
  if(_isArray(v)) {
    // must contain only strings
    isValid = true;
    for(var i = 0; i < v.length; ++i) {
      if(!(_isString(v[i]))) {
        isValid = false;
        break;
      }
    }
  }

  if(!isValid) {
    throw new JsonLdError(
      'Invalid JSON-LD syntax; "@type" value must a string, an array of ' +
      'strings, or an empty object.', 'jsonld.SyntaxError',
      {code: 'invalid type value', value: v});
  }
}

/**
 * Returns true if the given value is a String.
 *
 * @param v the value to check.
 *
 * @return true if the value is a String, false if not.
 */
function _isString(v) {
  return (typeof v === 'string' ||
    Object.prototype.toString.call(v) === '[object String]');
}

/**
 * Returns true if the given value is a Number.
 *
 * @param v the value to check.
 *
 * @return true if the value is a Number, false if not.
 */
function _isNumber(v) {
  return (typeof v === 'number' ||
    Object.prototype.toString.call(v) === '[object Number]');
}

/**
 * Returns true if the given value is a double.
 *
 * @param v the value to check.
 *
 * @return true if the value is a double, false if not.
 */
function _isDouble(v) {
  return _isNumber(v) && String(v).indexOf('.') !== -1;
}

/**
 * Returns true if the given value is numeric.
 *
 * @param v the value to check.
 *
 * @return true if the value is numeric, false if not.
 */
function _isNumeric(v) {
  return !isNaN(parseFloat(v)) && isFinite(v);
}

/**
 * Returns true if the given value is a Boolean.
 *
 * @param v the value to check.
 *
 * @return true if the value is a Boolean, false if not.
 */
function _isBoolean(v) {
  return (typeof v === 'boolean' ||
    Object.prototype.toString.call(v) === '[object Boolean]');
}

/**
 * Returns true if the given value is undefined.
 *
 * @param v the value to check.
 *
 * @return true if the value is undefined, false if not.
 */
function _isUndefined(v) {
  return (typeof v === 'undefined');
}

/**
 * Returns true if the given value is a subject with properties.
 *
 * @param v the value to check.
 *
 * @return true if the value is a subject with properties, false if not.
 */
function _isSubject(v) {
  // Note: A value is a subject if all of these hold true:
  // 1. It is an Object.
  // 2. It is not a @value, @set, or @list.
  // 3. It has more than 1 key OR any existing key is not @id.
  var rval = false;
  if(_isObject(v) &&
    !(('@value' in v) || ('@set' in v) || ('@list' in v))) {
    var keyCount = Object.keys(v).length;
    rval = (keyCount > 1 || !('@id' in v));
  }
  return rval;
}

/**
 * Returns true if the given value is a subject reference.
 *
 * @param v the value to check.
 *
 * @return true if the value is a subject reference, false if not.
 */
function _isSubjectReference(v) {
  // Note: A value is a subject reference if all of these hold true:
  // 1. It is an Object.
  // 2. It has a single key: @id.
  return (_isObject(v) && Object.keys(v).length === 1 && ('@id' in v));
}

/**
 * Returns true if the given value is a @value.
 *
 * @param v the value to check.
 *
 * @return true if the value is a @value, false if not.
 */
function _isValue(v) {
  // Note: A value is a @value if all of these hold true:
  // 1. It is an Object.
  // 2. It has the @value property.
  return _isObject(v) && ('@value' in v);
}

/**
 * Returns true if the given value is a @list.
 *
 * @param v the value to check.
 *
 * @return true if the value is a @list, false if not.
 */
function _isList(v) {
  // Note: A value is a @list if all of these hold true:
  // 1. It is an Object.
  // 2. It has the @list property.
  return _isObject(v) && ('@list' in v);
}

/**
 * Returns true if the given value is a blank node.
 *
 * @param v the value to check.
 *
 * @return true if the value is a blank node, false if not.
 */
function _isBlankNode(v) {
  // Note: A value is a blank node if all of these hold true:
  // 1. It is an Object.
  // 2. If it has an @id key its value begins with '_:'.
  // 3. It has no keys OR is not a @value, @set, or @list.
  var rval = false;
  if(_isObject(v)) {
    if('@id' in v) {
      rval = (v['@id'].indexOf('_:') === 0);
    } else {
      rval = (Object.keys(v).length === 0 ||
        !(('@value' in v) || ('@set' in v) || ('@list' in v)));
    }
  }
  return rval;
}

/**
 * Returns true if the given value is an absolute IRI, false if not.
 *
 * @param v the value to check.
 *
 * @return true if the value is an absolute IRI, false if not.
 */
function _isAbsoluteIri(v) {
  return _isString(v) && v.indexOf(':') !== -1;
}

/**
 * Clones an object, array, or string/number. If a typed JavaScript object
 * is given, such as a Date, it will be converted to a string.
 *
 * @param value the value to clone.
 *
 * @return the cloned value.
 */
function _clone(value) {
  if(value && typeof value === 'object') {
    var rval;
    if(_isArray(value)) {
      rval = [];
      for(var i = 0; i < value.length; ++i) {
        rval[i] = _clone(value[i]);
      }
    } else if(_isObject(value)) {
      rval = {};
      for(var key in value) {
        rval[key] = _clone(value[key]);
      }
    } else {
      rval = value.toString();
    }
    return rval;
  }
  return value;
}

/**
 * Finds all @context URLs in the given JSON-LD input.
 *
 * @param input the JSON-LD input.
 * @param urls a map of URLs (url => false/@contexts).
 * @param replace true to replace the URLs in the given input with the
 *           @contexts from the urls map, false not to.
 * @param base the base IRI to use to resolve relative IRIs.
 *
 * @return true if new URLs to retrieve were found, false if not.
 */
function _findContextUrls(input, urls, replace, base) {
  var count = Object.keys(urls).length;
  if(_isArray(input)) {
    for(var i = 0; i < input.length; ++i) {
      _findContextUrls(input[i], urls, replace, base);
    }
    return (count < Object.keys(urls).length);
  } else if(_isObject(input)) {
    for(var key in input) {
      if(key !== '@context') {
        _findContextUrls(input[key], urls, replace, base);
        continue;
      }

      // get @context
      var ctx = input[key];

      // array @context
      if(_isArray(ctx)) {
        var length = ctx.length;
        for(var i = 0; i < length; ++i) {
          var _ctx = ctx[i];
          if(_isString(_ctx)) {
            _ctx = jsonld.prependBase(base, _ctx);
            // replace w/@context if requested
            if(replace) {
              _ctx = urls[_ctx];
              if(_isArray(_ctx)) {
                // add flattened context
                Array.prototype.splice.apply(ctx, [i, 1].concat(_ctx));
                i += _ctx.length - 1;
                length = ctx.length;
              } else {
                ctx[i] = _ctx;
              }
            } else if(!(_ctx in urls)) {
              // @context URL found
              urls[_ctx] = false;
            }
          }
        }
      } else if(_isString(ctx)) {
        // string @context
        ctx = jsonld.prependBase(base, ctx);
        // replace w/@context if requested
        if(replace) {
          input[key] = urls[ctx];
        } else if(!(ctx in urls)) {
          // @context URL found
          urls[ctx] = false;
        }
      }
    }
    return (count < Object.keys(urls).length);
  }
  return false;
}

/**
 * Retrieves external @context URLs using the given document loader. Every
 * instance of @context in the input that refers to a URL will be replaced
 * with the JSON @context found at that URL.
 *
 * @param input the JSON-LD input with possible contexts.
 * @param options the options to use:
 *          documentLoader(url, callback(err, remoteDoc)) the document loader.
 * @param callback(err, input) called once the operation completes.
 */
function _retrieveContextUrls(input, options, callback) {
  // if any error occurs during URL resolution, quit
  var error = null;

  // recursive document loader
  var documentLoader = options.documentLoader;
  var retrieve = function(input, cycles, documentLoader, base, callback) {
    if(Object.keys(cycles).length > MAX_CONTEXT_URLS) {
      error = new JsonLdError(
        'Maximum number of @context URLs exceeded.',
        'jsonld.ContextUrlError',
        {code: 'loading remote context failed', max: MAX_CONTEXT_URLS});
      return callback(error);
    }

    // for tracking the URLs to retrieve
    var urls = {};

    // finished will be called once the URL queue is empty
    var finished = function() {
      // replace all URLs in the input
      _findContextUrls(input, urls, true, base);
      callback(null, input);
    };

    // find all URLs in the given input
    if(!_findContextUrls(input, urls, false, base)) {
      // no new URLs in input
      finished();
    }

    // queue all unretrieved URLs
    var queue = [];
    for(var url in urls) {
      if(urls[url] === false) {
        queue.push(url);
      }
    }

    // retrieve URLs in queue
    var count = queue.length;
    for(var i = 0; i < queue.length; ++i) {
      (function(url) {
        // check for context URL cycle
        if(url in cycles) {
          error = new JsonLdError(
            'Cyclical @context URLs detected.',
            'jsonld.ContextUrlError',
            {code: 'recursive context inclusion', url: url});
          return callback(error);
        }
        var _cycles = _clone(cycles);
        _cycles[url] = true;
        var done = function(err, remoteDoc) {
          // short-circuit if there was an error with another URL
          if(error) {
            return;
          }

          var ctx = remoteDoc ? remoteDoc.document : null;

          // parse string context as JSON
          if(!err && _isString(ctx)) {
            try {
              ctx = JSON.parse(ctx);
            } catch(ex) {
              err = ex;
            }
          }

          // ensure ctx is an object
          if(err) {
            err = new JsonLdError(
              'Dereferencing a URL did not result in a valid JSON-LD object. ' +
              'Possible causes are an inaccessible URL perhaps due to ' +
              'a same-origin policy (ensure the server uses CORS if you are ' +
              'using client-side JavaScript), too many redirects, a ' +
              'non-JSON response, or more than one HTTP Link Header was ' +
              'provided for a remote context.',
              'jsonld.InvalidUrl',
              {code: 'loading remote context failed', url: url, cause: err});
          } else if(!_isObject(ctx)) {
            err = new JsonLdError(
              'Dereferencing a URL did not result in a JSON object. The ' +
              'response was valid JSON, but it was not a JSON object.',
              'jsonld.InvalidUrl',
              {code: 'invalid remote context', url: url, cause: err});
          }
          if(err) {
            error = err;
            return callback(error);
          }

          // use empty context if no @context key is present
          if(!('@context' in ctx)) {
            ctx = {'@context': {}};
          } else {
            ctx = {'@context': ctx['@context']};
          }

          // append context URL to context if given
          if(remoteDoc.contextUrl) {
            if(!_isArray(ctx['@context'])) {
              ctx['@context'] = [ctx['@context']];
            }
            ctx['@context'].push(remoteDoc.contextUrl);
          }

          // recurse
          retrieve(ctx, _cycles, documentLoader, url, function(err, ctx) {
            if(err) {
              return callback(err);
            }
            urls[url] = ctx['@context'];
            count -= 1;
            if(count === 0) {
              finished();
            }
          });
        };
        var promise = documentLoader(url, done);
        if(promise && 'then' in promise) {
          promise.then(done.bind(null, null), done);
        }
      }(queue[i]));
    }
  };
  retrieve(input, {}, documentLoader, options.base, callback);
}

// define js 1.8.5 Object.keys method if not present
if(!Object.keys) {
  Object.keys = function(o) {
    if(o !== Object(o)) {
      throw new TypeError('Object.keys called on non-object');
    }
    var rval = [];
    for(var p in o) {
      if(Object.prototype.hasOwnProperty.call(o, p)) {
        rval.push(p);
      }
    }
    return rval;
  };
}

/**
 * Parses RDF in the form of N-Quads.
 *
 * @param input the N-Quads input to parse.
 *
 * @return an RDF dataset.
 */
function _parseNQuads(input) {
  // define partial regexes
  var iri = '(?:<([^:]+:[^>]*)>)';
  var bnode = '(_:(?:[A-Za-z0-9]+))';
  var plain = '"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"';
  var datatype = '(?:\\^\\^' + iri + ')';
  var language = '(?:@([a-z]+(?:-[a-z0-9]+)*))';
  var literal = '(?:' + plain + '(?:' + datatype + '|' + language + ')?)';
  var comment = '(?:#.*)?';
  var ws = '[ \\t]+';
  var wso = '[ \\t]*';
  var eoln = /(?:\r\n)|(?:\n)|(?:\r)/g;
  var empty = new RegExp('^' + wso + comment + '$');

  // define quad part regexes
  var subject = '(?:' + iri + '|' + bnode + ')' + ws;
  var property = iri + ws;
  var object = '(?:' + iri + '|' + bnode + '|' + literal + ')' + wso;
  var graphName = '(?:\\.|(?:(?:' + iri + '|' + bnode + ')' + wso + '\\.))';

  // full quad regex
  var quad = new RegExp(
    '^' + wso + subject + property + object + graphName + wso + comment + '$');

  // build RDF dataset
  var dataset = {};

  // split N-Quad input into lines
  var lines = input.split(eoln);
  var lineNumber = 0;
  for(var li = 0; li < lines.length; ++li) {
    var line = lines[li];
    lineNumber++;

    // skip empty lines
    if(empty.test(line)) {
      continue;
    }

    // parse quad
    var match = line.match(quad);
    if(match === null) {
      throw new JsonLdError(
        'Error while parsing N-Quads; invalid quad.',
        'jsonld.ParseError', {line: lineNumber});
    }

    // create RDF triple
    var triple = {};

    // get subject
    if(!_isUndefined(match[1])) {
      triple.subject = {type: 'IRI', value: match[1]};
    } else {
      triple.subject = {type: 'blank node', value: match[2]};
    }

    // get predicate
    triple.predicate = {type: 'IRI', value: match[3]};

    // get object
    if(!_isUndefined(match[4])) {
      triple.object = {type: 'IRI', value: match[4]};
    } else if(!_isUndefined(match[5])) {
      triple.object = {type: 'blank node', value: match[5]};
    } else {
      triple.object = {type: 'literal'};
      if(!_isUndefined(match[7])) {
        triple.object.datatype = match[7];
      } else if(!_isUndefined(match[8])) {
        triple.object.datatype = RDF_LANGSTRING;
        triple.object.language = match[8];
      } else {
        triple.object.datatype = XSD_STRING;
      }
      var unescaped = match[6]
        .replace(/\\"/g, '"')
        .replace(/\\t/g, '\t')
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\\\/g, '\\');
      triple.object.value = unescaped;
    }

    // get graph name ('@default' is used for the default graph)
    var name = '@default';
    if(!_isUndefined(match[9])) {
      name = match[9];
    } else if(!_isUndefined(match[10])) {
      name = match[10];
    }

    // initialize graph in dataset
    if(!(name in dataset)) {
      dataset[name] = [triple];
    } else {
      // add triple if unique to its graph
      var unique = true;
      var triples = dataset[name];
      for(var ti = 0; unique && ti < triples.length; ++ti) {
        if(_compareRDFTriples(triples[ti], triple)) {
          unique = false;
        }
      }
      if(unique) {
        triples.push(triple);
      }
    }
  }

  return dataset;
}

// register the N-Quads RDF parser
jsonld.registerRDFParser('application/nquads', _parseNQuads);

/**
 * Converts an RDF dataset to N-Quads.
 *
 * @param dataset the RDF dataset to convert.
 *
 * @return the N-Quads string.
 */
function _toNQuads(dataset) {
  var quads = [];
  for(var graphName in dataset) {
    var triples = dataset[graphName];
    for(var ti = 0; ti < triples.length; ++ti) {
      var triple = triples[ti];
      if(graphName === '@default') {
        graphName = null;
      }
      quads.push(_toNQuad(triple, graphName));
    }
  }
  return quads.sort().join('');
}

/**
 * Converts an RDF triple and graph name to an N-Quad string (a single quad).
 *
 * @param triple the RDF triple or quad to convert (a triple or quad may be
 *          passed, if a triple is passed then `graphName` should be given
 *          to specify the name of the graph the triple is in, `null` for
 *          the default graph).
 * @param graphName the name of the graph containing the triple, null for
 *          the default graph.
 *
 * @return the N-Quad string.
 */
function _toNQuad(triple, graphName) {
  var s = triple.subject;
  var p = triple.predicate;
  var o = triple.object;
  var g = graphName || null;
  if('name' in triple && triple.name) {
    g = triple.name.value;
  }

  var quad = '';

  // subject is an IRI
  if(s.type === 'IRI') {
    quad += '<' + s.value + '>';
  } else {
    quad += s.value;
  }
  quad += ' ';

  // predicate is an IRI
  if(p.type === 'IRI') {
    quad += '<' + p.value + '>';
  } else {
    quad += p.value;
  }
  quad += ' ';

  // object is IRI, bnode, or literal
  if(o.type === 'IRI') {
    quad += '<' + o.value + '>';
  } else if(o.type === 'blank node') {
    quad += o.value;
  } else {
    var escaped = o.value
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\"/g, '\\"');
    quad += '"' + escaped + '"';
    if(o.datatype === RDF_LANGSTRING) {
      if(o.language) {
        quad += '@' + o.language;
      }
    } else if(o.datatype !== XSD_STRING) {
      quad += '^^<' + o.datatype + '>';
    }
  }

  // graph
  if(g !== null && g !== undefined) {
    if(g.indexOf('_:') !== 0) {
      quad += ' <' + g + '>';
    } else {
      quad += ' ' + g;
    }
  }

  quad += ' .\n';
  return quad;
}

/**
 * Parses the RDF dataset found via the data object from the RDFa API.
 *
 * @param data the RDFa API data object.
 *
 * @return the RDF dataset.
 */
function _parseRdfaApiData(data) {
  var dataset = {};
  dataset['@default'] = [];

  var subjects = data.getSubjects();
  for(var si = 0; si < subjects.length; ++si) {
    var subject = subjects[si];
    if(subject === null) {
      continue;
    }

    // get all related triples
    var triples = data.getSubjectTriples(subject);
    if(triples === null) {
      continue;
    }
    var predicates = triples.predicates;
    for(var predicate in predicates) {
      // iterate over objects
      var objects = predicates[predicate].objects;
      for(var oi = 0; oi < objects.length; ++oi) {
        var object = objects[oi];

        // create RDF triple
        var triple = {};

        // add subject
        if(subject.indexOf('_:') === 0) {
          triple.subject = {type: 'blank node', value: subject};
        } else {
          triple.subject = {type: 'IRI', value: subject};
        }

        // add predicate
        if(predicate.indexOf('_:') === 0) {
          triple.predicate = {type: 'blank node', value: predicate};
        } else {
          triple.predicate = {type: 'IRI', value: predicate};
        }

        // serialize XML literal
        var value = object.value;
        if(object.type === RDF_XML_LITERAL) {
          // initialize XMLSerializer
          if(!XMLSerializer) {
            _defineXMLSerializer();
          }
          var serializer = new XMLSerializer();
          value = '';
          for(var x = 0; x < object.value.length; x++) {
            if(object.value[x].nodeType === Node.ELEMENT_NODE) {
              value += serializer.serializeToString(object.value[x]);
            } else if(object.value[x].nodeType === Node.TEXT_NODE) {
              value += object.value[x].nodeValue;
            }
          }
        }

        // add object
        triple.object = {};

        // object is an IRI
        if(object.type === RDF_OBJECT) {
          if(object.value.indexOf('_:') === 0) {
            triple.object.type = 'blank node';
          } else {
            triple.object.type = 'IRI';
          }
        } else {
          // object is a literal
          triple.object.type = 'literal';
          if(object.type === RDF_PLAIN_LITERAL) {
            if(object.language) {
              triple.object.datatype = RDF_LANGSTRING;
              triple.object.language = object.language;
            } else {
              triple.object.datatype = XSD_STRING;
            }
          } else {
            triple.object.datatype = object.type;
          }
        }
        triple.object.value = value;

        // add triple to dataset in default graph
        dataset['@default'].push(triple);
      }
    }
  }

  return dataset;
}

// register the RDFa API RDF parser
jsonld.registerRDFParser('rdfa-api', _parseRdfaApiData);

/**
 * Creates a new IdentifierIssuer. A IdentifierIssuer issues unique
 * identifiers, keeping track of any previously issued identifiers.
 *
 * @param prefix the prefix to use ('<prefix><counter>').
 */
function IdentifierIssuer(prefix) {
  this.prefix = prefix;
  this.counter = 0;
  this.existing = {};
}
jsonld.IdentifierIssuer = IdentifierIssuer;
// backwards-compability
jsonld.UniqueNamer = IdentifierIssuer;

/**
 * Copies this IdentifierIssuer.
 *
 * @return a copy of this IdentifierIssuer.
 */
IdentifierIssuer.prototype.clone = function() {
  var copy = new IdentifierIssuer(this.prefix);
  copy.counter = this.counter;
  copy.existing = _clone(this.existing);
  return copy;
};

/**
 * Gets the new identifier for the given old identifier, where if no old
 * identifier is given a new identifier will be generated.
 *
 * @param [old] the old identifier to get the new identifier for.
 *
 * @return the new identifier.
 */
IdentifierIssuer.prototype.getId = function(old) {
  // return existing old identifier
  if(old && old in this.existing) {
    return this.existing[old];
  }

  // get next identifier
  var identifier = this.prefix + this.counter;
  this.counter += 1;

  // save mapping
  if(old) {
    this.existing[old] = identifier;
  }

  return identifier;
};
// alias
IdentifierIssuer.prototype.getName = IdentifierIssuer.prototype.getName;

/**
 * Returns true if the given old identifer has already been assigned a new
 * identifier.
 *
 * @param old the old identifier to check.
 *
 * @return true if the old identifier has been assigned a new identifier, false
 *   if not.
 */
IdentifierIssuer.prototype.hasId = function(old) {
  return (old in this.existing);
};
// alias
IdentifierIssuer.prototype.isNamed = IdentifierIssuer.prototype.hasId;

/**
 * A Permutator iterates over all possible permutations of the given array
 * of elements.
 *
 * @param list the array of elements to iterate over.
 */
var Permutator = function(list) {
  // original array
  this.list = list.sort();
  // indicates whether there are more permutations
  this.done = false;
  // directional info for permutation algorithm
  this.left = {};
  for(var i = 0; i < list.length; ++i) {
    this.left[list[i]] = true;
  }
};

/**
 * Returns true if there is another permutation.
 *
 * @return true if there is another permutation, false if not.
 */
Permutator.prototype.hasNext = function() {
  return !this.done;
};

/**
 * Gets the next permutation. Call hasNext() to ensure there is another one
 * first.
 *
 * @return the next permutation.
 */
Permutator.prototype.next = function() {
  // copy current permutation
  var rval = this.list.slice();

  /* Calculate the next permutation using the Steinhaus-Johnson-Trotter
   permutation algorithm. */

  // get largest mobile element k
  // (mobile: element is greater than the one it is looking at)
  var k = null;
  var pos = 0;
  var length = this.list.length;
  for(var i = 0; i < length; ++i) {
    var element = this.list[i];
    var left = this.left[element];
    if((k === null || element > k) &&
      ((left && i > 0 && element > this.list[i - 1]) ||
      (!left && i < (length - 1) && element > this.list[i + 1]))) {
      k = element;
      pos = i;
    }
  }

  // no more permutations
  if(k === null) {
    this.done = true;
  } else {
    // swap k and the element it is looking at
    var swap = this.left[k] ? pos - 1 : pos + 1;
    this.list[pos] = this.list[swap];
    this.list[swap] = k;

    // reverse the direction of all elements larger than k
    for(var i = 0; i < length; ++i) {
      if(this.list[i] > k) {
        this.left[this.list[i]] = !this.left[this.list[i]];
      }
    }
  }

  return rval;
};

//////////////////////// DEFINE NORMALIZATION HASH API ////////////////////////

/**
 * Creates a new NormalizeHash for use by the given normalization algorithm.
 *
 * @param algorithm the RDF Dataset Normalization algorithm to use:
 *          'URDNA2015' or 'URGNA2012'.
 */
var NormalizeHash = function(algorithm) {
  if(!(this instanceof NormalizeHash)) {
    return new NormalizeHash(algorithm);
  }
  if(['URDNA2015', 'URGNA2012'].indexOf(algorithm) === -1) {
    throw new Error(
      'Invalid RDF Dataset Normalization algorithm: ' + algorithm);
  }
  NormalizeHash._init.call(this, algorithm);
};
NormalizeHash.hashNQuads = function(algorithm, nquads) {
  var md = new NormalizeHash(algorithm);
  for(var i = 0; i < nquads.length; ++i) {
    md.update(nquads[i]);
  }
  return md.digest();
};

// switch definition of NormalizeHash based on environment
(function(_nodejs) {

if(_nodejs) {
  // define NormalizeHash using native crypto lib
  var crypto = require('crypto');
  NormalizeHash._init = function(algorithm) {
    if(algorithm === 'URDNA2015') {
      algorithm = 'sha256';
    } else {
      // assume URGNA2012
      algorithm = 'sha1';
    }
    this.md = crypto.createHash(algorithm);
  };
  NormalizeHash.prototype.update = function(msg) {
    return this.md.update(msg, 'utf8');
  };
  NormalizeHash.prototype.digest = function() {
    return this.md.digest('hex');
  };
  return;
}

// define NormalizeHash using JavaScript
NormalizeHash._init = function(algorithm) {
  if(algorithm === 'URDNA2015') {
    algorithm = new sha256.Algorithm();
  } else {
    // assume URGNA2012
    algorithm = new sha1.Algorithm();
  }
  this.md = new MessageDigest(algorithm);
};
NormalizeHash.prototype.update = function(msg) {
  return this.md.update(msg);
};
NormalizeHash.prototype.digest = function() {
  return this.md.digest().toHex();
};

/////////////////////////// DEFINE MESSAGE DIGEST API /////////////////////////

/**
 * Creates a new MessageDigest.
 *
 * @param algorithm the algorithm to use.
 */
var MessageDigest = function(algorithm) {
  if(!(this instanceof MessageDigest)) {
    return new MessageDigest(algorithm);
  }

  this._algorithm = algorithm;

  // create shared padding as needed
  if(!MessageDigest._padding ||
    MessageDigest._padding.length < this._algorithm.blockSize) {
    MessageDigest._padding = String.fromCharCode(128);
    var c = String.fromCharCode(0x00);
    var n = 64;
    while(n > 0) {
      if(n & 1) {
        MessageDigest._padding += c;
      }
      n >>>= 1;
      if(n > 0) {
        c += c;
      }
    }
  }

  // start digest automatically for first time
  this.start();
};

/**
 * Starts the digest.
 *
 * @return this digest object.
 */
MessageDigest.prototype.start = function() {
  // up to 56-bit message length for convenience
  this.messageLength = 0;

  // full message length
  this.fullMessageLength = [];
  var int32s = this._algorithm.messageLengthSize / 4;
  for(var i = 0; i < int32s; ++i) {
    this.fullMessageLength.push(0);
  }

  // input buffer
  this._input = new MessageDigest.ByteBuffer();

  // get starting state
  this.state = this._algorithm.start();

  return this;
};

/**
 * Updates the digest with the given message input. The input must be
 * a string of characters.
 *
 * @param msg the message input to update with (ByteBuffer or string).
 *
 * @return this digest object.
 */
MessageDigest.prototype.update = function(msg) {
  // encode message as a UTF-8 encoded binary string
  msg = new MessageDigest.ByteBuffer(unescape(encodeURIComponent(msg)));

  // update message length
  this.messageLength += msg.length();
  var len = msg.length();
  len = [(len / 0x100000000) >>> 0, len >>> 0];
  for(var i = this.fullMessageLength.length - 1; i >= 0; --i) {
    this.fullMessageLength[i] += len[1];
    len[1] = len[0] + ((this.fullMessageLength[i] / 0x100000000) >>> 0);
    this.fullMessageLength[i] = this.fullMessageLength[i] >>> 0;
    len[0] = ((len[1] / 0x100000000) >>> 0);
  }

  // add bytes to input buffer
  this._input.putBytes(msg.bytes());

  // digest blocks
  while(this._input.length() >= this._algorithm.blockSize) {
    this.state = this._algorithm.digest(this.state, this._input);
  }

  // compact input buffer every 2K or if empty
  if(this._input.read > 2048 || this._input.length() === 0) {
    this._input.compact();
  }

  return this;
};

/**
 * Produces the digest.
 *
 * @return a byte buffer containing the digest value.
 */
MessageDigest.prototype.digest = function() {
  /* Note: Here we copy the remaining bytes in the input buffer and add the
  appropriate padding. Then we do the final update on a copy of the state so
  that if the user wants to get intermediate digests they can do so. */

  /* Determine the number of bytes that must be added to the message to
  ensure its length is appropriately congruent. In other words, the data to
  be digested must be a multiple of `blockSize`. This data includes the
  message, some padding, and the length of the message. Since the length of
  the message will be encoded as `messageLengthSize` bytes, that means that
  the last segment of the data must have `blockSize` - `messageLengthSize`
  bytes of message and padding. Therefore, the length of the message plus the
  padding must be congruent to X mod `blockSize` because
  `blockSize` - `messageLengthSize` = X.

  For example, SHA-1 is congruent to 448 mod 512 and SHA-512 is congruent to
  896 mod 1024. SHA-1 uses a `blockSize` of 64 bytes (512 bits) and a
  `messageLengthSize` of 8 bytes (64 bits). SHA-512 uses a `blockSize` of
  128 bytes (1024 bits) and a `messageLengthSize` of 16 bytes (128 bits).

  In order to fill up the message length it must be filled with padding that
  begins with 1 bit followed by all 0 bits. Padding must *always* be present,
  so if the message length is already congruent, then `blockSize` padding bits
  must be added. */

  // create final block
  var finalBlock = new MessageDigest.ByteBuffer();
  finalBlock.putBytes(this._input.bytes());

  // compute remaining size to be digested (include message length size)
  var remaining = (
    this.fullMessageLength[this.fullMessageLength.length - 1] +
    this._algorithm.messageLengthSize);

  // add padding for overflow blockSize - overflow
  // _padding starts with 1 byte with first bit is set (byte value 128), then
  // there may be up to (blockSize - 1) other pad bytes
  var overflow = remaining & (this._algorithm.blockSize - 1);
  finalBlock.putBytes(MessageDigest._padding.substr(
    0, this._algorithm.blockSize - overflow));

  // serialize message length in bits in big-endian order; since length
  // is stored in bytes we multiply by 8 (left shift by 3 and merge in
  // remainder from )
  var messageLength = new MessageDigest.ByteBuffer();
  for(var i = 0; i < this.fullMessageLength.length; ++i) {
    messageLength.putInt32((this.fullMessageLength[i] << 3) |
      (this.fullMessageLength[i + 1] >>> 28));
  }

  // write the length of the message (algorithm-specific)
  this._algorithm.writeMessageLength(finalBlock, messageLength);

  // digest final block
  var state = this._algorithm.digest(this.state.copy(), finalBlock);

  // write state to buffer
  var rval = new MessageDigest.ByteBuffer();
  state.write(rval);
  return rval;
};

/**
 * Creates a simple byte buffer for message digest operations.
 *
 * @param data the data to put in the buffer.
 */
MessageDigest.ByteBuffer = function(data) {
  if(typeof data === 'string') {
    this.data = data;
  } else {
    this.data = '';
  }
  this.read = 0;
};

/**
 * Puts a 32-bit integer into this buffer in big-endian order.
 *
 * @param i the 32-bit integer.
 */
MessageDigest.ByteBuffer.prototype.putInt32 = function(i) {
  this.data += (
    String.fromCharCode(i >> 24 & 0xFF) +
    String.fromCharCode(i >> 16 & 0xFF) +
    String.fromCharCode(i >> 8 & 0xFF) +
    String.fromCharCode(i & 0xFF));
};

/**
 * Gets a 32-bit integer from this buffer in big-endian order and
 * advances the read pointer by 4.
 *
 * @return the word.
 */
MessageDigest.ByteBuffer.prototype.getInt32 = function() {
  var rval = (
    this.data.charCodeAt(this.read) << 24 ^
    this.data.charCodeAt(this.read + 1) << 16 ^
    this.data.charCodeAt(this.read + 2) << 8 ^
    this.data.charCodeAt(this.read + 3));
  this.read += 4;
  return rval;
};

/**
 * Puts the given bytes into this buffer.
 *
 * @param bytes the bytes as a binary-encoded string.
 */
MessageDigest.ByteBuffer.prototype.putBytes = function(bytes) {
  this.data += bytes;
};

/**
 * Gets the bytes in this buffer.
 *
 * @return a string full of UTF-8 encoded characters.
 */
MessageDigest.ByteBuffer.prototype.bytes = function() {
  return this.data.slice(this.read);
};

/**
 * Gets the number of bytes in this buffer.
 *
 * @return the number of bytes in this buffer.
 */
MessageDigest.ByteBuffer.prototype.length = function() {
  return this.data.length - this.read;
};

/**
 * Compacts this buffer.
 */
MessageDigest.ByteBuffer.prototype.compact = function() {
  this.data = this.data.slice(this.read);
  this.read = 0;
};

/**
 * Converts this buffer to a hexadecimal string.
 *
 * @return a hexadecimal string.
 */
MessageDigest.ByteBuffer.prototype.toHex = function() {
  var rval = '';
  for(var i = this.read; i < this.data.length; ++i) {
    var b = this.data.charCodeAt(i);
    if(b < 16) {
      rval += '0';
    }
    rval += b.toString(16);
  }
  return rval;
};

///////////////////////////// DEFINE SHA-1 ALGORITHM //////////////////////////

var sha1 = {
  // used for word storage
  _w: null
};

sha1.Algorithm = function() {
  this.name = 'sha1',
  this.blockSize = 64;
  this.digestLength = 20;
  this.messageLengthSize = 8;
};

sha1.Algorithm.prototype.start = function() {
  if(!sha1._w) {
    sha1._w = new Array(80);
  }
  return sha1._createState();
};

sha1.Algorithm.prototype.writeMessageLength = function(
  finalBlock, messageLength) {
  // message length is in bits and in big-endian order; simply append
  finalBlock.putBytes(messageLength.bytes());
};

sha1.Algorithm.prototype.digest = function(s, input) {
  // consume 512 bit (64 byte) chunks
  var t, a, b, c, d, e, f, i;
  var len = input.length();
  var _w = sha1._w;
  while(len >= 64) {
    // initialize hash value for this chunk
    a = s.h0;
    b = s.h1;
    c = s.h2;
    d = s.h3;
    e = s.h4;

    // the _w array will be populated with sixteen 32-bit big-endian words
    // and then extended into 80 32-bit words according to SHA-1 algorithm
    // and for 32-79 using Max Locktyukhin's optimization

    // round 1
    for(i = 0; i < 16; ++i) {
      t = input.getInt32();
      _w[i] = t;
      f = d ^ (b & (c ^ d));
      t = ((a << 5) | (a >>> 27)) + f + e + 0x5A827999 + t;
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = t;
    }
    for(; i < 20; ++i) {
      t = (_w[i - 3] ^ _w[i - 8] ^ _w[i - 14] ^ _w[i - 16]);
      t = (t << 1) | (t >>> 31);
      _w[i] = t;
      f = d ^ (b & (c ^ d));
      t = ((a << 5) | (a >>> 27)) + f + e + 0x5A827999 + t;
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = t;
    }
    // round 2
    for(; i < 32; ++i) {
      t = (_w[i - 3] ^ _w[i - 8] ^ _w[i - 14] ^ _w[i - 16]);
      t = (t << 1) | (t >>> 31);
      _w[i] = t;
      f = b ^ c ^ d;
      t = ((a << 5) | (a >>> 27)) + f + e + 0x6ED9EBA1 + t;
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = t;
    }
    for(; i < 40; ++i) {
      t = (_w[i - 6] ^ _w[i - 16] ^ _w[i - 28] ^ _w[i - 32]);
      t = (t << 2) | (t >>> 30);
      _w[i] = t;
      f = b ^ c ^ d;
      t = ((a << 5) | (a >>> 27)) + f + e + 0x6ED9EBA1 + t;
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = t;
    }
    // round 3
    for(; i < 60; ++i) {
      t = (_w[i - 6] ^ _w[i - 16] ^ _w[i - 28] ^ _w[i - 32]);
      t = (t << 2) | (t >>> 30);
      _w[i] = t;
      f = (b & c) | (d & (b ^ c));
      t = ((a << 5) | (a >>> 27)) + f + e + 0x8F1BBCDC + t;
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = t;
    }
    // round 4
    for(; i < 80; ++i) {
      t = (_w[i - 6] ^ _w[i - 16] ^ _w[i - 28] ^ _w[i - 32]);
      t = (t << 2) | (t >>> 30);
      _w[i] = t;
      f = b ^ c ^ d;
      t = ((a << 5) | (a >>> 27)) + f + e + 0xCA62C1D6 + t;
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = t;
    }

    // update hash state
    s.h0 = (s.h0 + a) | 0;
    s.h1 = (s.h1 + b) | 0;
    s.h2 = (s.h2 + c) | 0;
    s.h3 = (s.h3 + d) | 0;
    s.h4 = (s.h4 + e) | 0;

    len -= 64;
  }

  return s;
};

sha1._createState = function() {
  var state = {
    h0: 0x67452301,
    h1: 0xEFCDAB89,
    h2: 0x98BADCFE,
    h3: 0x10325476,
    h4: 0xC3D2E1F0
  };
  state.copy = function() {
    var rval = sha1._createState();
    rval.h0 = state.h0;
    rval.h1 = state.h1;
    rval.h2 = state.h2;
    rval.h3 = state.h3;
    rval.h4 = state.h4;
    return rval;
  };
  state.write = function(buffer) {
    buffer.putInt32(state.h0);
    buffer.putInt32(state.h1);
    buffer.putInt32(state.h2);
    buffer.putInt32(state.h3);
    buffer.putInt32(state.h4);
  };
  return state;
};

//////////////////////////// DEFINE SHA-256 ALGORITHM /////////////////////////

var sha256 = {
  // shared state
  _k: null,
  _w: null
};

sha256.Algorithm = function() {
  this.name = 'sha256',
  this.blockSize = 64;
  this.digestLength = 32;
  this.messageLengthSize = 8;
};

sha256.Algorithm.prototype.start = function() {
  if(!sha256._k) {
    sha256._init();
  }
  return sha256._createState();
};

sha256.Algorithm.prototype.writeMessageLength = function(
  finalBlock, messageLength) {
  // message length is in bits and in big-endian order; simply append
  finalBlock.putBytes(messageLength.bytes());
};

sha256.Algorithm.prototype.digest = function(s, input) {
  // consume 512 bit (64 byte) chunks
  var t1, t2, s0, s1, ch, maj, i, a, b, c, d, e, f, g, h;
  var len = input.length();
  var _k = sha256._k;
  var _w = sha256._w;
  while(len >= 64) {
    // the w array will be populated with sixteen 32-bit big-endian words
    // and then extended into 64 32-bit words according to SHA-256
    for(i = 0; i < 16; ++i) {
      _w[i] = input.getInt32();
    }
    for(; i < 64; ++i) {
      // XOR word 2 words ago rot right 17, rot right 19, shft right 10
      t1 = _w[i - 2];
      t1 =
        ((t1 >>> 17) | (t1 << 15)) ^
        ((t1 >>> 19) | (t1 << 13)) ^
        (t1 >>> 10);
      // XOR word 15 words ago rot right 7, rot right 18, shft right 3
      t2 = _w[i - 15];
      t2 =
        ((t2 >>> 7) | (t2 << 25)) ^
        ((t2 >>> 18) | (t2 << 14)) ^
        (t2 >>> 3);
      // sum(t1, word 7 ago, t2, word 16 ago) modulo 2^32
      _w[i] = (t1 + _w[i - 7] + t2 + _w[i - 16]) | 0;
    }

    // initialize hash value for this chunk
    a = s.h0;
    b = s.h1;
    c = s.h2;
    d = s.h3;
    e = s.h4;
    f = s.h5;
    g = s.h6;
    h = s.h7;

    // round function
    for(i = 0; i < 64; ++i) {
      // Sum1(e)
      s1 =
        ((e >>> 6) | (e << 26)) ^
        ((e >>> 11) | (e << 21)) ^
        ((e >>> 25) | (e << 7));
      // Ch(e, f, g) (optimized the same way as SHA-1)
      ch = g ^ (e & (f ^ g));
      // Sum0(a)
      s0 =
        ((a >>> 2) | (a << 30)) ^
        ((a >>> 13) | (a << 19)) ^
        ((a >>> 22) | (a << 10));
      // Maj(a, b, c) (optimized the same way as SHA-1)
      maj = (a & b) | (c & (a ^ b));

      // main algorithm
      t1 = h + s1 + ch + _k[i] + _w[i];
      t2 = s0 + maj;
      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }

    // update hash state
    s.h0 = (s.h0 + a) | 0;
    s.h1 = (s.h1 + b) | 0;
    s.h2 = (s.h2 + c) | 0;
    s.h3 = (s.h3 + d) | 0;
    s.h4 = (s.h4 + e) | 0;
    s.h5 = (s.h5 + f) | 0;
    s.h6 = (s.h6 + g) | 0;
    s.h7 = (s.h7 + h) | 0;
    len -= 64;
  }

  return s;
};

sha256._createState = function() {
  var state = {
    h0: 0x6A09E667,
    h1: 0xBB67AE85,
    h2: 0x3C6EF372,
    h3: 0xA54FF53A,
    h4: 0x510E527F,
    h5: 0x9B05688C,
    h6: 0x1F83D9AB,
    h7: 0x5BE0CD19
  };
  state.copy = function() {
    var rval = sha256._createState();
    rval.h0 = state.h0;
    rval.h1 = state.h1;
    rval.h2 = state.h2;
    rval.h3 = state.h3;
    rval.h4 = state.h4;
    rval.h5 = state.h5;
    rval.h6 = state.h6;
    rval.h7 = state.h7;
    return rval;
  };
  state.write = function(buffer) {
    buffer.putInt32(state.h0);
    buffer.putInt32(state.h1);
    buffer.putInt32(state.h2);
    buffer.putInt32(state.h3);
    buffer.putInt32(state.h4);
    buffer.putInt32(state.h5);
    buffer.putInt32(state.h6);
    buffer.putInt32(state.h7);
  };
  return state;
};

sha256._init = function() {
  // create K table for SHA-256
  sha256._k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
    0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
    0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
    0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

  // used for word storage
  sha256._w = new Array(64);
};

})(_nodejs); // end definition of NormalizeHash

if(!XMLSerializer) {

var _defineXMLSerializer = function() {
  XMLSerializer = require('xmldom').XMLSerializer;
};

} // end _defineXMLSerializer

// define URL parser
// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
// with local jsonld.js modifications
jsonld.url = {};
jsonld.url.parsers = {
  simple: {
    // RFC 3986 basic parts
    keys: ['href','scheme','authority','path','query','fragment'],
    regex: /^(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/
  },
  full: {
    keys: ['href','protocol','scheme','authority','auth','user','password','hostname','port','path','directory','file','query','fragment'],
    regex: /^(([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?(?:(((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};
jsonld.url.parse = function(str, parser) {
  var parsed = {};
  var o = jsonld.url.parsers[parser || 'full'];
  var m = o.regex.exec(str);
  var i = o.keys.length;
  while(i--) {
    parsed[o.keys[i]] = (m[i] === undefined) ? null : m[i];
  }
  parsed.normalizedPath = _removeDotSegments(parsed.path, !!parsed.authority);
  return parsed;
};

/**
 * Removes dot segments from a URL path.
 *
 * @param path the path to remove dot segments from.
 * @param hasAuthority true if the URL has an authority, false if not.
 */
function _removeDotSegments(path, hasAuthority) {
  var rval = '';

  if(path.indexOf('/') === 0) {
    rval = '/';
  }

  // RFC 3986 5.2.4 (reworked)
  var input = path.split('/');
  var output = [];
  while(input.length > 0) {
    if(input[0] === '.' || (input[0] === '' && input.length > 1)) {
      input.shift();
      continue;
    }
    if(input[0] === '..') {
      input.shift();
      if(hasAuthority ||
        (output.length > 0 && output[output.length - 1] !== '..')) {
        output.pop();
      } else {
        // leading relative URL '..'
        output.push('..');
      }
      continue;
    }
    output.push(input.shift());
  }

  return rval + output.join('/');
}

if(_nodejs) {
  // use node document loader by default
  jsonld.useDocumentLoader('node');
} else if(typeof XMLHttpRequest !== 'undefined') {
  // use xhr document loader by default
  jsonld.useDocumentLoader('xhr');
}

if(_nodejs) {
  jsonld.use = function(extension) {
    switch(extension) {
      // TODO: Deprecated as of 0.4.0. Remove at some point.
      case 'request':
        // use node JSON-LD request extension
        jsonld.request = require('jsonld-request');
        break;
      default:
        throw new JsonLdError(
          'Unknown extension.',
          'jsonld.UnknownExtension', {extension: extension});
    }
  };

  // expose version
  var _module = {exports: {}, filename: __dirname};
  require('pkginfo')(_module, 'version');
  jsonld.version = _module.exports.version;
}

// end of jsonld API factory
return jsonld;
};

// external APIs:

// used to generate a new jsonld API instance
var factory = function() {
  return wrapper(function() {
    return factory();
  });
};

if(!_nodejs && (typeof define === 'function' && define.amd)) {
  // export AMD API
  define([], function() {
    // now that module is defined, wrap main jsonld API instance
    wrapper(factory);
    return factory;
  });
} else {
  // wrap the main jsonld API instance
  wrapper(factory);

  if(typeof require === 'function' &&
    typeof module !== 'undefined' && module.exports) {
    // export CommonJS/nodejs API
    module.exports = factory;
  }

  if(_browser) {
    // export simple browser API
    if(typeof jsonld === 'undefined') {
      jsonld = jsonldjs = factory;
    } else {
      jsonldjs = factory;
    }
  }
}

return factory;

})();

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},"/node_modules\\jsonld\\js")
},{"_process":1,"crypto":13,"es6-promise":2,"http":13,"jsonld-request":13,"pkginfo":13,"request":13,"util":13,"xmldom":13}],15:[function(require,module,exports){
'use strict';

var _extractAndCompact = require('./extract-and-compact.js');

var _extractAndCompact2 = _interopRequireDefault(_extractAndCompact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _extractAndCompact2.default)('jsonld', function (err, output) {
  var json = JSON.stringify(output, null, 2);
  // tell the popup we've got the goods
  chrome.runtime.sendMessage({
    jsonld: json
  });
});

(0, _extractAndCompact2.default)('turtle', function (err, output) {
  // tell the popup we've got the goods
  chrome.runtime.sendMessage({
    turtle: output
  });
});

},{"./extract-and-compact.js":16}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (as, callback) {
  switch (as) {
    case 'turtle':
      var graph = (0, _graphRdfaProcessor2.default)(document);
      callback(null, graph.toString());
      break;
    case 'jsonld':
    default:
      _jsonldRdfa2.default.fromRDF(document, { format: 'text/html' }, function (err, data) {
        if (err) console.error(err);
        _jsonldRdfa2.default.compact(data,
        // default context from RDFa 1.1 spec
        { '@context': ['https://www.w3.org/2013/json-ld-context/rdfa11',
          // plus a common prefix I personally like ^_^
          { oa: 'http://www.w3.org/ns/oa#' }] }, callback);
      });
      break;
  }
};

var _jsonldRdfa = require('./jsonld-rdfa.js');

var _jsonldRdfa2 = _interopRequireDefault(_jsonldRdfa);

var _graphRdfaProcessor = require('graph-rdfa-processor');

var _graphRdfaProcessor2 = _interopRequireDefault(_graphRdfaProcessor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;
// calls the callback; no return value
// TODO: switch to Promises

},{"./jsonld-rdfa.js":17,"graph-rdfa-processor":4}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonldRdfaParser = require('jsonld-rdfa-parser');

var _jsonldRdfaParser2 = _interopRequireDefault(_jsonldRdfaParser);

var _jsonld = require('jsonld');

var _jsonld2 = _interopRequireDefault(_jsonld);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// register the parser for content type text/html
_jsonld2.default.registerRDFParser('text/html', _jsonldRdfaParser2.default);

exports.default = _jsonld2.default;

},{"jsonld":14,"jsonld-rdfa-parser":12}]},{},[15]);
